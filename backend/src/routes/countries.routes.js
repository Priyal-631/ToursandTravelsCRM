import { Router } from 'express'
import { getCountries } from '../controllers/countries.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', requireAuth, getCountries)

export default router