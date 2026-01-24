import { DEFAULTS } from "../config.js"
import { JobModel } from "../models/job.js"

export class JobController {

    static async getAll(req, res) {
        const { 
            text,
            title,
            level,
            limit = DEFAULTS.LIMIT_PAGINATION,
            technology,
            offset = DEFAULTS.LIMIT_OFFSET
        } = req.query

        const jobs = await JobModel.getAll({ text, title, level, limit, technology, offset })

        const limitNumber = Number(limit)
        const offsetNumber = Number(offset)

        return res.json({ data: jobs, total: jobs.length, limit: limitNumber, offset: offsetNumber })
    }

    static async getId(req, res) {
        const { id } = req.params

        const job = await JobModel.getById(id)

        if (!job) {
            return res.status(404).json({ error: 'Job not found' })
        }

        return res.json(job)
    }

    static async create(req, res) {

        const { titulo, empresa, ubicacion, data } = req.body

        const newJob = await JobModel.create({ titulo, empresa, ubicacion, data })

        res.status(201).json(newJob)
    }

    static async update(req, res) {

        const { id } = req.params
        const previousJob = await JobModel.getById(id)

        if (!previousJob) {
            return res.status(404).json({ error: 'Job not found' })
        }

        const { titulo, empresa, ubicacion, data, content } = req.body

        if (!titulo || !empresa || !ubicacion || !data || !content) {
            return res.status(400).json({ error: 'One or more fields are empty' })
        }

        const updatedJob = await JobModel.update({ id, titulo, empresa, ubicacion, data, content })
        if (!updatedJob) return res.status(404).json({ error: 'Job not found' })
        res.status(200).json(updatedJob)
    }

    static async partialUpdate(req, res) {
        const { id } = req.params
        const previousJob = await JobModel.getById(id)

        if (!previousJob) {
            return res.status(404).json({ error: 'Job not found' })
        }

        const changes = req.body

        const partiallyUpdatedJob = await JobModel.partialupdate({ id, changes })

        res.status(200).json(partiallyUpdatedJob)
    }

    static async delete(req, res) {

        const { id } = req.params
        const job = await JobModel.getById(id)
        if (!job) {
            return res.status(400).json({ error: 'Job not found' })
        }

        await JobModel.delete(id)

        res.status(204).json({ message: 'Job deleted' })
    }
}