import { Router } from 'express'
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customers.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { requireAdmin } from '../middleware/roleCheck.js'

const router = Router()

router.get('/', requireAuth, getCustomers)
router.post('/', requireAuth, requireAdmin, createCustomer)
router.patch('/:id', requireAuth, requireAdmin, updateCustomer)
router.delete('/:id', requireAuth, requireAdmin, deleteCustomer)

export default router