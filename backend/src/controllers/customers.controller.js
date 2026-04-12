import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'
import { validateCustomerPayload, validateTourPayload } from '../utils/validators.js'

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

export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { created_at: 'desc' },
      include: customerInclude
    })
    return sendSuccess(res, serialize(customers), 'Customers fetched successfully')
  } catch (err) {
    console.error('Get customers error:', err)
    return sendError(res, 'Failed to fetch customers', 500)
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