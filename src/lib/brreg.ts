import https from 'https'
import { createReadStream, createWriteStream, } from 'fs'
import { stat, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { NOCompany, NORole } from '../../types'
import zlib from 'zlib'
import StreamArray from 'stream-json/streamers/StreamArray'


type BrregDictionary = Map<string, NOCompany>
type BrregRoleDictionary = Map<string, NORole[]>

const companies: BrregDictionary = new Map()
const roles: BrregRoleDictionary = new Map()
const companiesByName: Map<string, string> = new Map()
const CACHE_DIR = resolve(process.env.CACHE_DIR || './cache')
const ALL_UNITS_FILENAME = resolve(CACHE_DIR, process.env.ALL_UNITS_FILENAME || 'all_enheter.json.gz')
const ALL_ROLES_FILENAME = resolve(CACHE_DIR, process.env.ALL_ROLES_FILENAME || 'all_roller.json.gz')

// https://data.brreg.no/enhetsregisteret/api/docs/index.html#enheter-lastned
const ALL_UNITS_URL = 'https://data.brreg.no/enhetsregisteret/api/enheter/lastned'
const ALL_ROLES_URL = 'https://data.brreg.no/enhetsregisteret/api/roller/totalbestand'

type VerboseParam = {
    verbose?: boolean
}

type FileParam = {
    filename: string
}

async function downloadFile(url, filename): Promise<string> {
    const file = createWriteStream(filename)
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            file.on('finish', () => {
                file.close()
                resolve(filename)
            })
            response.pipe(file)
        })
    })
}

export async function downloadUnitsFile(): Promise<string> {
    return downloadFile(ALL_UNITS_URL, ALL_UNITS_FILENAME)
}

export async function downloadRolesFile(): Promise<string> {
    return downloadFile(ALL_ROLES_URL, ALL_ROLES_FILENAME)
}

async function getFile({ verbose, url, filename }: VerboseParam & FileParam & { url: string }): Promise<string> {
    let exists = false
    try {
        const fileinfo = await stat(filename)
        if (fileinfo.mtime > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            exists = true
        }
    } catch (e) {
        if (e.code !== 'ENOENT')
            throw e
    }

    if (exists) {
        verbose && console.log(`Using cached file ${filename}`)
        return ALL_UNITS_FILENAME
    }
    const downloaded = await downloadFile(url, filename)
    verbose && console.log(`Downloaded file ${filename} from Brreg`)
    return downloaded
}

export async function getUnitsFile({ verbose }: VerboseParam = {}): Promise<string> {
    return getFile({ verbose, url: ALL_UNITS_URL, filename: ALL_UNITS_FILENAME })
}

export async function getRolesFile({ verbose }: VerboseParam = {}): Promise<string> {
    return getFile({ verbose, url: ALL_ROLES_URL, filename: ALL_ROLES_FILENAME })
}

export async function unzipUnits({ filename, verbose }: VerboseParam & { filename?: string }): Promise<BrregDictionary> {
    const fileToRead = filename || ALL_UNITS_FILENAME
    const logInterval = 100000
    let counter = 0
    let lapStart = Date.now()
    const start = Date.now()
    return new Promise((resolve, reject) => {
        const stream = StreamArray.withParser()
        stream.on('data', async (data) => {
            ++counter
            const value: NOCompany = removeKey(data.value, 'links')
            companies.set(value.organisasjonsnummer, value)
            companiesByName.set(value.navn.replace(/\s/ig, '').toLowerCase(), value.organisasjonsnummer)
            if (counter % logInterval === 0) {
                const now = Date.now()
                const avg = Math.floor((now - lapStart) / logInterval * 1000)
                lapStart = now
                verbose && console.log(`Read ${counter} items. Avg ${avg / 1000}ms per item.`)
            }
        })

        stream.on('end', () => {
            verbose && console.log(`Done with ${counter} companies in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`)
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

const removeKey = (obj, key) => obj !== Object(obj) ?
    obj :
    Array.isArray(obj) ?
        obj.map(item => removeKey(item, key)) :
        Object.keys(obj)
            .filter(k => k !== key)
            .reduce((acc, x) => Object.assign(acc, {
                [x]: removeKey(obj[x], key)
            }), {})


export async function unzipRoles({ filename, verbose }: VerboseParam & { filename?: string }): Promise<BrregRoleDictionary> {
    const fileToRead = filename || ALL_ROLES_FILENAME
    const logInterval = 100000
    let counter = 0
    let lapStart = Date.now()
    const start = Date.now()
    //const r = resolve
    return new Promise((resolve, reject) => {
        const stream = StreamArray.withParser()
        stream.on('data', async (data) => {
            ++counter
            const orgNo = data.value.organisasjonsnummer
            const value: NORole[] = data.value.rollegrupper.filter(role => ['REVI', 'REGN'].indexOf(role.type.kode) > -1).map(r => removeKey(r, '_links'))
            roles.set(orgNo, value)

            if (counter % logInterval === 0) {
                //await zip(companies.slice(0, 1000), r(CACHE_DIR, 'sample.json.gz'))
                const now = Date.now()
                const avg = Math.floor((now - lapStart) / logInterval * 1000)
                lapStart = now
                verbose && console.log(`Read ${counter} items. Avg ${avg / 1000}ms per item.`)
            }
        })

        stream.on('end', () => {
            verbose && console.log(`Done with ${counter} roles in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`)
            resolve(roles)
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
    await getUnitsFile({ verbose })
    await unzipUnits({ verbose })
}

export async function initRoles({ verbose }: VerboseParam = {}): Promise<void> {
    if (roles.size)
        return
    await getRolesFile({ verbose })
    await unzipRoles({ verbose })
}

export async function getCompanies({ verbose }: VerboseParam = {}): Promise<BrregDictionary> {
    await init({ verbose })
    return companies
}

export async function getRoles({ verbose }: VerboseParam = {}): Promise<BrregRoleDictionary> {
    await initRoles({ verbose })
    return roles
}

export function getCompanyRoles(organisasjonsnummer: string): NORole[] {
    return roles.get(organisasjonsnummer) || []
}

export function getCompany(organisasjonsnummer: string): NOCompany | undefined {
    return companies.get(organisasjonsnummer)
}

export function findCompany(query: string, exact = false): NOCompany | null {

    if (exact) {
        const orgNo = companiesByName.get(query.replace(/\s/ig, '').toLowerCase())
        if (!orgNo)
            return null
        return companies.get(orgNo) || null
    }

    for (const [, company] of companies) {
        if (isMatch(query, company))
            return company
    }
    return null
}

function isMatch(query: string, company: NOCompany): boolean {
    return new RegExp(query, 'i').test(company.navn)
}

export function searchCompanies(query: string): NOCompany[] {
    const result: NOCompany[] = []
    for (const [, company] of companies) {
        if (isMatch(query, company)) {
            result.push(company)
        }
    }
    return result
}

