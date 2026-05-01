import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'
import { sendError } from '../utils/http.js'

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer '))
    return sendError(res, 'No token provided', 401)

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const profile = await prisma.profile.findUnique({
      where: { id: decoded.id }
    })

    if (!profile)
      return sendError(res, 'User not found', 401)

    req.profile = profile
    next()
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401)
  }
}
