"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCompanies = exports.findCompany = exports.getCompany = exports.getCompanies = exports.init = exports.zip = exports.unzip = exports.getFile = exports.downloadFile = void 0;
const tslib_1 = require("tslib");
const https_1 = tslib_1.__importDefault(require("https"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const zlib_1 = tslib_1.__importDefault(require("zlib"));
const StreamArray_1 = tslib_1.__importDefault(require("stream-json/streamers/StreamArray"));
const companies = new Map();
const CACHE_DIR = (0, path_1.resolve)(process.env.CACHE_DIR || './cache');
const ALL_UNITS_FILENAME = (0, path_1.resolve)(CACHE_DIR, process.env.ALL_UNITS_FILENAME || 'all_enheter.json.gz');
const ALL_UNITS_URL = 'https://data.brreg.no/enhetsregisteret/oppslag/enheter/lastned';
async function downloadFile() {
    const file = (0, fs_1.createWriteStream)(ALL_UNITS_FILENAME);
    return new Promise((resolve, reject) => {
        https_1.default.get(ALL_UNITS_URL, response => {
            file.on('finish', () => {
                file.close();
                resolve(ALL_UNITS_FILENAME);
            });
            response.pipe(file);
        });
    });
}
exports.downloadFile = downloadFile;
async function getFile({ verbose } = {}) {
    let exists = false;
    try {
        const fileinfo = await (0, promises_1.stat)(ALL_UNITS_FILENAME);
        if (fileinfo.mtime > new Date(Date.now() - 1000 * 60 * 60 * 24)) {
            exists = true;
        }
    }
    catch (e) {
        if (e.code !== 'ENOENT')
            throw e;
    }
    if (exists) {
        verbose && console.log('Using cached all units file.');
        return ALL_UNITS_FILENAME;
    }
    const downloaded = await downloadFile();
    verbose && console.log('Downloaded all units from Brreg.');
    return downloaded;
}
exports.getFile = getFile;
async function unzip({ filename, verbose } = {}) {
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
            const value = data.value;
            companies.set(value.organisasjonsnummer, value);
            if (counter % logInterval === 0) {
                //await zip(companies.slice(0, 1000), r(CACHE_DIR, 'sample.json.gz'))
                const now = Date.now();
                const avg = Math.floor((now - lapStart) / logInterval * 1000);
                lapStart = now;
                verbose && console.log(`Read ${counter} companies. Avg ${avg / 1000}ms per company.`);
            }
        });
        stream.on('end', () => {
            verbose && console.log(`Done with ${companies.size} companies in ${(Math.floor(Date.now() - start) / 1000 / 60 * 10) / 10} minutes.`);
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
exports.unzip = unzip;
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
    await getFile({ verbose });
    await unzip({ verbose });
}
exports.init = init;
async function getCompanies({ verbose } = {}) {
    await init({ verbose });
    return companies;
}
exports.getCompanies = getCompanies;
async function getCompany(organisasjonsnummer) {
    await init();
    return companies.get(organisasjonsnummer);
}
exports.getCompany = getCompany;
async function findCompany(query) {
    await init();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJyZWcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvbGliL2JycmVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSwwREFBeUI7QUFDekIsMkJBQXlEO0FBQ3pELDBDQUE2QztBQUM3QywrQkFBOEI7QUFFOUIsd0RBQXVCO0FBQ3ZCLDRGQUEyRDtBQUkzRCxNQUFNLFNBQVMsR0FBb0IsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QyxNQUFNLFNBQVMsR0FBRyxJQUFBLGNBQU8sRUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQTtBQUM3RCxNQUFNLGtCQUFrQixHQUFHLElBQUEsY0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLHFCQUFxQixDQUFDLENBQUE7QUFDdEcsTUFBTSxhQUFhLEdBQUcsZ0VBQWdFLENBQUE7QUFJL0UsS0FBSyxVQUFVLFlBQVk7SUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBQSxzQkFBaUIsRUFBQyxrQkFBa0IsQ0FBQyxDQUFBO0lBQ2xELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbkMsZUFBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFFaEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO2dCQUNuQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7Z0JBQ1osT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7WUFDL0IsQ0FBQyxDQUFDLENBQUE7WUFDRixRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRXZCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBYkQsb0NBYUM7QUFDTSxLQUFLLFVBQVUsT0FBTyxDQUFDLEVBQUUsT0FBTyxLQUFtQixF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