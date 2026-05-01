import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

export const getMonthlyRevenue = async (req, res) => {
  try {
    const { year } = req.query
    const where = year ? {
      start_date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    } : {}

    const tours = await prisma.tour.findMany({
      where,
      select: { start_date: true, revenue: true, amount_paid: true }
    })

    const grouped = {}
    tours.forEach(t => {
      const d = new Date(t.start_date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!grouped[key]) grouped[key] = {
        month: key,
        total_revenue: 0,
        total_collected: 0,
        total_pending: 0,
        total_tours: 0
      }
      const rev = Number(t.revenue || 0)
      const paid = Number(t.amount_paid || 0)
      grouped[key].total_revenue += rev
      grouped[key].total_collected += paid
      grouped[key].total_pending += rev - paid
      grouped[key].total_tours += 1
    })

    return sendSuccess(
      res,
      serialize(Object.values(grouped).sort((a, b) => a.month.localeCompare(b.month))),
      'Monthly revenue fetched successfully'
    )
  } catch (err) {
    console.error('Monthly revenue error:', err)
    return sendError(res, 'Failed to fetch monthly revenue', 500)
  }
}

export const getVisitorStats = async (req, res) => {
  try {
    const { year } = req.query
    const where = year ? {
      start_date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`)
      }
    } : {}

    const tours = await prisma.tour.findMany({
      where,
      include: { tour_type: true, state: true, country: true }
    })

    const grouped = {}
    tours.forEach(t => {
      const dest = t.destination
      if (!grouped[dest]) grouped[dest] = {
        destination: dest,
        tour_type: t.tour_type?.name || null,
        state_name: t.state?.name || null,
        country_name: t.country?.name || null,
        visitor_count: 0,
        total_revenue: 0,
        total_collected: 0,
        total_pending: 0
      }
      const rev = Number(t.revenue || 0)
      const paid = Number(t.amount_paid || 0)
      grouped[dest].visitor_count += 1
      grouped[dest].total_revenue += rev
      grouped[dest].total_collected += paid
      grouped[dest].total_pending += rev - paid
    })

    return sendSuccess(res, serialize(Object.values(grouped)), 'Visitor stats fetched successfully')
  } catch (err) {
    console.error('Visitor stats error:', err)
    return sendError(res, 'Failed to fetch visitor stats', 500)
  }
}

export const getTopDestinations = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      select: { destination: true, revenue: true }
    })

    const grouped = {}
    tours.forEach(t => {
      const dest = t.destination
      if (!grouped[dest]) grouped[dest] = {
        destination: dest,
        total_tours: 0,
        total_revenue: 0
      }
      grouped[dest].total_tours += 1
      grouped[dest].total_revenue += Number(t.revenue || 0)
    })

    const result = Object.values(grouped)
      .map(d => ({
        ...d,
        avg_revenue: d.total_revenue / d.total_tours
      }))
      .sort((a, b) => b.total_tours - a.total_tours)
      .slice(0, 10)

    return sendSuccess(res, serialize(result), 'Top destinations fetched successfully')
  } catch (err) {
    console.error('Top destinations error:', err)
    return sendError(res, 'Failed to fetch top destinations', 500)
  }
}
