export const requireAdmin = (req, res, next) => {
  if (req.profile.role !== 'ADMIN')
    return res.status(403).json({ success: false, data: null, message: 'Admin access required' })
  next()
}

export const requireSales = (req, res, next) => {
  const allowed = ['ADMIN', 'MANAGER', 'EXECUTIVE', 'ACCOUNTS']
  if (!allowed.includes(req.profile.role))
    return res.status(403).json({ success: false, data: null, message: 'Unauthorized' })
  next()
}
