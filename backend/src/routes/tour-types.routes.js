import { Router } from 'express'
import { getTourTypes } from '../controllers/tour-types.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getTourTypes)

export default router
