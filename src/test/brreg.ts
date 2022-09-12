import { config } from 'dotenv'
config({ path: './.env-test' })

import { expect } from 'chai'
import { unzipUnits, getCompanies, searchCompanies, getRoles } from '../lib/brreg'


describe('brreg', () => {
    it('should extract data to company map', async () => {
        const data = await unzipUnits({
            verbose: true
        })
        expect(data).to.a('map')
    }).timeout(Infinity)

    it('should get all companies as map', async () => {
        const companies = await getCompanies({ verbose: true })
        expect(companies).to.be.a('map')
        expect(companies.size).to.be.greaterThan(100)
        companies.forEach(company => {
            expect(company).to.be.a('object')
            expect(company.organisasjonsnummer).to.be.a('string').with.lengthOf(9)
        })
    }).timeout(Infinity)

    it('should get all companies matching "speidergruppe" as array', async () => {
        const companies = await searchCompanies('speidergruppe')
        expect(companies).to.be.a('array')
        expect(companies.length).to.be.greaterThan(1)
        companies.forEach(company => {
            expect(company.navn.toLowerCase()).to.contain('speidergruppe')
        })
    }).timeout(Infinity)

    it('should get all companies starting with "100"', async () => {
        const companies = await searchCompanies('^100')
        expect(companies).to.be.a('array')
        expect(companies.length).to.be.greaterThan(1)
        companies.forEach(company => {
            expect(company.navn.toLowerCase().indexOf('100')).to.equal(0, 'navn should start with "100"')
        })
    }).timeout(Infinity)

    it('should get all companies ending with "speidergruppe"', async () => {
        const companies = await searchCompanies('speidergruppe$')
        expect(companies).to.be.a('array')
        expect(companies.length).to.be.greaterThan(1)
        companies.forEach(company => {
            expect(company.navn.toLowerCase().indexOf('speidergruppe')).to.equal(company.navn.length - 'speidergruppe'.length, 'navn should end with "speidergruppe"')
        })
    }).timeout(Infinity)

    it('should get all roles as map', async () => {
        const roles = await getRoles({ verbose: true })
        expect(roles).to.be.a('map')
        expect(roles.size).to.be.greaterThan(100)
        roles.forEach(role => {
            expect(role).to.be.an('array')
            role.forEach(innerRole=>{
                expect(innerRole.type.kode).to.be.a('string')
                expect(innerRole.roller).to.be.an('array')
                innerRole.roller.forEach(realRole=>{
                    expect(realRole.type.kode).to.be.a('string')
                })
            })
        })
    }).timeout(Infinity)
})