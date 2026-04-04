import { Router } from 'express'
import { getMonthlyRevenue, getVisitorStats, getTopDestinations } from '../controllers/reports.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/monthly-revenue', requireAuth, getMonthlyRevenue)
router.get('/visitor-stats', requireAuth, getVisitorStats)
router.get('/top-destinations', requireAuth, getTopDestinations)

export default router