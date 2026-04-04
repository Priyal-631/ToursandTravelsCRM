import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token provided' })

  const token = header.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const profile = await prisma.profile.findUnique({
      where: { id: decoded.id }
    })

    if (!profile)
      return res.status(401).json({ error: 'User not found' })

    req.profile = profile
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}