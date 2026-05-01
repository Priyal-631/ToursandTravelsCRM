import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

export const getCountries = async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    })
    return sendSuccess(res, serialize(countries), 'Countries fetched successfully')
  } catch (err) {
    console.error('Get countries error:', err)
    return sendError(res, 'Failed to fetch countries', 500)
  }
}
