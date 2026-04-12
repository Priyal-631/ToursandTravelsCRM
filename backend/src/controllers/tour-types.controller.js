import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

export const getTourTypes = async (req, res) => {
  try {
    const tourTypes = await prisma.tourType.findMany({
      orderBy: { name: 'asc' }
    })

    return sendSuccess(res, serialize(tourTypes), 'Tour types fetched successfully')
  } catch (err) {
    console.error('Get tour types error:', err)
    return sendError(res, 'Failed to fetch tour types', 500)
  }
}
