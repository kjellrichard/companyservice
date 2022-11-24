export type NOCompanyAddresse = {
    adresse: string[]
    kommune: string
    kommunenummer: string
    land: string
    landkode: string
    postnummer: string
    poststed: string
}

export type NOCompany = {
    organisasjonsnummer: string
    antallAnsatte: number
    forretningsadresse: NOCompanyAddresse
    postadresse?: NOCompanyAddresse // one can use postadresse if the company want the mail to go another address than forretningsadresse
    institusjonellSektorkode: {
        kode: string
        beskrivelse: string
    }
    konkurs: boolean
    links: object[]
    maalform: string
    naeringskode1: {
        kode: string
        beskrivelse: string
    }
    navn: string
    organisasjonsform: {
        kode: string
        beskrivelse: string
    }
    registreringsdatoEnhetsregisteret: string
    registrertIForetaksregisteret: boolean
    registrertIFrivillighetsregisteret: boolean
    registrertIMvaregisteret: boolean
    registrertIStiftelsesregisteret: boolean
    stiftelsesdato: string
    underAvvikling: boolean
    underTvangsavviklingEllerTvangsopplosning: boolean
    rollegrupper: NORole[]
}

export type NOPerson = {
    fodselsdato: string
    navn: {
        fornavn: string
        etternavn: string
    }
    erDoed: boolean
}

export type NOEnhet = {
    organisasjonsnummer: string
    organisasjonsform: {
        kode: string
        beskrivelse: string
    }
    navn: string[]
    erSlettet: boolean
}
export type NORole = {
    type: {
        kode: string
        beskrivelse: string
    }
    sistEndret: string
    roller: [
        {
            type: {
                kode: string
                beskrivelse: string
            }
            person?: NOPerson
            enhet?: NOEnhet
            fratraadt: boolean
            rekkefolge: number
        }
    ]
}