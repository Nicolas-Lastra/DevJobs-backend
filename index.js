import express from "express"
import jobs from './jobs.json' with { type: 'json' }
import cors from 'cors'
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://midu.dev'
]

app.use(
    cors({
        origin: (origin, callback) => {

            if (ACCEPTED_ORIGINS.includes(origin)) {
                return callback(null, true)
            }

            return callback(new Error('Origen no permitido'))
        }
    })
)

// Middleware

app.use(express.json())

app.use((req, res, next) => {
    const timeString = new Date().toLocaleTimeString()
    console.log(`[${timeString}] [${req.method} ${req.url}]`)
    next()
})

app.get('/', (req, res) => {
    return res.send({ message: 'Hello World!' })
})

app.get('/health', (req, res) => {
    return res.json({
        status: 'ok',
        uptime: process.uptime()
    })
})

// CRUD

app.get('/jobs', async (req, res) => {

    // cors
    // res.header('Access-Control-Allow-Origin', 'http://localhost:5173')

    const { 
        text,
        title,
        level,
        limit = DEFAULTS.LIMIT_PAGINATION,
        technology,
        offset = DEFAULTS.LIMIT_OFFSET } = req.query

    let filteredJobs = jobs

    if(text) {
        const searchTerm = text.toLocaleLowerCase()
        filteredJobs = filteredJobs.filter(job => {
            job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm)
        })
    }

    if (technology) {
        filteredJobs = filteredJobs.filter(job => 
            job.tecnologias.includes(technology)
        )
    }

    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)

    const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

    // const { default: jobs } = await import('./jobs.json', { with: { type: 'json' }})
    return res.json({ data: paginatedJobs, total: filteredJobs.length, limit: limitNumber, offset: offsetNumber })
})

app.get('/jobs/:id', (req, res) => {
    const { id } = req.params

    const job = jobs.find(job => job.id === id)

    if (!job) {
        return res.status(404).json({ error: 'Job not found' })
    }

    return res.json(job)
})

app.post('/jobs', (req, res) => {
    const { titulo, empresa, ubicacion, data } = req.body

    const newJob = {
        id: crypto.randomUUID(),
        titulo,
        empresa,
        ubicacion,
        data
    }

    jobs.push(newJob)

    res.status(201).json(newJob)
})

app.put('/jobs/:id', (req, res) => {
    // TODO
})

app.patch('/jobs/:id', (req, res) => {
    // TODO
})

app.delete('/jobs/:id', (req, res) => {
    // TODO
})

app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
})