import { Router } from 'express'
import { getStates } from '../controllers/states.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getStates)

export default router