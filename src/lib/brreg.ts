import https from 'https'
import { createReadStream, createWriteStream, } from 'fs'
import { stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { NOCompany } from '../../types'
import zlib from 'zlib'
import StreamArray from 'stream-json/streamers/StreamArray'


type BrregDictionary = Map<string, NOCompany>
const companies: BrregDictionary = new Map()
const CACHE_DIR = resolve(process.env.CACHE_DIR || './cache')
const ALL_UNITS_FILENAME = resolve(CACHE_DIR, process.env.ALL_UNITS_FILENAME || 'all_enheter.json.gz')
const ALL_UNITS_URL = 'https://data.brreg.no/enhetsregisteret/oppslag/enheter/lastned'
type VerboseParam = {
    verbose?: boolean
}
export async function downloadFile(): Promise<string> {
    const file = createWriteStream(ALL_UNITS_FILENAME)
    return new Promise((resolve, reject) => {
        https.get(ALL_UNITS_URL, response => {

            file.on('finish', () => {
                file.close()
                resolve(ALL_UNITS_FILENAME)
            })
            response.pipe(file)

        })
    })
}
export async function getFile({ verbose }: VerboseParam = {}): Promise<string> {
    let exists = false
    try {
        const fileinfo = await stat(ALL_UNITS_FILENAME)
        if (fileinfo.mtime > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            exists = true
        }
    } catch (e) {
        if (e.code !== 'ENOENT')
            throw e
    }

    if (exists) {
        verbose && console.log('Using cached all units file.')
        return ALL_UNITS_FILENAME
    }
    const downloaded = await downloadFile()
    verbose && console.log('Downloaded all units from Brreg.')
    return downloaded
}

export async function unzip({ filename, verbose }: VerboseParam & { filename?: string } = {}): Promise<BrregDictionary> {
    const fileToRead = filename || ALL_UNITS_FILENAME
    const logInterval = 100000
    let counter = 0
    let lapStart = Date.now()
    const start = Date.now()
    //const r = resolve
    return new Promise((resolve, reject) => {
        const stream = StreamArray.withParser()
        stream.on('data', async (data) => {
            ++counter
            const value: NOCompany = data.value
            companies.set(value.organisasjonsnummer, value)

            if (counter % logInterval === 0) {
                //await zip(companies.slice(0, 1000), r(CACHE_DIR, 'sample.json.gz'))

                const now = Date.now()
                const avg = Math.floor((now - lapStart) / logInterval * 1000)
                lapStart = now
                verbose && console.log(`Read ${counter} companies. Avg ${avg / 1000}ms per company.`)
            }
        })

        stream.on('end', () => {
            verbose && console.log(`Done with ${companies.size} companies in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`)
            resolve(companies)
        })
        stream.on('error', err => {
            reject(err)
        })
        createReadStream(fileToRead)
            .pipe(zlib.createGunzip())
            .pipe(stream.input)
    })
}

export async function zip(data, filename) {
    return new Promise((resolve, reject) => {
        zlib.gzip(JSON.stringify(data), async (err, buffer) => {
            if (err)
                return reject(err)
            await writeFile(filename, buffer, 'binary')
            resolve(filename)
        })
    })
}

export async function init({ verbose }: VerboseParam = {}): Promise<void> {
    if (companies.size)
        return
    await getFile({ verbose })
    await unzip({ verbose })
}

export async function getCompanies({ verbose }: VerboseParam = {}): Promise<BrregDictionary> {
    await init({ verbose })
    return companies
}

export async function getCompany(organisasjonsnummer: string): Promise<NOCompany | undefined> {
    await init()
    return companies.get(organisasjonsnummer)
}

export async function findCompany(query: string): Promise<NOCompany | null> {
    await init()
    for (const [, company] of companies) {
        if (isMatch(query, company))
            return company
    }
    return null
}

function isMatch(query: string, company: NOCompany): boolean {
    return new RegExp(query, 'i').test(company.navn)
}

export async function searchCompanies(query: string): Promise<NOCompany[]> {
    await init()
    const result: NOCompany[] = []
    for (const [, company] of companies) {
        if (isMatch(query, company)) {
            result.push(company)
        }
    }
    return result
}