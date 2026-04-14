import { Router } from 'express'
import { submitEnquiry } from '../controllers/queries.controller.js'

const router = Router()

// Completely public — no requireAuth middleware
router.post('/enquiry', submitEnquiry)

export default router