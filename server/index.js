import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { SEED_CUSTOMERS } from './seedData.js'

const app = express()
const PORT = process.env.PORT ?? 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173'
const IS_DEV = process.env.NODE_ENV !== 'production'

const customers = []
let nextId = 1

for (const row of SEED_CUSTOMERS) {
  customers.push({ id: nextId++, ...row })
}

// In development allow any localhost origin so Vite's dynamic port
// (5173 / 5174 / 5175 …) is never blocked. In production only the
// configured CORS_ORIGIN is accepted.
const corsOptions = IS_DEV
  ? { origin: (origin, cb) => cb(null, true) }
  : { origin: CORS_ORIGIN }

app.use(cors(corsOptions))
app.use(express.json())

app.get('/customers', (_req, res) => {
  res.json([...customers])
})

app.post('/customers', (req, res) => {
  const { name, email, phone } = req.body ?? {}
  const customer = {
    id: nextId++,
    name: name ?? '',
    email: email ?? '',
    phone: phone ?? '',
  }
  customers.push(customer)
  res.status(201).json(customer)
})

app.put('/customers/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).send()

  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) return res.status(404).send()

  const { name, email, phone } = req.body ?? {}
  customers[index] = {
    ...customers[index],
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(phone !== undefined && { phone }),
  }
  res.json(customers[index])
})

app.delete('/customers/:id', (req, res) => {
  const id = Number(req.params.id)
  if (Number.isNaN(id)) return res.status(400).send()

  const index = customers.findIndex((c) => c.id === id)
  if (index === -1) return res.status(404).send()

  customers.splice(index, 1)
  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
