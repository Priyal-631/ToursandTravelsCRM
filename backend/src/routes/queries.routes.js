import { Router } from 'express'
import {
  getQueries,
  createQuery,
  updateQuery,
  sendReply,
  submitEnquiry 
} from '../controllers/queries.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public — enquiry form can post without auth
router.post('/', createQuery)
router.post('/enquiry', submitEnquiry)

// Protected
router.get('/', requireAuth, getQueries)
router.patch('/:id', requireAuth, updateQuery)
router.post('/:id/reply', requireAuth, sendReply)

export default router