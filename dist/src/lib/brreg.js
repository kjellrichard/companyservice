"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCompanies = exports.findCompany = exports.getCompany = exports.getCompanyRoles = exports.getRoles = exports.getCompanies = exports.initRoles = exports.init = exports.zip = exports.unzipRoles = exports.unzipUnits = exports.getRolesFile = exports.getUnitsFile = exports.downloadRolesFile = exports.downloadUnitsFile = void 0;
const tslib_1 = require("tslib");
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const zlib_1 = tslib_1.__importDefault(require("zlib"));
const StreamArray_1 = tslib_1.__importDefault(require("stream-json/streamers/StreamArray"));
const companies = new Map();
const roles = new Map();
const companiesByName = new Map();
const CACHE_DIR = (0, path_1.resolve)(process.env.CACHE_DIR || './cache');
const ALL_UNITS_FILENAME = (0, path_1.resolve)(CACHE_DIR, process.env.ALL_UNITS_FILENAME || 'all_enheter.json.gz');
const ALL_ROLES_FILENAME = (0, path_1.resolve)(CACHE_DIR, process.env.ALL_ROLES_FILENAME || 'all_roller.json.gz');
// https://data.brreg.no/enhetsregisteret/api/docs/index.html#enheter-lastned
const ALL_UNITS_URL = 'https://data.brreg.no/enhetsregisteret/api/enheter/lastned';
//const ALL_UNITS_URL = 'https://data.brreg.no/enhetsregisteret/oppslag/enheter/lastned'
const ALL_ROLES_URL = 'https://data.brreg.no/enhetsregisteret/api/roller/totalbestand';
async function downloadFile(url, filename) {
    const file = (0, fs_1.createWriteStream)(filename);
    return new Promise((resolve, reject) => {
        https_1.default.get(url, response => {
            file.on('finish', () => {
                file.close();
                resolve(filename);
            });
            response.pipe(file);
        });
    });
}
async function downloadUnitsFile() {
    return downloadFile(ALL_UNITS_URL, ALL_UNITS_FILENAME);
    /*
    const file = createWriteStream(ALL_UNITS_FILENAME)
    return new Promise((resolve, reject) => {
        https.get(ALL_UNITS_URL, response => {
            file.on('finish', () => {
                file.close()
                resolve(ALL_UNITS_FILENAME)
            })
            response.pipe(file)

        })
    })*/
}
exports.downloadUnitsFile = downloadUnitsFile;
async function downloadRolesFile() {
    return downloadFile(ALL_ROLES_URL, ALL_ROLES_FILENAME);
}
exports.downloadRolesFile = downloadRolesFile;
async function getFile({ verbose, url, filename }) {
    let exists = false;
    try {
        const fileinfo = await (0, promises_1.stat)(filename);
        if (fileinfo.mtime > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            exists = true;
        }
    }
    catch (e) {
        if (e.code !== 'ENOENT')
            throw e;
    }
    if (exists) {
        verbose && console.log(`Using cached file ${filename}`);
        return ALL_UNITS_FILENAME;
    }
    const downloaded = await downloadFile(url, filename);
    verbose && console.log(`Downloaded file ${filename} from Brreg`);
    return downloaded;
}
async function getUnitsFile({ verbose } = {}) {
    return getFile({ verbose, url: ALL_UNITS_URL, filename: ALL_UNITS_FILENAME });
}
exports.getUnitsFile = getUnitsFile;
async function getRolesFile({ verbose } = {}) {
    return getFile({ verbose, url: ALL_ROLES_URL, filename: ALL_ROLES_FILENAME });
}
exports.getRolesFile = getRolesFile;
async function unzipUnits({ filename, verbose }) {
    const fileToRead = filename || ALL_UNITS_FILENAME;
    const logInterval = 100000;
    let counter = 0;
    let lapStart = Date.now();
    const start = Date.now();
    //const r = resolve
    return new Promise((resolve, reject) => {
        const stream = StreamArray_1.default.withParser();
        stream.on('data', async (data) => {
            ++counter;
            const value = removeKey(data.value, 'links');
            companies.set(value.organisasjonsnummer, value);
            companiesByName.set(value.navn.replace(/\s/ig, '').toLowerCase(), value.organisasjonsnummer);
            if (counter % logInterval === 0) {
                //await zip(companies.slice(0, 1000), r(CACHE_DIR, 'sample.json.gz'))
                const now = Date.now();
                const avg = Math.floor((now - lapStart) / logInterval * 1000);
                lapStart = now;
                verbose && console.log(`Read ${counter} items. Avg ${avg / 1000}ms per item.`);
            }
        });
        stream.on('end', () => {
            verbose && console.log(`Done with ${counter} companies in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`);
            resolve(companies);
        });
        stream.on('error', err => {
            reject(err);
        });
        (0, fs_1.createReadStream)(fileToRead)
            .pipe(zlib_1.default.createGunzip())
            .pipe(stream.input);
    });
}
exports.unzipUnits = unzipUnits;
const removeKey = (obj, key) => obj !== Object(obj) ?
    obj :
    Array.isArray(obj) ?
        obj.map(item => removeKey(item, key)) :
        Object.keys(obj)
            .filter(k => k !== key)
            .reduce((acc, x) => Object.assign(acc, {
            [x]: removeKey(obj[x], key)
        }), {});
