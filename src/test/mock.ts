import { NOCompany, NORole } from '../../types'

type BrregDictionary = Map<string, NOCompany>
type BrregRoleDictionary = Map<string, NORole[]>


const roles: BrregRoleDictionary = new Map()

export function getCompanies(count: number): BrregDictionary {
    const companies: BrregDictionary = new Map()
    for (let i = 1; i <= count; i++) {
        const orgNo = `orgno${i}`
        companies.set(orgNo, {
            organisasjonsnummer: orgNo,
            navn: `Company ${i}`,
            stiftelsesdato: new Date().toISOString(),
            institusjonellSektorkode: {
                kode: '0',
                beskrivelse: 'Privat sektor'
            },

            antallAnsatte: Math.floor(Math.random() * 200),
            hjemmeside: `http://www.company${i}.com`,
            postadresse: {
                adresse: [`Street ${i}`],
                postnummer: `000${i}`,
                poststed: `City ${i}`,
                land: 'Norway',
                landkode: 'NO',
                kommune: `Municipality ${i}`,
                kommunenummer: `0${i}`
            },
            forretningsadresse: {
                adresse: [],
                kommune: '',
                kommunenummer: '',
                land: '',
                landkode: '',
                postnummer: '',
                poststed: ''
            },
            konkurs: false,
            links: [],
            maalform: '',
            naeringskode1: {
                kode: '',
                beskrivelse: ''
            },
            organisasjonsform: {
                kode: '',
                beskrivelse: ''
            },
            registreringsdatoEnhetsregisteret: '',
            registrertIForetaksregisteret: false,
            registrertIFrivillighetsregisteret: false,
            registrertIMvaregisteret: false,
            registrertIStiftelsesregisteret: false,
            underAvvikling: false,
            underTvangsavviklingEllerTvangsopplosning: false,
            rollegrupper: []
        })
    }
    return companies
}

const regnOrgNos = [
    'orgno1', 'orgno2', 'orgno3', 'orgno4', 'orgno5', 'orgno6', 'orgno7', 'orgno8', 'orgno9', 'orgno10',
    'orgno11', 'orgno12', 'orgno13', 'orgno14', 'orgno15', 'orgno16', 'orgno17', 'orgno18', 'orgno19', 'orgno20'
]

const roleKoder = ['REGN', 'REVI', 'OTHER']
export function getRoles(companies: BrregDictionary): BrregRoleDictionary {
    for (const [orgNo, company] of companies) {
        const value: NORole[] = []
        roleKoder.forEach((kode, i) => {
            value.push({
                type: {
                    kode,
                    beskrivelse: `Role ${i}`
                },
                roller: [
                    {
                        type: {
                            kode,
                            beskrivelse: `Role ${i}`
                        },
                        fratraadt: false,
                        rekkefolge: 0,
                        enhet: {
                            organisasjonsnummer: regnOrgNos[Math.floor(Math.random() * regnOrgNos.length)],
                            navn: [`Company ${i}`],
                            organisasjonsform: {
                                kode: '',
                                beskrivelse: ''
                            },
                            erSlettet: false
                        }
                    }
                ],
                sistEndret: ''
            })
        })
        roles.set(orgNo, value)
    }
    return roles
}



