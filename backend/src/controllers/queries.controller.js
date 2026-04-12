import { Resend } from 'resend'
import { prisma } from '../db.js'

const resend = new Resend(process.env.RESEND_API_KEY)

// GET /api/queries
export const getQueries = async (req, res) => {
  try {
    const queries = await prisma.query.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        customer: true,
        // CHANGED: assignedTo -> assigned_member (to match updated schema)
        assigned_member: {
          select: { id: true, full_name: true, email: true }
        }
      }
    })
    res.json(queries)
  } catch (err) {
    console.error('Get queries error:', err)
    res.status(500).json({ error: 'Failed to fetch queries' })
  }
}

// POST /api/queries
export const createQuery = async (req, res) => {
  const { customer_id, subject, message, priority } = req.body
  try {
    if (!subject || !message)
      return res.status(400).json({ error: 'Subject and message are required' })

    const query = await prisma.query.create({
      data: {
        // Ensure customer_id is a string as per your NOT NULL schema requirement
        customer_id: customer_id, 
        subject,
        message,
        priority: priority || 'Medium',
      }
    })
    res.status(201).json(query)
  } catch (err) {
    console.error('Create query error:', err)
    res.status(500).json({ error: 'Failed to create query' })
  }
}

// PATCH /api/queries/:id
export const updateQuery = async (req, res) => {
  const { id } = req.params
  try {
    const query = await prisma.query.update({
      where: { id },
      data: req.body,
      include: {
        customer: true,
        // CHANGED: assignedTo -> assigned_member
        assigned_member: { select: { id: true, full_name: true } }
      }
    })
    res.json(query)
  } catch (err) {
    console.error('Update query error:', err)
    if (err.code === 'P2025')
      return res.status(404).json({ error: 'Query not found' })
    res.status(500).json({ error: 'Failed to update query' })
  }
}

// POST /api/queries/:id/reply
export const sendReply = async (req, res) => {
  const { id } = req.params
  const { reply } = req.body

  if (!reply?.trim())
    return res.status(400).json({ error: 'Reply text is required' })

  try {
    const query = await prisma.query.findUnique({
      where: { id },
      include: { customer: true }
    })

    if (!query) return res.status(404).json({ error: 'Query not found' })

    if (query.customer?.email_id) {
      await resend.emails.send({
        from: 'support@sukhitravels.com',
        to: query.customer.email_id,
        subject: `Re: ${query.subject}`,
        text: reply,
      })
    }

    const updated = await prisma.query.update({
      where: { id },
      data: { 
        reply, 
        // CHANGED: replied: true -> replied_at: new Date()
        replied_at: new Date(), 
        status: 'Closed' 
      },
      include: {
        customer: true,
        // CHANGED: assignedTo -> assigned_member
        assigned_member: { select: { id: true, full_name: true } }
      }
    })

    res.json(updated)
  } catch (err) {
    console.error('Send reply error:', err)
    res.status(500).json({ error: 'Failed to send reply' })
  }
}