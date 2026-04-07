import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../db.js'

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' })

    const profile = await prisma.profile.findUnique({ where: { email } })
    if (!profile)
      return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, profile.password)
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: profile.id, role: profile.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Strip password before sending profile back
    const { password: _, ...safeProfile } = profile

    res.json({ token, profile: safeProfile })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  const { password: _, ...safeProfile } = req.profile
  res.json(safeProfile)
}

// POST /api/auth/logout
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' })
}