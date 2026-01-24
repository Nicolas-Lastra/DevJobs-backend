import jobs from '../jobs.json' with { type: 'json' }

export class JobModel {

    static async getAll({ text, title, level, limit = 10, technology, offset = 0 }) {
        let filteredJobs = jobs

        if(text) {
            const searchTerm = text.toLocaleLowerCase()
            filteredJobs = filteredJobs.filter(job => 
                job.titulo.toLowerCase().includes(searchTerm) || job.descripcion.toLowerCase().includes(searchTerm)
            )
        }

        if (technology) {
            filteredJobs = filteredJobs.filter(job => 
                job.data.technology.includes(technology)
            )
        }

        const limitNumber = Number(limit)
        const offsetNumber = Number(offset)

        const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

        return paginatedJobs
    }

    static async getById(id) {

        const job = jobs.find(job => job.id === id)

        return job
    }

    static async create ({ titulo, empresa, ubicacion, data }) {

        const newJob = {
            id: crypto.randomUUID(),
            titulo,
            empresa,
            ubicacion,
            data
        }

        jobs.push(newJob)

        return newJob
    }

    static async update ({ id, titulo, empresa, ubicacion, data, content }) {

        const index = jobs.findIndex(job => job.id === id)

        const updatedJob = {
            id: id,
            titulo: titulo,
            empresa: empresa,
            ubicacion: ubicacion,
            data: data,
            content: content
        }

        jobs[index] = updatedJob

        return updatedJob
    }

    static async partialupdate ({id, changes}) {
        const index = jobs.findIndex(job => job.id === id)
        const previousJob = jobs.find(job => job.id === id)

        const partiallyUpdatedJob = {...previousJob, ...changes}

        jobs[index] = partiallyUpdatedJob

        return partiallyUpdatedJob
    }

    static async delete(id) {
        const index = jobs.findIndex(job => job.id === id)
        jobs.splice(index, 1)
    }
}