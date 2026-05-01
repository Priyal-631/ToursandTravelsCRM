import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'
import { validateCustomerPayload, validateTourPayload } from '../utils/validators.js'

const LOST_STATUS = 'Lost'

const customerInclude = {
  tours: {
    include: {
      tour_type: true,
      state: true,
      country: true
    },
    orderBy: { start_date: 'asc' }
  },
  queries: {
    include: {
      assignedTo: {
        select: { id: true, full_name: true, email: true, role: true }
      }
    },
    orderBy: { created_at: 'desc' }
  },
  createdProfile: {
    select: { id: true, full_name: true, email: true, role: true }
  }
}

const hasQueryFilters = (query = {}) =>
  ['search', 'status', 'location', 'fromDate', 'toDate', 'year', 'page', 'limit'].some((key) => query[key] !== undefined)

const buildStatusWhere = (status) => {
  if (status === 'Active') return { NOT: { follow_up_status: LOST_STATUS } }
  if (status === 'Inactive') return { follow_up_status: LOST_STATUS }
  return {}
}

const buildCustomerWhere = ({ search = '', status = 'All', location = '', fromDate = '', toDate = '', year = '' } = {}) => {
  const clauses = []

  if (search.trim()) {
    clauses.push({
      OR: [
        { full_name: { contains: search.trim(), mode: 'insensitive' } },
        { email_id: { contains: search.trim(), mode: 'insensitive' } },
        { contact_number: { contains: search.trim() } }
      ]
    })
  }

  const statusWhere = buildStatusWhere(status)
  if (Object.keys(statusWhere).length > 0) {
    clauses.push(statusWhere)
  }

  if (location.trim()) {
    clauses.push({
      OR: [
        { departure_city: { contains: location.trim(), mode: 'insensitive' } },
        {
          tours: {
            some: {
                OR: [
                  { destination: { contains: location.trim(), mode: 'insensitive' } },
                  { state: { is: { name: { contains: location.trim(), mode: 'insensitive' } } } },
                  { country: { is: { name: { contains: location.trim(), mode: 'insensitive' } } } }
                ]
              }
            }
        }
      ]
    })
  }

  const tourDateFilters = {}
  if (fromDate) {
    tourDateFilters.gte = new Date(fromDate)
  }
  if (toDate) {
    const inclusiveToDate = new Date(toDate)
    inclusiveToDate.setHours(23, 59, 59, 999)
    tourDateFilters.lte = inclusiveToDate
  }

  if (Object.keys(tourDateFilters).length > 0) {
    clauses.push({
      tours: {
        some: {
          start_date: tourDateFilters
        }
      }
    })
  }

  if (year) {
    const parsedYear = Number.parseInt(year, 10)
    if (!Number.isNaN(parsedYear)) {
      clauses.push({
        tours: {
          some: {
            start_date: {
              gte: new Date(parsedYear, 0, 1),
              lt: new Date(parsedYear + 1, 0, 1)
            }
          }
        }
      })
    }
  }

  return clauses.length > 0 ? { AND: clauses } : {}
}

const startOfCurrentMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export const getCustomers = async (req, res) => {
  try {
    const {
      search = '',
      status = 'All',
      location = '',
      fromDate = '',
      toDate = '',
      year = ''
    } = req.query
    const where = buildCustomerWhere({ search, status, location, fromDate, toDate, year })

    if (!hasQueryFilters(req.query)) {
      const customers = await prisma.customer.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: customerInclude
      })
      return sendSuccess(res, serialize(customers), 'Customers fetched successfully')
    }

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.max(Number.parseInt(req.query.limit, 10) || 10, 1)
    const skip = (page - 1) * limit

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: customerInclude
      })
    ])

    return sendSuccess(
      res,
      {
        items: serialize(customers),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.max(Math.ceil(total / limit), 1)
        }
      },
      'Customers fetched successfully'
    )
  } catch (err) {
    console.error('Get customers error:', err)
    return sendError(res, 'Failed to fetch customers', 500)
  }
}

export const getCustomerStats = async (_req, res) => {
  try {
    const monthStart = startOfCurrentMonth()
    const [totalCustomers, activeCustomers, inactiveCustomers, newThisMonth] =
      await Promise.all([
        prisma.customer.count(),
        prisma.customer.count({ where: buildStatusWhere('Active') }),
        prisma.customer.count({ where: buildStatusWhere('Inactive') }),
        prisma.customer.count({
          where: {
            created_at: {
              gte: monthStart
            }
          }
        })
      ])

    return sendSuccess(
      res,
      {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        newThisMonth
      },
      'Customer stats fetched successfully'
    )
  } catch (err) {
    console.error('Get customer stats error:', err)
    return sendError(res, 'Failed to fetch customer stats', 500)
  }
}

export const getCustomerById = async (req, res) => {
  const { id } = req.params
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: customerInclude
    })

    if (!customer) return sendError(res, 'Customer not found', 404)

    return sendSuccess(res, serialize(customer), 'Customer fetched successfully')
  } catch (err) {
    console.error('Get customer error:', err)
    return sendError(res, 'Failed to fetch customer', 500)
  }
}

export const createCustomer = async (req, res) => {
  try {
    const { errors, data } = validateCustomerPayload(req.body)

    const hasTour = Boolean(
      req.body.tour &&
      [
        req.body.tour.destination,
        req.body.tour.package_type,
        req.body.tour.start_date,
        req.body.tour.end_date,
        req.body.tour.notes,
        req.body.tour.tour_type_id,
        req.body.tour.state_id,
        req.body.tour.country_id,
        req.body.tour.revenue,
        req.body.tour.amount_paid,
        req.body.tour.amount_pending
      ].some((value) => value !== '' && value != null)
    )

    const validatedTour = hasTour
      ? validateTourPayload(req.body.tour)
      : { errors: [], data: null }

    if (validatedTour.errors.length) {
      errors.push(...validatedTour.errors)
    }

    if (errors.length) {
      return sendError(res, errors.join(', '), 400)
    }

    // 🔥 REMOVE customer_id if it exists
    let tourData = null
    if (validatedTour.data) {
      const { customer_id, ...rest } = validatedTour.data
      tourData = rest
    }

    const customer = await prisma.customer.create({
      data: {
        ...data,
        created_by: req.profile.id,
        ...(tourData
          ? {
              tours: {
                create: {
                  ...tourData,
                  created_by: req.profile.id
                }
              }
            }
          : {})
      },
      include: customerInclude
    })

    return sendSuccess(res, serialize(customer), 'Customer created successfully', 201)
  } catch (err) {
    console.error('Create customer error:', err)
    return sendError(res, 'Failed to create customer', 500)
  }
}

export const updateCustomer = async (req, res) => {
  const { id } = req.params
  try {
    const { errors, data } = validateCustomerPayload(req.body)
    if (errors.length) return sendError(res, errors.join(', '), 400)

    const customer = await prisma.customer.update({
      where: { id },
      data,
      include: customerInclude
    })

    return sendSuccess(res, serialize(customer), 'Customer updated successfully')
  } catch (err) {
    console.error('Update customer error:', err)
    if (err.code === 'P2025') return sendError(res, 'Customer not found', 404)
    return sendError(res, 'Failed to update customer', 500)
  }
}

export const deleteCustomer = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.customer.delete({ where: { id } })
    return sendSuccess(res, null, 'Customer deleted successfully')
  } catch (err) {
    console.error('Delete customer error:', err)
    if (err.code === 'P2025') return sendError(res, 'Customer not found', 404)
    return sendError(res, 'Failed to delete customer', 500)
  }
}
