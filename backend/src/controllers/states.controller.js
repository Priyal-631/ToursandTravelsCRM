import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

export const getStates = async (req, res) => {
  try {
    const states = await prisma.indianState.findMany({
      orderBy: { name: 'asc' }
    })
    return sendSuccess(res, serialize(states), 'States fetched successfully')
  } catch (err) {
    console.error('Get states error:', err)
    return sendError(res, 'Failed to fetch states', 500)
  }
}
