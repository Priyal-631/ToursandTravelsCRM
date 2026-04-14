import { Resend } from 'resend'
import { prisma } from '../db.js'

const resend = new Resend(process.env.RESEND_API_KEY)

// GET /api/queries
export const getQueries = async (req, res) => {
  try {
    const { priority, status, assigned_to } = req.query

    const where = {}
    if (priority && priority !== 'All Priority') where.priority = priority
    if (status && status !== 'All Status') where.status = status
    if (assigned_to && assigned_to !== 'All Members') where.assigned_to = assigned_to

    const queries = await prisma.query.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        customer: true,
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

// POST /api/queries (Public - from enquiry form)
export const createQuery = async (req, res) => {
  const { customer_id, subject, message, priority } = req.body
  try {
    if (!subject || !message)
      return res.status(400).json({ error: 'Subject and message are required' })

    const query = await prisma.query.create({
      data: {
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

// PATCH /api/queries/:id (Update priority, status, assigned_to, or replied_at)
export const updateQuery = async (req, res) => {
  const { id } = req.params
  try {
    const query = await prisma.query.update({
      where: { id },
      data: req.body,
      include: {
        customer: true,
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

// POST /api/queries/:id/reply (Send email via Resend)
export const sendReply = async (req, res) => {
  const { id } = req.params
  const { reply, status } = req.body

  if (!reply?.trim())
    return res.status(400).json({ error: 'Reply text is required' })

  try {
    const query = await prisma.query.findUnique({
      where: { id },
      include: { customer: true }
    })

    if (!query) return res.status(404).json({ error: 'Query not found' })

    // Send email via Resend
    if (query.customer?.email_id) {
      try {
        await resend.emails.send({
          from: 'onboarding@resend.dev', // Use your verified domain
          to: query.customer.email_id,
          subject: `Re: ${query.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2F4156;">Sukhi Travels - Response to Your Query</h2>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Your Query:</strong></p>
                <p style="margin: 5px 0 0 0; color: #333;">${query.message}</p>
              </div>
              <div style="margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Our Response:</strong></p>
                <p style="margin: 10px 0; color: #333; line-height: 1.6;">${reply.replace(/\n/g, '<br>')}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                This email was sent by Sukhi Travels. For any further queries, please reply to this email.
              </p>
            </div>
          `
        })
      } catch (emailError) {
        console.error('Resend email error:', emailError)
        // Continue even if email fails - we still want to save the reply
      }
    }

    // Update query with reply
    const updated = await prisma.query.update({
      where: { id },
      data: {
        reply,
        replied_at: new Date(),
        status: status || 'Closed'
      },
      include: {
        customer: true,
        assigned_member: { select: { id: true, full_name: true } }
      }
    })

    res.json(updated)
  } catch (err) {
    console.error('Send reply error:', err)
    res.status(500).json({ error: 'Failed to send reply' })
  }
}

// POST /api/public/enquiry  — No auth, creates Customer + Query together
export const submitEnquiry = async (req, res) => {
  const {
    full_name, contact_number, whatsapp_number, email_id,
    departure_city, travel_destination, travel_month,
    number_of_adults, number_of_children, budget_range,
    subject, message, priority
  } = req.body

  try {
    if (!full_name?.trim() || !message?.trim() || !subject?.trim()) {
      return res.status(400).json({ error: 'Name, subject, and message are required' })
    }

    // 1. Upsert customer by email (or create new if no email)
    let customer = null

    if (email_id?.trim()) {
      customer = await prisma.customer.findFirst({
        where: { email_id: email_id.trim() }
      })
    }

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          full_name: full_name.trim(),
          contact_number: contact_number?.trim() || null,
          whatsapp_number: whatsapp_number?.trim() || null,
          email_id: email_id?.trim() || null,
          departure_city: departure_city?.trim() || null,
          travel_destination: travel_destination?.trim() || null,
          budget_range: budget_range ? parseFloat(budget_range) : null,
          number_of_adults: parseInt(number_of_adults) || 1,
          number_of_children: parseInt(number_of_children) || 0,
          follow_up_status: 'New',
          source_of_lead: 'Website',
        }
      })
    }

    // 2. Create the Query linked to customer
    const query = await prisma.query.create({
      data: {
        customer_id: customer.id,
        subject: subject.trim(),
        message: message.trim(),
        priority: priority || 'Medium',
        status: 'Open',
      }
    })

    res.status(201).json({ success: true, query_id: query.id })
  } catch (err) {
    console.error('Submit enquiry error:', err)
    res.status(500).json({ error: 'Failed to submit enquiry' })
  }
}