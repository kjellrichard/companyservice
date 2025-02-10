import express, { Request, Response } from 'express'
import { NOCompany } from '../../types'
import { init, getCompany, findCompany, searchCompanies, initRoles, getCompanyRoles } from '../lib/brreg'

const app = express()
let skipRoles = false
function applyRoles(company: NOCompany): NOCompany {
    if (skipRoles)
        return company
    company.rollegrupper = getCompanyRoles(company.organisasjonsnummer)
    return company
}

app.get('/search', (req: Request, res: Response) => {
    const { query } = req.query
    const start = Date.now()
    if (!query)
        return res.status(400).send('Query is required.')

    const companies = searchCompanies(query as string)
    for (const company of companies)
        applyRoles(company)
    return res
        .header('x-time-taken', `${Date.now() - start}`)
        .header('x-count', `${companies.length}`)
        .json(companies)
})

app.get('/find', (req: Request, res: Response) => {
    const { query, exact } = req.query
    const start = Date.now()

    if (!query)
        return res.status(400).send('Query is required.')

    const company = findCompany(query as string, /true|1/i.test(String(exact)))
    res.header('x-time-taken', `${Date.now() - start}`)
    if (company)
        return res
            .json(applyRoles(company))
    else
        return res
            .status(404)
            .send(`Company with name ${query} not found.`)
})

app.get('/no/:orgno', (req: Request, res: Response) => {
    const orgno = req.params.orgno
    const company = getCompany(orgno)
    const start = Date.now()
    if (company)
        res
            .header('x-time-taken', `${Date.now() - start}`)
            .json(applyRoles(company))
    else
        res
            .status(404)
            .send(`Company with id ${orgno} not found.`)
})

export default async ({ skipRoles = false }: { skipRoles?: boolean } = {}) => {
    const port = process.env.PORT || 9000
    const verbose = true
    console.log(`Listening on port ${port}`)
    app.listen(port)
    await init({ verbose })
    if (!skipRoles)
        await initRoles({ verbose })
    else
        skipRoles = true

    console.log('Data loaded. I\'m ready to serve :)')

    return app
}