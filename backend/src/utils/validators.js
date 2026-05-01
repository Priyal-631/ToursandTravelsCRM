const VALID_QUERY_PRIORITIES = new Set(['High', 'Medium', 'Low'])
const VALID_QUERY_STATUSES = new Set(['Open', 'Contacted', 'In Progress', 'Closed'])
const VALID_TOUR_STATUSES = new Set(['Upcoming', 'Ongoing', 'Completed', 'Cancelled'])

const toNullableString = (value) => {
  if (value == null) return null
  const next = String(value).trim()
  return next ? next : null
}

const toNumberOrNull = (value, field, errors, { integer = false, min } = {}) => {
  if (value === '' || value == null) return null
  const parsed = integer ? Number.parseInt(value, 10) : Number(value)
  if (Number.isNaN(parsed)) {
    errors.push(`${field} must be a valid number`)
    return null
  }
  if (min != null && parsed < min) {
    errors.push(`${field} must be at least ${min}`)
    return null
  }
  return parsed
}

const toDateOrNull = (value, field, errors, { required = false } = {}) => {
  if (!value) {
    if (required) errors.push(`${field} is required`)
    return null
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    errors.push(`${field} must be a valid date`)
    return null
  }
  return parsed
}

export const validateCustomerPayload = (payload = {}) => {
  const errors = []
  const fullName = String(payload.full_name || '').trim()

  if (!fullName) errors.push('full_name is required')

  return {
    errors,
    data: {
      full_name: fullName,
      contact_number: toNullableString(payload.contact_number),
      whatsapp_number: toNullableString(payload.whatsapp_number),
      email_id: toNullableString(payload.email_id),
      travel_destination: toNullableString(payload.travel_destination),
      travel_dates: toDateOrNull(payload.travel_dates, 'travel_dates', errors),
      departure_city: toNullableString(payload.departure_city),
      number_of_adults: toNumberOrNull(payload.number_of_adults, 'number_of_adults', errors, {
        integer: true,
        min: 1
      }) ?? 1,
      number_of_children: toNumberOrNull(payload.number_of_children, 'number_of_children', errors, {
        integer: true,
        min: 0
      }) ?? 0,
      package_type: toNullableString(payload.package_type),
      budget_range: toNumberOrNull(payload.budget_range, 'budget_range', errors, { min: 0 }),
      source_of_lead: toNullableString(payload.source_of_lead),
      follow_up_status: toNullableString(payload.follow_up_status) || 'New',
      follow_up_notes: toNullableString(payload.follow_up_notes),
      assigned_to: toNullableString(payload.assigned_to)
    }
  }
}

export const validateTourPayload = (payload = {}, { partial = false } = {}) => {
  const errors = []
  const destination = toNullableString(payload.destination)

  if (!partial && !destination) errors.push('destination is required')

  const status = toNullableString(payload.status) || 'Upcoming'
  if (status && !VALID_TOUR_STATUSES.has(status)) {
    errors.push('status must be Upcoming, Ongoing, Completed, or Cancelled')
  }

  const startDate = toDateOrNull(payload.start_date, 'start_date', errors, { required: !partial })
  const endDate = toDateOrNull(payload.end_date, 'end_date', errors, { required: !partial })

  if (startDate && endDate && endDate < startDate) {
    errors.push('end_date must be on or after start_date')
  }

  return {
    errors,
    data: {
      customer_id: toNullableString(payload.customer_id),
      destination,
      tour_type_id: toNumberOrNull(payload.tour_type_id, 'tour_type_id', errors, { integer: true, min: 1 }),
      state_id: toNumberOrNull(payload.state_id, 'state_id', errors, { integer: true, min: 1 }),
      country_id: toNumberOrNull(payload.country_id, 'country_id', errors, { integer: true, min: 1 }),
      start_date: startDate,
      end_date: endDate,
      package_type: toNullableString(payload.package_type),
      number_of_adults: toNumberOrNull(payload.number_of_adults, 'number_of_adults', errors, {
        integer: true,
        min: 1
      }) ?? 1,
      number_of_children: toNumberOrNull(payload.number_of_children, 'number_of_children', errors, {
        integer: true,
        min: 0
      }) ?? 0,
      revenue: toNumberOrNull(payload.revenue, 'revenue', errors, { min: 0 }),
      amount_paid: toNumberOrNull(payload.amount_paid, 'amount_paid', errors, { min: 0 }) ?? 0,
      status,
      notes: toNullableString(payload.notes)
    }
  }
}

export const validateQueryPayload = (payload = {}, { partial = false } = {}) => {
  const errors = []
  const subject = toNullableString(payload.subject)
  const message = toNullableString(payload.message)
  const priority = toNullableString(payload.priority) || 'Medium'
  const status = toNullableString(payload.status) || 'Open'

  if (!partial && !subject) errors.push('subject is required')
  if (!partial && !message) errors.push('message is required')
  if (!partial && !toNullableString(payload.customer_id)) errors.push('customer_id is required')
  if (priority && !VALID_QUERY_PRIORITIES.has(priority)) {
    errors.push('priority must be High, Medium, or Low')
  }
  if (status && !VALID_QUERY_STATUSES.has(status)) {
    errors.push('status must be Open, Contacted, In Progress, or Closed')
  }

  return {
    errors,
    data: {
      customer_id: toNullableString(payload.customer_id),
      subject,
      message,
      priority,
      status,
      assigned_to: toNullableString(payload.assigned_to),
      reply: toNullableString(payload.reply)
    }
  }
}
