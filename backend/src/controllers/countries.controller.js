import { prisma } from '../db.js'

export const getCountries = async (req, res) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(countries)
  } catch (err) {
    console.error('Get countries error:', err)
    res.status(500).json({ error: 'Failed to fetch countries' })
  }
}