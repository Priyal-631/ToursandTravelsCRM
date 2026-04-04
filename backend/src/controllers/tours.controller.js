import { prisma } from '../db.js'

export const getTours = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        customer: true,
        tour_type: true,
        state: true,
        country: true
      }
    })
    res.json(tours)
  } catch (err) {
    console.error('Get tours error:', err)
    res.status(500).json({ error: 'Failed to fetch tours' })
  }
}

export const createTour = async (req, res) => {
  try {
    // Validate required field
    if (!req.body.destination) {
      return res.status(400).json({ 
        error: 'Destination is required' 
      })
    }

    const tour = await prisma.tour.create({
      data: {
        ...req.body,
        created_by: req.profile.id
      },
      include: {
        customer: true,
        tour_type: true,
        state: true,
        country: true
      }
    })
    res.status(201).json(tour)
  } catch (err) {
    console.error('Create tour error:', err)
    
    // Handle Prisma validation errors
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'A tour with this data already exists' })
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid reference to related data' })
    }
    
    res.status(500).json({ 
      error: 'Failed to create tour',
      details: err.message 
    })
  }
}

export const updateTour = async (req, res) => {
  const { id } = req.params
  try {
    const tour = await prisma.tour.update({
      where: { id },
      data: req.body,
      include: {
        customer: true,
        tour_type: true,
        state: true,
        country: true
      }
    })
    res.json(tour)
  } catch (err) {
    console.error('Update tour error:', err)
    
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Tour not found' })
    }
    
    res.status(500).json({ error: 'Failed to update tour' })
  }
}

export const deleteTour = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.tour.delete({ where: { id } })
    res.json({ message: 'Tour deleted' })
  } catch (err) {
    console.error('Delete tour error:', err)
    
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Tour not found' })
    }
    
    res.status(500).json({ error: 'Failed to delete tour' })
  }
}