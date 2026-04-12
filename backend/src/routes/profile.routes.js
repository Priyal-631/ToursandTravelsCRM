import { Router } from 'express'
import { getProfiles } from '../controllers/profiles.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getProfiles)

export default router