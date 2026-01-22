import express, { response } from "express"
import jobs from './jobs.json' with { type: 'json' }
import { DEFAULTS } from './config.js'

const PORT = process.env.PORT || DEFAULTS.PORT
const app = express()

// Opcional -> /acd o /abcd
app.get('/a{b}cd', (req, res) => {
    return res.send('abcd o acd')
})

// Comodín
app.get('/bb*bb', (req, res) => {
    return res.send('bb*bb')
})

// Rutas más largas que no sabes como terminan
app.get('/file/*filename', (req, res) => {
    return res.send('file/*')
})

// Con Regex (no recomendable)
app.get(/.*fly$/, (req, res) => {
    return res.send('Terminando en fly')
})

app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
})