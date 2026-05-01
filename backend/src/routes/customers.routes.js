import { Router } from 'express'
import {
  getCustomers,
  getCustomerStats,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customers.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = Router()

router.get('/stats', requireAuth, getCustomerStats)
router.get('/', requireAuth, getCustomers)
router.get('/:id', requireAuth, getCustomerById)
router.post('/', requireAuth, requireAdmin, createCustomer)
router.put('/:id', requireAuth, requireAdmin, updateCustomer)
router.delete('/:id', requireAuth, requireAdmin, deleteCustomer)

export default router
