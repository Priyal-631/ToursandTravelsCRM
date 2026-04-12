import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'
import { validateQueryPayload } from '../utils/validators.js'

const queryInclude = {
  customer: {
    select: {
      id: true,
      full_name: true,
      email_id: true,
      contact_number: true
    }
  },
  assignedTo: {
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true
    }
  }
}

export const getQueries = async (req, res) => {
  try {
    const queries = await prisma.query.findMany({
      orderBy: { created_at: 'desc' },
      include: queryInclude
    })

    return sendSuccess(res, serialize(queries), 'Queries fetched successfully')
  } catch (err) {
    console.error('Get queries error:', err)
    return sendError(res, 'Failed to fetch queries', 500)
  }
}

export const getQueryById = async (req, res) => {
  const { id } = req.params
  try {
    const query = await prisma.query.findUnique({
      where: { id },
      include: queryInclude
    })

    if (!query) return sendError(res, 'Query not found', 404)

    return sendSuccess(res, serialize(query), 'Query fetched successfully')
  } catch (err) {
    console.error('Get query error:', err)
    return sendError(res, 'Failed to fetch query', 500)
  }
}

export const createQuery = async (req, res) => {
  try {
    const { errors, data } = validateQueryPayload(req.body)
    if (errors.length) return sendError(res, errors.join(', '), 400)

    const query = await prisma.query.create({
      data,
      include: queryInclude
    })

    return sendSuccess(res, serialize(query), 'Query created successfully', 201)
  } catch (err) {
    console.error('Create query error:', err)
    if (err.code === 'P2003') return sendError(res, 'Invalid customer or assignee reference', 400)
    return sendError(res, 'Failed to create query', 500)
  }
}

export const updateQuery = async (req, res) => {
  const { id } = req.params
  try {
    const { errors, data } = validateQueryPayload(req.body, { partial: true })
    if (errors.length) return sendError(res, errors.join(', '), 400)

    const query = await prisma.query.update({
      where: { id },
      data,
      include: queryInclude
    })

    return sendSuccess(res, serialize(query), 'Query updated successfully')
  } catch (err) {
    console.error('Update query error:', err)
    if (err.code === 'P2025') return sendError(res, 'Query not found', 404)
    if (err.code === 'P2003') return sendError(res, 'Invalid customer or assignee reference', 400)
    return sendError(res, 'Failed to update query', 500)
  }
}

export const deleteQuery = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.query.delete({ where: { id } })
    return sendSuccess(res, null, 'Query deleted successfully')
  } catch (err) {
    console.error('Delete query error:', err)
    if (err.code === 'P2025') return sendError(res, 'Query not found', 404)
    return sendError(res, 'Failed to delete query', 500)
  }
}