async function unzipRoles({ filename, verbose }) {
    const fileToRead = filename || ALL_ROLES_FILENAME;
    const logInterval = 100000;
    let counter = 0;
    let lapStart = Date.now();
    const start = Date.now();
    //const r = resolve
    return new Promise((resolve, reject) => {
        const stream = StreamArray_1.default.withParser();
        stream.on('data', async (data) => {
            ++counter;
            const orgNo = data.value.organisasjonsnummer;
            const value = data.value.rollegrupper.filter(role => ['REVI', 'REGN'].indexOf(role.type.kode) > -1).map(r => removeKey(r, '_links'));
            roles.set(orgNo, value);
            if (counter % logInterval === 0) {
                //await zip(companies.slice(0, 1000), r(CACHE_DIR, 'sample.json.gz'))
                const now = Date.now();
                const avg = Math.floor((now - lapStart) / logInterval * 1000);
                lapStart = now;
                verbose && console.log(`Read ${counter} items. Avg ${avg / 1000}ms per item.`);
            }
        });
        stream.on('end', () => {
            verbose && console.log(`Done with ${counter} roles in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`);
            resolve(roles);
        });
        stream.on('error', err => {
            reject(err);
        });
        (0, fs_1.createReadStream)(fileToRead)
            .pipe(zlib_1.default.createGunzip())
            .pipe(stream.input);
    });
}
exports.unzipRoles = unzipRoles;
async function zip(data, filename) {
    return new Promise((resolve, reject) => {
        zlib_1.default.gzip(JSON.stringify(data), async (err, buffer) => {
            if (err)
                return reject(err);
            await (0, promises_1.writeFile)(filename, buffer, 'binary');
            resolve(filename);
        });
    });
}
exports.zip = zip;
async function init({ verbose } = {}) {
    if (companies.size)
        return;
    await getUnitsFile({ verbose });
    await unzipUnits({ verbose });
}
exports.init = init;
async function initRoles({ verbose } = {}) {
    if (roles.size)
        return;
    await getRolesFile({ verbose });
    await unzipRoles({ verbose });
}
exports.initRoles = initRoles;
async function getCompanies({ verbose } = {}) {
    await init({ verbose });
    return companies;
}
exports.getCompanies = getCompanies;
async function getRoles({ verbose } = {}) {
    await initRoles({ verbose });
    return roles;
}
exports.getRoles = getRoles;
async function getCompanyRoles(organisasjonsnummer) {
    await initRoles();
    return roles.get(organisasjonsnummer) || [];
}
exports.getCompanyRoles = getCompanyRoles;
async function getCompany(organisasjonsnummer) {
    await init();
    return companies.get(organisasjonsnummer);
}
exports.getCompany = getCompany;
async function findCompany(query, exact = false) {
    await init();
    if (exact) {
        const orgNo = companiesByName.get(query.replace(/\s/ig, '').toLowerCase());
        if (!orgNo)
            return null;
        return companies.get(orgNo) || null;
    }
    for (const [, company] of companies) {
        if (isMatch(query, company))
            return company;
    }
    return null;
}
exports.findCompany = findCompany;
function isMatch(query, company) {
    return new RegExp(query, 'i').test(company.navn);
}
async function searchCompanies(query) {
    await init();
    const result = [];
    for (const [, company] of companies) {
        if (isMatch(query, company)) {
            result.push(company);
        }
    }
    return result;
}
exports.searchCompanies = searchCompanies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJyZWcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbGliL2JycmVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSwwREFBeUI7QUFDekIsMkJBQXlEO0FBQ3pELDBDQUE2QztBQUM3QywrQkFBOEI7QUFFOUIsd0RBQXVCO0FBQ3ZCLDRGQUEyRDtBQU0zRCxNQUFNLFNBQVMsR0FBb0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QyxNQUFNLEtBQUssR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QyxNQUFNLGVBQWUsR0FBd0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQTtBQUM3RCxNQUFNLGtCQUFrQixHQUFHLElBQUEsY0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLHFCQUFxQixDQUFDLENBQUE7QUFDdEcsTUFBTSxrQkFBa0IsR0FBRyxJQUFBLGNBQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxvQkFBb0IsQ0FBQyxDQUFBO0FBRXJHLDZFQUE2RTtBQUM3RSxNQUFNLGFBQWEsR0FBRyw0REFBNEQsQ0FBQTtBQUNsRix3RkFBd0Y7QUFFeEYsTUFBTSxhQUFhLEdBQUcsZ0VBQWdFLENBQUE7QUFVdEYsS0FBSyxVQUFVLFlBQVksQ0FBQyxHQUFHLEVBQUUsUUFBUTtJQUNyQyxNQUFNLElBQUksR0FBRyxJQUFBLHNCQUFpQixFQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEVB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