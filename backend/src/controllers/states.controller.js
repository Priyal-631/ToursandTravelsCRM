import { prisma } from '../db.js'

export const getStates = async (req, res) => {
  try {
    const states = await prisma.indianState.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(states)
  } catch (err) {
    console.error('Get states error:', err)
    res.status(500).json({ error: 'Failed to fetch states' })
  }
}