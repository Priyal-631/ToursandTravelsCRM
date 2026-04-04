import { prisma } from '../db.js'

export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        tours: {
          include: {
            tour_type: true,
            state: true,
            country: true
          }
        }
      }
    })
    res.json(customers)
  } catch (err) {
    console.error('Get customers error:', err)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
}

export const createCustomer = async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: {
        ...req.body,
        created_by: req.profile.id
      }
    })
    res.status(201).json(customer)
  } catch (err) {
    console.error('Create customer error:', err)
    res.status(500).json({ error: 'Failed to create customer' })
  }
}

export const updateCustomer = async (req, res) => {
  const { id } = req.params
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: req.body
    })
    res.json(customer)
  } catch (err) {
    console.error('Update customer error:', err)
    res.status(500).json({ error: 'Failed to update customer' })
  }
}

export const deleteCustomer = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.customer.delete({ where: { id } })
    res.json({ message: 'Customer deleted' })
  } catch (err) {
    console.error('Delete customer error:', err)
    res.status(500).json({ error: 'Failed to delete customer' })
  }
}