import { Router } from 'express'
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer
} from '../controllers/customers.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin, requireSales } from '../middleware/roleCheck.js'

const router = Router()

// Protected routes (requires authentication)
router.get('/', requireAuth, requireSales, getCustomers)
router.get('/:id', requireAuth, requireSales, getCustomerById)
router.post('/', requireAuth, requireSales, createCustomer)
router.put('/:id', requireAuth, requireSales, updateCustomer)
router.delete('/:id', requireAuth, requireAdmin, deleteCustomer)

export default router