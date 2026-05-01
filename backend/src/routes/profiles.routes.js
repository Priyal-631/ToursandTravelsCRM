import { Router } from 'express'
import { getProfiles } from '../controllers/profiles.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireSales } from '../middleware/roleCheck.js'

const router = Router()

router.get('/', requireAuth, requireSales, getProfiles)

export default router
