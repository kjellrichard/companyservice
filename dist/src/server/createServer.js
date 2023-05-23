"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const brreg_1 = require("../lib/brreg");
const app = (0, express_1.default)();
async function applyRoles(company) {
    company.rollegrupper = await (0, brreg_1.getCompanyRoles)(company.organisasjonsnummer);
    return company;
}
app.get('/search', async (req, res) => {
    const { query } = req.query;
    const start = Date.now();
    if (!query)
        return res.status(400).send('Query is required.');
    const companies = await (0, brreg_1.searchCompanies)(query);
    for (const company of companies)
        await applyRoles(company);
    return res
        .header('x-time-taken', `${Date.now() - start}`)
        .header('x-count', `${companies.length}`)
        .json(companies);
});
app.get('/find', async (req, res) => {
    const { query, exact } = req.query;
    const start = Date.now();
    if (!query)
        return res.status(400).send('Query is required.');
    const company = await (0, brreg_1.findCompany)(query, /true|1/i.test(String(exact)));
    res.header('x-time-taken', `${Date.now() - start}`);
    if (company)
        return res
            .json(await applyRoles(company));
    else
        return res
            .status(404)
            .send(`Company with name ${query} not found.`);
});
app.get('/no/:orgno', async (req, res) => {
    const orgno = req.params.orgno;
    const company = await (0, brreg_1.getCompany)(orgno);
    const start = Date.now();
    if (company)
        res
            .header('x-time-taken', `${Date.now() - start}`)
            .json(await applyRoles(company));
    else
        res
            .status(404)
            .send(`Company with id ${orgno} not found.`);
});
exports.default = async ({ skipRoles = false } = {}) => {
    const port = process.env.PORT || 9000;
    const verbose = true;
    app.listen(port);
    console.log(`Listening on port ${port}`);
    await (0, brreg_1.init)({ verbose });
    if (!skipRoles)
        await (0, brreg_1.initRoles)({ verbose });
    console.log('Data loaded. I\'m ready to serve :)');
    return app;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlU2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci9jcmVhdGVTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW9EO0FBRXBELHdDQUF5RztBQUV6RyxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQTtBQUNyQixLQUFLLFVBQVUsVUFBVSxDQUFDLE9BQWtCO0lBQ3hDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsTUFBTSxJQUFBLHVCQUFlLEVBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDekUsT0FBTyxPQUFPLENBQUE7QUFDbEIsQ0FBQztBQUNELEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDckQsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBQ3hCLElBQUksQ0FBQyxLQUFLO1FBQ04sT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0lBRXJELE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSx1QkFBZSxFQUFDLEtBQWUsQ0FBQyxDQUFBO0lBQ3hELEtBQUssTUFBTSxPQUFPLElBQUksU0FBUztRQUMzQixNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM3QixPQUFPLEdBQUc7U0FDTCxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1NBQy9DLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3hCLENBQUMs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