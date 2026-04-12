import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'
import { sendError, sendSuccess } from '../utils/http.js'
import { serialize } from '../utils/serializers.js'

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return sendError(res, 'Email and password required', 400)

    const profile = await prisma.profile.findUnique({ where: { email } })
    if (!profile)
      return sendError(res, 'Invalid credentials', 401)

    const valid = await bcrypt.compare(password, profile.password)
    if (!valid)
      return sendError(res, 'Invalid credentials', 401)

    const token = jwt.sign(
      { id: profile.id, role: profile.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Strip password before sending profile back
    const { password: _, ...safeProfile } = profile

    return sendSuccess(
      res,
      { token, profile: serialize(safeProfile) },
      'Logged in successfully'
    )
  } catch (err) {
    console.error('Login error:', err)
    return sendError(res, 'Internal server error', 500)
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  const { password: _, ...safeProfile } = req.profile
  return sendSuccess(res, serialize(safeProfile), 'Profile fetched successfully')
}

// POST /api/auth/logout
export const logout = (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully')
}
