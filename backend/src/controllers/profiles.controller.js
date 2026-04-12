import { prisma } from '../db.js'

// GET /api/profiles  — returns id + full_name for all staff
export const getProfiles = async (req, res) => {
  try {
    const profiles = await prisma.profile.findMany({
      select: { id: true, full_name: true, email: true, role: true },
      orderBy: { full_name: 'asc' }
    })
    res.json(profiles)
  } catch (err) {
    console.error('Get profiles error:', err)
    res.status(500).json({ error: 'Failed to fetch profiles' })
  }
}