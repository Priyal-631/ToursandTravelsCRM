import express from 'express'
import cors from 'cors'

import authRoutes    from './routes/auth.routes.js'
import customerRoutes from './routes/customers.routes.js'
import tourRoutes    from './routes/tours.routes.js'
import reportRoutes  from './routes/reports.routes.js'
import stateRoutes   from './routes/states.routes.js'
import countryRoutes from './routes/countries.routes.js'
import queryRoutes   from './routes/queries.routes.js'    // NEW
import profileRoutes from './routes/profile.routes.js'  // NEW

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'Tours Backend running' }))

app.use('/api/auth',      authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/tours',     tourRoutes)
app.use('/api/reports',   reportRoutes)
app.use('/api/states',    stateRoutes)
app.use('/api/countries', countryRoutes)
app.use('/api/queries',   queryRoutes)    // NEW
app.use('/api/profiles',  profileRoutes)  // NEW

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})