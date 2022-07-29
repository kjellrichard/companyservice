"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: './.env-test' });
const chai_1 = require("chai");
const brreg_1 = require("../lib/brreg");
console.log(process.env.CACHE_DIR);
console.log(process.env.ALL_UNITS_FILENAME);
describe('brreg', () => {
    it('should extract data to company map', async () => {
        const data = await (0, brreg_1.unzip)({
            verbose: true
        });
        (0, chai_1.expect)(data).to.a('map');
    }).timeout(Infinity);
    it('should get all companies as map', async () => {
        const companies = await (0, brreg_1.getCompanies)({ verbose: true });
        (0, chai_1.expect)(companies).to.be.a('map');
        (0, chai_1.expect)(companies.size).to.be.greaterThan(100);
        companies.forEach(company => {
            (0, chai_1.expect)(company).to.be.a('object');
            (0, chai_1.expect)(company.organisasjonsnummer).to.be.a('string').with.lengthOf(9);
        });
    }).timeout(Infinity);
    it('should get all companies matching "speidergruppe" as array', async () => {
        const companies = await (0, brreg_1.searchCompanies)('speidergruppe');
        (0, chai_1.expect)(companies).to.be.a('array');
        (0, chai_1.expect)(companies.length).to.be.greaterThan(1);
        companies.forEach(company => {
            (0, chai_1.expect)(company.navn.toLowerCase()).to.contain('speidergruppe');
        });
    }).timeout(Infinity);
    it('should get all companies starting with "100"', async () => {
        const companies = await (0, brreg_1.searchCompanies)('^100');
        (0, chai_1.expect)(companies).to.be.a('array');
        (0, chai_1.expect)(companies.length).to.be.greaterThan(1);
        companies.forEach(company => {
            (0, chai_1.expect)(company.navn.toLowerCase().indexOf('100')).to.equal(0, 'navn should start with "100"');
        });
    }).timeout(Infinity);
    it('should get all companies ending with "speidergruppe"', async () => {
        const companies = await (0, brreg_1.searchCompanies)('speidergruppe$');
        (0, chai_1.expect)(companies).to.be.a('array');
        (0, chai_1.expect)(companies.length).to.be.greaterThan(1);
        companies.forEach(company => {
            (0, chai_1.expect)(company.navn.toLowerCase().indexOf('speidergruppe')).to.equal(company.navn.length - 'speidergruppe'.length, 'navn should end with "speidergruppe"');
        });
    }).timeout(Infinity);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJyZWcuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvdGVzdC9icnJlZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUErQjtBQUMvQixJQUFBLGVBQU0sRUFBQyxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO0FBRS9CLCtCQUE2QjtBQUM3Qix3Q0FBbUU7QUFHbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBRTNDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ25CLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNoRCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUEsYUFBSyxFQUFDO1lBQ3JCLE9BQU8sRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQTtRQUNGLElBQUEsYUFBTSxFQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDNUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRXBCLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM3QyxNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUEsb0JBQVksRUFBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZELElBQUEsYUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ2hDLElBQUEsYUFBTSxFQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUM3QyxT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