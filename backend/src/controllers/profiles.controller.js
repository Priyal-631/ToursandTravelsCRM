import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

export const getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { full_name: 'asc' },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        created_at: true
      }
    })

    return sendSuccess(res, serialize(profiles), 'Profiles fetched successfully')
  } catch (err) {
    console.error('Get profiles error:', err)
    return sendError(res, 'Failed to fetch profiles', 500)
  }
}
