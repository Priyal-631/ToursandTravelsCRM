import { Router } from 'express'
import { getTours, createTour, updateTour, deleteTour } from '../controllers/tours.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = Router()

router.get('/', requireAuth, getTours)
router.post('/', requireAuth, requireAdmin, createTour)
router.patch('/:id', requireAuth, requireAdmin, updateTour)
router.delete('/:id', requireAuth, requireAdmin, deleteTour)

export default router