import express, { Request, Response } from 'express'
import { NOCompany } from '../../types'
import { init, getCompany, findCompany, searchCompanies, initRoles, getCompanyRoles } from '../lib/brreg'

const app = express()
async function applyRoles(company: NOCompany): Promise<NOCompany> {
    company.rollegrupper = await getCompanyRoles(company.organisasjonsnummer)
    return company
}
app.get('/search', async (req: Request, res: Response) => {
    const { query } = req.query
    const start = Date.now()
    if (!query)
        return res.status(400).send('Query is required.')

    const companies = await searchCompanies(query as string)
    for (const company of companies)
        await applyRoles(company)
    return res
        .header('x-time-taken', `${Date.now() - start}`)
        .header('x-count', `${companies.length}`)
        .json(companies)
})

app.get('/find', async (req: Request, res: Response) => {
    const { query, exact } = req.query
    const start = Date.now()

    if (!query)
        return res.status(400).send('Query is required.')

    const company = await findCompany(query as string, /true|1/i.test(String(exact)))
    res.header('x-time-taken', `${Date.now() - start}`)
    if (company)
        return res
            .json(await applyRoles(company))
    else
        return res
            .status(404)
            .send(`Company with name ${query} not found.`)
})

app.get('/no/:orgno', async (req: Request, res: Response) => {
    const orgno = req.params.orgno
    const company = await getCompany(orgno)
    const start = Date.now()
    if (company)
        res
            .header('x-time-taken', `${Date.now() - start}`)
            .json(await applyRoles(company))
    else
        res
            .status(404)
            .send(`Company with id ${orgno} not found.`)
})

export default async ({ skipRoles = false }: { skipRoles?: boolean } = {}) => {
    const port = process.env.PORT || 9000
    const verbose = true
    app.listen(port)
    console.log(`Listening on port ${port}`)
    await init({ verbose })
    if (!skipRoles)
        await initRoles({ verbose })
    console.log('Data loaded. I\'m ready to serve :)')
    return app
}