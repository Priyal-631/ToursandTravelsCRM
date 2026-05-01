import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import customerRoutes from './routes/customers.routes.js'
import tourRoutes from './routes/tours.routes.js'
import reportRoutes from './routes/reports.routes.js'
import stateRoutes from './routes/states.routes.js'
import countryRoutes from './routes/countries.routes.js'
import queryRoutes from './routes/queries.routes.js'
import profileRoutes from './routes/profiles.routes.js'
import tourTypeRoutes from './routes/tour-types.routes.js'
import { sendSuccess } from './utils/http.js'

const app = express()

const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,https://toursandtravelscrm.onrender.com')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true)

    if (configuredOrigins.includes(origin)) {
      return callback(null, true)
    }

    try {
      const current = new URL(origin)
      const isLocalDev =
        ['localhost', '127.0.0.1'].includes(current.hostname) &&
        /^517\d$/.test(current.port || '')

      if (isLocalDev) return callback(null, true)
    } catch {
      // Ignore parse errors and reject below.
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  }
}))
app.use(express.json())

app.get('/', (req, res) => sendSuccess(res, { service: 'Tours Backend' }, 'Tours Backend running'))

app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/tours', tourRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/states', stateRoutes)
app.use('/api/countries', countryRoutes)
app.use('/api/queries', queryRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/tour-types', tourTypeRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
