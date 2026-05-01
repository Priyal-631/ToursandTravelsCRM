export const sendSuccess = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({
    success: true,
    data,
    message
  })

export const sendError = (res, message = 'Request failed', status = 500, details) =>
  res.status(status).json({
    success: false,
    data: null,
    message,
    ...(details ? { details } : {})
  })
