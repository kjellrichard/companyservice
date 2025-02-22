"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const brreg_1 = require("../lib/brreg");
const app = (0, express_1.default)();
let skipRoles = false;
function applyRoles(company) {
    if (skipRoles)
        return company;
    company.rollegrupper = (0, brreg_1.getCompanyRoles)(company.organisasjonsnummer);
    return company;
}
app.get('/search', (req, res) => {
    const { query } = req.query;
    const start = Date.now();
    if (!query)
        return res.status(400).send('Query is required.');
    const companies = (0, brreg_1.searchCompanies)(query);
    for (const company of companies)
        applyRoles(company);
    return res
        .header('x-time-taken', `${Date.now() - start}`)
        .header('x-count', `${companies.length}`)
        .json(companies);
});
app.get('/find', (req, res) => {
    const { query, exact } = req.query;
    const start = Date.now();
    if (!query)
        return res.status(400).send('Query is required.');
    const company = (0, brreg_1.findCompany)(query, /true|1/i.test(String(exact)));
    res.header('x-time-taken', `${Date.now() - start}`);
    if (company)
        return res
            .json(applyRoles(company));
    else
        return res
            .status(404)
            .send(`Company with name ${query} not found.`);
});
app.get('/no/:orgno', (req, res) => {
    const orgno = req.params.orgno;
    const company = (0, brreg_1.getCompany)(orgno);
    const start = Date.now();
    if (company)
        res
            .header('x-time-taken', `${Date.now() - start}`)
            .json(applyRoles(company));
    else
        res
            .status(404)
            .send(`Company with id ${orgno} not found.`);
});
exports.default = async ({ skipRoles = false } = {}) => {
    const port = process.env.PORT || 9000;
    const verbose = true;
    console.log(`Listening on port ${port}`);
    app.listen(port);
    await (0, brreg_1.init)({ verbose });
    if (!skipRoles)
        await (0, brreg_1.initRoles)({ verbose });
    else
        skipRoles = true;
    console.log('Data loaded. I\'m ready to serve :)');
    return app;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlU2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci9jcmVhdGVTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsOERBQW9EO0FBRXBELHdDQUF5RztBQUV6RyxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQTtBQUNyQixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUE7QUFDckIsU0FBUyxVQUFVLENBQUMsT0FBa0I7SUFDbEMsSUFBSSxTQUFTO1FBQ1QsT0FBTyxPQUFPLENBQUE7SUFDbEIsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFBLHVCQUFlLEVBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7SUFDbkUsT0FBTyxPQUFPLENBQUE7QUFDbEIsQ0FBQztBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQy9DLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUN4QixJQUFJLENBQUMsS0FBSztRQUNOLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtJQUVyRCxNQUFNLFNBQVMsR0FBRyxJQUFBLHVCQUFlLEVBQUMsS0FBZSxDQUFDLENBQUE7SUFDbEQsS0FBSyxNQUFNLE9BQU8sSUFBSSxTQUFTO1FBQzNCLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN2QixPQUFPLEdBQUc7U0FDTCxNQUFNLENBQUMsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1NBQy9DLE1BQU0sQ0FBQyxTQUFTLEVBQUUsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3hCLENBQUMsQ0FBQyxDQUFBO0FBRUYsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDN0MsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0lBQ2xDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUV4QixJQUFJLENBQUMsS0FBSztRQUNOLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtJQUVyRCxNQUFNLE9BQU8sR0FBRyxJQUFBLG1CQUFXLEVBQUMsS0FBZSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUMzRSxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ25ELElBQUksT0FBTztRQUNQLE9BQU8sR0FBRzthQUNMLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTs7UUFFOUIsT0FBTyxHQUFHO2FBQ0wsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxxQkFBcUIsS0FBSyxhQUFhLENBQUMsQ0FBQTtBQUMxRCxDQUFDLENBQUMsQ0FBQTtBQUVGLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ2xELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQzlCLE1BQU0sT0FBTyxHQUFHLElBQUEsa0JBQVUsRUFBQyxLQUFLLENBQUMsQ0FBQTtJQUNqQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7SUFDeEIsSUFBSSxPQUFPO1FBQ1AsR0FBRzthQUNFLE1BQU0sQ0FBQyxjQUFjLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUM7YUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBOztRQUU5QixHQUFHO2FBQ0UsTUFBTSxDQUFDLEdBQUcsQ0FBQzthQUNYLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxhQUFhLENBQUMsQ0FBQTtBQUN4RCxDQUFDLENBQUMsQ0FBQTtBQUVGLGtCQUFlLEtBQUssRUFBRSxFQUFFLFNBQVMsR0FBRyxLQUFLLEtBQThCLEVBQUUsRUFBRSxFQUFFO0lBQ3pFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQTtJQUNyQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUE7SUFDcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hCLE1BQU0sSUFBQSxZQUFJLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLElBQUksQ0FBQyxTQUFTO1FBQ1YsTUFBTSxJQUFBLGlCQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBOztRQUU1QixTQUFTLEdBQUcsSUFBSSxDQUFBO0lBRXBCLE9BQU8sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUMsQ0FBQTtJQUVsRCxPQUFPLEdBQUcsQ0FBQTtBQUNkLENBQUMsQ0FBQSJ9