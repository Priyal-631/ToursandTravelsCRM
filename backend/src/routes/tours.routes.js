import { Router } from 'express'
import {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour
} from '../controllers/tours.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = Router()

router.get('/', requireAuth, getTours)
router.get('/:id', requireAuth, getTourById)
router.post('/', requireAuth, requireAdmin, createTour)
router.put('/:id', requireAuth, requireAdmin, updateTour)
router.delete('/:id', requireAuth, requireAdmin, deleteTour)

export default router
