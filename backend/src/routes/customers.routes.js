import { Router } from 'express'
import {
  createQuery,
  deleteQuery,
  getQueries,
  getQueryById,
  updateQuery,
  createPublicEnquiry // ✅ ADD THIS
} from '../controllers/queries.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin, requireSales } from '../middleware/roleCheck.js'

const router = Router()

// Protected routes (requires authentication)
router.get('/', requireAuth, requireSales, getQueries)
router.get('/:id', requireAuth, requireSales, getQueryById)
router.post('/', requireAuth, requireSales, createQuery)
router.put('/:id', requireAuth, requireSales, updateQuery)
router.delete('/:id', requireAuth, requireAdmin, deleteQuery)

// ✅ PUBLIC ROUTE - No authentication required
router.post('/public/enquiry', createPublicEnquiry)

export default router