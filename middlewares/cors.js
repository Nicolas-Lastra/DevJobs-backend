import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://midu.dev'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {} ) => {
    return cors({
        origin: (origin, callback) => {

            if (acceptedOrigins.includes(origin)) {
                return callback(null, true)
            }

            return callback(new Error('Origen no permitido'))
        }
    })
}