const dateFields = new Set([
  'created_at',
  'updated_at',
  'replied_at',
  'travel_dates',
  'start_date',
  'end_date'
])

const isDecimalLike = (value) =>
  value &&
  typeof value === 'object' &&
  typeof value.toNumber === 'function' &&
  typeof value.toString === 'function'

export const serialize = (value, key = '') => {
  if (value == null) return value

  if (value instanceof Date) return value.toISOString()

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item))
  }

  if (isDecimalLike(value)) {
    return Number(value.toString())
  }

  if (typeof value === 'object') {
    const result = Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => {
        if (dateFields.has(childKey) && childValue instanceof Date) {
          return [childKey, childValue.toISOString()]
        }
        return [childKey, serialize(childValue, childKey)]
      })
    )

    if (!('amount_pending' in result) && ('revenue' in result || 'amount_paid' in result)) {
      const revenue = Number(result.revenue || 0)
      const amountPaid = Number(result.amount_paid || 0)
      result.amount_pending = Math.max(revenue - amountPaid, 0)
    }

    if (!('replied' in result) && ('reply' in result || 'subject' in result || 'message' in result)) {
      result.replied = Boolean(result.reply && String(result.reply).trim())
    }

    if (!('assignedProfile' in result) && ('assigned_to' in result || 'created_by' in result)) {
      result.assignedProfile = null
    }

    return result
  }

  return value
}
