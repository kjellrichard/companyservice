export type NOCompany = {
    organisasjonsnummer: string
    antallAnsatte: number
    forretningsadresse: {
        adresse: string[]
        kommune: string
        kommunenummer: string
        land: string
        landkode: string
        postnummer: string
        poststed: string
    }
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
    underAvvikling: boolean
    underTvangsavviklingEllerTvangsopplosning: boolean
}