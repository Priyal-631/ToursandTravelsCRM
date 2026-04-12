import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'
import { validateTourPayload } from '../utils/validators.js'

const tourInclude = {
  customer: true,
  tour_type: true,
  state: true,
  country: true
}

export const getTours = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { created_at: 'desc' },
      include: tourInclude
    })
    return sendSuccess(res, serialize(tours), 'Tours fetched successfully')
  } catch (err) {
    console.error('Get tours error:', err)
    return sendError(res, 'Failed to fetch tours', 500)
  }
}

export const getTourById = async (req, res) => {
  const { id } = req.params
  try {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: tourInclude
    })

    if (!tour) return sendError(res, 'Tour not found', 404)

    return sendSuccess(res, serialize(tour), 'Tour fetched successfully')
  } catch (err) {
    console.error('Get tour error:', err)
    return sendError(res, 'Failed to fetch tour', 500)
  }
}

export const createTour = async (req, res) => {
  try {
    const { errors, data } = validateTourPayload(req.body)
    if (errors.length) return sendError(res, errors.join(', '), 400)

    const tour = await prisma.tour.create({
      data: {
        ...data,
        created_by: req.profile.id
      },
      include: tourInclude
    })
    return sendSuccess(res, serialize(tour), 'Tour created successfully', 201)
  } catch (err) {
    console.error('Create tour error:', err)
    
    if (err.code === 'P2002') {
      return sendError(res, 'A tour with this data already exists', 400)
    }
    if (err.code === 'P2003') {
      return sendError(res, 'Invalid reference to related data', 400)
    }
    
    return sendError(res, 'Failed to create tour', 500, err.message)
  }
}

export const updateTour = async (req, res) => {
  const { id } = req.params
  try {
    const { errors, data } = validateTourPayload(req.body, { partial: true })
    if (errors.length) return sendError(res, errors.join(', '), 400)

    const tour = await prisma.tour.update({
      where: { id },
      data,
      include: tourInclude
    })
    return sendSuccess(res, serialize(tour), 'Tour updated successfully')
  } catch (err) {
    console.error('Update tour error:', err)
    
    if (err.code === 'P2025') {
      return sendError(res, 'Tour not found', 404)
    }
    
    return sendError(res, 'Failed to update tour', 500)
  }
}

export const deleteTour = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.tour.delete({ where: { id } })
    return sendSuccess(res, null, 'Tour deleted successfully')
  } catch (err) {
    console.error('Delete tour error:', err)
    
    if (err.code === 'P2025') {
      return sendError(res, 'Tour not found', 404)
    }
    
    return sendError(res, 'Failed to delete tour', 500)
  }
}
