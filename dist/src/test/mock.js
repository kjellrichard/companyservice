"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = exports.getCompanies = void 0;
const roles = new Map();
function getCompanies(count) {
    const companies = new Map();
    for (let i = 1; i <= count; i++) {
        const orgNo = `orgno${i}`;
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
        });
    }
    return companies;
}
exports.getCompanies = getCompanies;
const regnOrgNos = [
    'orgno1', 'orgno2', 'orgno3', 'orgno4', 'orgno5', 'orgno6', 'orgno7', 'orgno8', 'orgno9', 'orgno10',
    'orgno11', 'orgno12', 'orgno13', 'orgno14', 'orgno15', 'orgno16', 'orgno17', 'orgno18', 'orgno19', 'orgno20'
];
const roleKoder = ['REGN', 'REVI', 'OTHER'];
function getRoles(companies) {
    for (const [orgNo, company] of companies) {
        const value = [];
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
            });
        });
        roles.set(orgNo, value);
    }
    return roles;
}
exports.getRoles = getRoles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9jay5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy90ZXN0L21vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBTUEsTUFBTSxLQUFLLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUE7QUFFNUMsU0FBZ0IsWUFBWSxDQUFDLEtBQWE7SUFDdEMsTUFBTSxTQUFTLEdBQW9CLElBQUksR0FBRyxFQUFFLENBQUE7SUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM3QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFBO1FBQ3pCLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO1lBQ2pCLG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsSUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUFFO1lBQ3BCLGNBQWMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtZQUN4Qyx3QkFBd0IsRUFBRTtnQkFDdEIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsV0FBVyxFQUFFLGVBQWU7YUFDL0I7WUFFRCxhQUFhLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQzlDLFVBQVUsRUFBRSxxQkFBcUIsQ0FBQyxNQUFNO1lBQ3hDLFdBQVcsRUFBRTtnQkFDVCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUN4QixVQUFVLEVBQUUsTUFBTSxDQUFDLEVBQUU7Z0JBQ3JCLFFBQVEsRUFBRSxRQUFRLENBQUMsRUFBRTtnQkFDckIsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsT0FBTyxFQUFFLGdCQUFnQixDQUFDLEVBQUU7Z0JBQzVCLGFBQWEsRUFBRSxJQUFJLENBQUMsRUFBRTthQUN6QjtZQUNELGtCQUFrQixFQUFFO2dCQUNoQixPQUFP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