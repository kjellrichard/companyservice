import express, { Request, Response } from 'express'
import { init, getCompany, findCompany, searchCompanies } from '../lib/brreg'

const app = express()

app.get('/search', async (req: Request, res: Response) => {
    const { query } = req.query
    const start = Date.now()
    if (!query)
        return res.status(400).send('Query is required.')

    const companies = await searchCompanies(query as string)
    return res
        .header('x-time-taken', `${Date.now() - start}`)
        .header('x-count', `${companies.length}`)
        .json(companies)
})

app.get('/find', async (req: Request, res: Response) => {
    const { query } = req.query
    const start = Date.now()
    if (!query)
        return res.status(400).send('Query is required.')

    const company = await findCompany(query as string)
    res.header('x-time-taken', `${Date.now() - start}`)
    if (company)
        return res
            .json(company)
    else
        return res
            .status(404)
            .send(`Company with name ${query} not found.`)
})

app.get('/:orgno', async (req: Request, res: Response) => {
    const orgno = req.params.orgno
    const company = await getCompany(orgno)
    const start = Date.now()
    if (company)
        res
            .header('x-time-taken', `${Date.now() - start}`)
            .json(company)
    else
        res
            .status(404)
            .send(`Company with id ${orgno} not found.`)
})

export default async () => {
    const port = process.env.PORT || 3000
    await init({ verbose: true })
    app.listen(port)
    console.log(`Listening on port ${port}`)
    return app
}