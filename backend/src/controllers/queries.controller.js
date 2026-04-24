import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'
import { Resend } from 'resend'

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY)

const queryInclude = {
  customer: {
    select: {
      id: true,
      full_name: true,
      email_id: true,
      contact_number: true
    }
  },
  assignedTo: {
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true
    }
  },
  QueryAttachment: true
}

export const getQueries = async (req, res) => {
  try {
    const queries = await prisma.query.findMany({
      orderBy: { created_at: 'desc' },
      include: queryInclude
    })
    return sendSuccess(res, serialize(queries), 'Queries fetched successfully')
  } catch (err) {
    console.error('Get queries error:', err)
    return sendError(res, 'Failed to fetch queries', 500)
  }
}

export const getQueryById = async (req, res) => {
  const { id } = req.params
  try {
    const query = await prisma.query.findUnique({
      where: { id },
      include: queryInclude
    })

    if (!query) return sendError(res, 'Query not found', 404)

    return sendSuccess(res, serialize(query), 'Query fetched successfully')
  } catch (err) {
    console.error('Get query error:', err)
    return sendError(res, 'Failed to fetch query', 500)
  }
}

export const createQuery = async (req, res) => {
  try {
    const { customer_id, subject, message, priority = 'Medium' } = req.body

    // Validate required fields
    if (!customer_id || !subject || !message) {
      return sendError(
        res,
        'customer_id, subject, and message are required',
        400
      )
    }

    // Verify customer exists
    const customerExists = await prisma.customer.findUnique({
      where: { id: customer_id }
    })

    if (!customerExists) {
      return sendError(res, 'Customer not found', 404)
    }

    const query = await prisma.query.create({
      data: {
        customer: { connect: { id: customer_id } },
        subject,
        message,
        priority,
        status: 'Open'
      },
      include: queryInclude
    })

    // (Email logic removed from here)

    return sendSuccess(res, serialize(query), 'Query created successfully', 201)
  } catch (err) {
    console.error('Create query error:', err)
    return sendError(res, 'Failed to create query', 500)
  }
}

export const updateQuery = async (req, res) => {
  const { id } = req.params
  const { subject, message, priority, status, assigned_to, reply } = req.body

  try {
    // Build update data dynamically
    const updateData = {}

    if (subject !== undefined) updateData.subject = subject
    if (message !== undefined) updateData.message = message
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status
    if (reply !== undefined) updateData.reply = reply

    // Handle assigned_to with proper relation syntax
    if (assigned_to !== undefined) {
      if (assigned_to === null) {
        // Disconnect the profile
        updateData.assignedTo = { disconnect: true }
      } else {
        // Verify profile exists before connecting
        const profileExists = await prisma.profile.findUnique({
          where: { id: assigned_to }
        })
        if (!profileExists) {
          return sendError(res, 'Assigned profile not found', 404)
        }
        updateData.assignedTo = { connect: { id: assigned_to } }
      }
    }

    // Set replied_at timestamp if replying
    if (reply !== undefined && reply !== null) {
      updateData.replied_at = new Date()
    }

    // 1. Save to database first
    const query = await prisma.query.update({
      where: { id },
      data: updateData,
      include: queryInclude
    })

    // 2. Send email via Resend if a reply was provided
    if (reply !== undefined && reply !== null && query.customer?.email_id) {
      try {
        await resend.emails.send({
          from: 'Sukhi Travels <onboarding@resend.dev>', // Reminder: Only works for your own verified email until you add a domain to Resend
          to: query.customer.email_id,
          subject: `Re: ${query.subject}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <p>Hi ${query.customer.full_name},</p>
              <p>Thank you for reaching out regarding <strong>${query.subject}</strong>.</p>
              <div style="padding: 12px; border-left: 4px solid #567C8D; background: #f9f9f9; margin: 20px 0;">
                <p style="margin: 0; white-space: pre-wrap;">${reply}</p>
              </div>
              <p>Best regards,<br/><strong>The Sukhi Travels Team</strong></p>
            </div>
          `
        })
        console.log(`Email reply sent to ${query.customer.email_id}`)
      } catch (emailError) {
        console.error('Resend email failed:', emailError)
        // We log the error but don't fail the request, so the DB update still succeeds
      }
    }

    return sendSuccess(res, serialize(query), 'Query updated successfully')
  } catch (err) {
    console.error('Update query error:', err)
    if (err.code === 'P2025') return sendError(res, 'Query not found', 404)
    return sendError(res, 'Failed to update query', 500)
  }
}

export const deleteQuery = async (req, res) => {
  const { id } = req.params
  try {
    await prisma.query.delete({ where: { id } })
    return sendSuccess(res, null, 'Query deleted successfully')
  } catch (err) {
    console.error('Delete query error:', err)
    if (err.code === 'P2025') return sendError(res, 'Query not found', 404)
    return sendError(res, 'Failed to delete query', 500)
  }
}

// Public enquiry endpoint (no auth required)
export const createPublicEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp = '',
      destination,
      departureCity = '',
      query: queryMessage = '',
      totalTravellers = 1,
      adults = 1,
      children = 0,
      budget = '',
      travelMonth = '',
      subject
    } = req.body

    // Validate required fields from form
    const errors = []
    if (!name || !name.trim()) errors.push('Full name is required')
    if (!email || !email.trim()) errors.push('Email ID is required')
    if (!phone || !phone.trim()) errors.push('Contact number is required')
    if (!destination || !destination.trim()) errors.push('Destination is required')

    if (errors.length > 0) {
      return sendError(res, errors.join(', '), 400)
    }

    // Create customer from form submission
    const customer = await prisma.customer.create({
      data: {
        full_name: name.trim(),
        email_id: email.trim(),
        contact_number: phone.trim(),
        whatsapp_number: whatsapp.trim() || phone.trim(),
        travel_destination: destination.trim(),
        departure_city: departureCity.trim() || null,
        number_of_adults: parseInt(adults) || 1,
        number_of_children: parseInt(children) || 0,
        budget_range: budget ? parseFloat(budget) : null,
        source_of_lead: 'Website Enquiry Form',
        follow_up_status: 'New',
        created_by: null // Public form submissions have no creator
      }
    })

    // Create associated query/ticket
    const query = await prisma.query.create({
      data: {
        customer: { connect: { id: customer.id } },
        subject: subject || `Enquiry: ${destination.trim()}`,
        message: queryMessage.trim() || `Customer interested in ${destination.trim()}`,
        priority: 'Medium',
        status: 'Open'
      },
      include: queryInclude
    })

    return sendSuccess(
      res,
      serialize({
        customer,
        query
      }),
      'Enquiry submitted successfully. Our team will contact you soon!',
      201
    )
  } catch (err) {
    console.error('Create public enquiry error:', err)
    return sendError(
      res,
      'Failed to submit enquiry. Please try again later.',
      500
    )
  }
}