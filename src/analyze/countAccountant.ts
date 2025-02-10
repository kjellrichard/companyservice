import { getCompanies, getRoles } from '../lib/brreg'

type CompanyInfo = {
    OrgNo: string
    Name: string
    City: string
    'None': number
    'Micro 1–9': number
    'Small 10–49': number
    'Medium 50–249': number
    'Large 250+': number
    Total: number
}

type AccountantInfo = {
    [orgNo: string]: CompanyInfo
}
export async function countRegnskap({
    verbose = true
}: {
    verbose?: boolean
}): Promise<AccountantInfo> {
    const companies = await getCompanies({ verbose })
    const roles = await getRoles({ verbose })
    const regn: AccountantInfo = {}

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
        if (!regn[accountant.organisasjonsnummer]) {
            const comp = companies.get(accountant.organisasjonsnummer)

            regn[accountant.organisasjonsnummer] = {
                OrgNo: accountant.organisasjonsnummer,
                Name: comp?.navn || accountant.navn[0],
                City: comp?.forretningsadresse.poststed || '',
                'None': 0,
                'Micro 1–9': 0,
                'Small 10–49': 0,
                'Medium 50–249': 0,
                'Large 250+': 0,
                'Total': 0
            }
        }

        regn[accountant.organisasjonsnummer].Total++
        const numberOfEmployees = company.antallAnsatte || 0

        if (numberOfEmployees === 0)
            regn[accountant.organisasjonsnummer]['None']++
        else if (numberOfEmployees < 10)
            regn[accountant.organisasjonsnummer]['Micro 1–9']++
        else if (numberOfEmployees < 50)
            regn[accountant.organisasjonsnummer]['Small 10–49']++
        else if (numberOfEmployees < 250)
            regn[accountant.organisasjonsnummer]['Medium 50–249']++
        else
            regn[accountant.organisasjonsnummer]['Large 250+']++
    })
    return regn
}
