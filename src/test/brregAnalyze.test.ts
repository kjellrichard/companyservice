import { describe, it, expect, beforeAll } from 'vitest'
import { NOCompany, NORole } from '../../types'
import { getCompanies, getRoles } from './mock'


describe('brregAnalyze', () => {
    let companies: Map<string, NOCompany>
    let roles: Map<string, NORole[]>

    beforeAll(() => {
        companies = getCompanies(100)
        roles = getRoles(companies)
    })

    it('should analyze data', () => {
        expect(companies).to.be.a('map')
        expect(roles).to.be.a('map')
        expect(roles.size).to.be.greaterThanOrEqual(100)
        roles.forEach(role => {
            expect(role).to.be.an('array')
        })
        const regn: {
            [orgNo: string]:
            {
                '0-9': 0,
                '10-19': 0,
                '20-49': 0,
                '50-99': 0,
                '100-249': 0,
                '250+': 0,
                'total': 0
            }
        } = {}

        companies.forEach(company => {
            const currentRoles = roles.get(company.organisasjonsnummer)
            if (!currentRoles || currentRoles.length === 0)
                return
            let accountant
            const regns = currentRoles.filter(r => r.type.kode === 'REGN').map(regn => regn.roller.filter(r => r.fratraadt === false && r.type.kode === 'REGN' && r.enhet?.erSlettet === false)).flat()
            if (regns.length > 0)
                accountant = regns.sort((a, b) => a.rekkefolge - b.rekkefolge)[0].enhet

            if (!accountant)
                return
            if (!regn[accountant.organisasjonsnummer])
                regn[accountant.organisasjonsnummer] = { '0-9': 0, '10-19': 0, '20-49': 0, '50-99': 0, '100-249': 0, '250+': 0, 'total': 0 }

            regn[accountant.organisasjonsnummer].total++
            const numberOfEmployees = company.antallAnsatte
            if (numberOfEmployees < 10)
                regn[accountant.organisasjonsnummer]['0-9']++
            else if (numberOfEmployees < 20)
                regn[accountant.organisasjonsnummer]['10-19']++
            else if (numberOfEmployees < 50)
                regn[accountant.organisasjonsnummer]['20-49']++
            else if (numberOfEmployees < 100)
                regn[accountant.organisasjonsnummer]['50-99']++
            else if (numberOfEmployees < 250)
                regn[accountant.organisasjonsnummer]['100-249']++
            else
                regn[accountant.organisasjonsnummer]['250+']++
        })
        console.log(regn)
    })

})