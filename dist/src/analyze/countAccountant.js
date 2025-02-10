"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countRegnskap = void 0;
const brreg_1 = require("../lib/brreg");
async function countRegnskap({ verbose = true }) {
    const companies = await (0, brreg_1.getCompanies)({ verbose });
    const roles = await (0, brreg_1.getRoles)({ verbose });
    const regn = {};
    companies.forEach(company => {
        const currentRoles = roles.get(company.organisasjonsnummer);
        if (!currentRoles || currentRoles.length === 0)
            return;
        let accountant;
        const regns = currentRoles.filter(r => r.type.kode === 'REGN').map(regn => regn.roller.filter(r => r.fratraadt === false && r.type.kode === 'REGN' && r.enhet?.erSlettet === false)).flat();
        if (regns.length > 0)
            accountant = regns.sort((a, b) => a.rekkefolge - b.rekkefolge)[0].enhet;
        if (!accountant)
            return;
        if (!regn[accountant.organisasjonsnummer]) {
            const comp = companies.get(accountant.organisasjonsnummer);
            regn[accountant.organisasjonsnummer] = {
                OrgNo: accountant.organisasjonsnummer,
                Name: comp?.navn || accountant.navn[0],
                City: comp?.forretningsadresse.poststed || '',
                'None': 0,
                'Micro 1–9': 0,
                'Small 10–49': 0,
                'Medium 50–249': 0,
                'Large 250+': 0,
                'Total': 0
            };
        }
        regn[accountant.organisasjonsnummer].Total++;
        const numberOfEmployees = company.antallAnsatte || 0;
        if (numberOfEmployees === 0)
            regn[accountant.organisasjonsnummer]['None']++;
        else if (numberOfEmployees < 10)
            regn[accountant.organisasjonsnummer]['Micro 1–9']++;
        else if (numberOfEmployees < 50)
            regn[accountant.organisasjonsnummer]['Small 10–49']++;
        else if (numberOfEmployees < 250)
            regn[accountant.organisasjonsnummer]['Medium 50–249']++;
        else
            regn[accountant.organisasjonsnummer]['Large 250+']++;
    });
    return regn;
}
exports.countRegnskap = countRegnskap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRBY2NvdW50YW50LmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2FuYWx5emUvY291bnRBY2NvdW50YW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFxRDtBQWlCOUMsS0FBSyxVQUFVLGFBQWEsQ0FBQyxFQUNoQyxPQUFPLEdBQUcsSUFBSSxFQUdqQjtJQUNHLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBQSxvQkFBWSxFQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNqRCxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUEsZ0JBQVEsRUFBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDekMsTUFBTSxJQUFJLEdBQW1CLEVBQUUsQ0FBQTtJQUUvQixTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFDM0QsSUFBSSxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDMUMsT0FBTTtRQUNWLElBQUksVUFBVSxDQUFBO1FBQ2QsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxLQUFLLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDM0wsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDaEIsVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFFM0UsSUFBSSxDQUFDLFVBQVU7WUFDWCxPQUFNO1FBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsRUFBRTtZQUN2QyxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1lBRTFELElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsR0FBRztnQkFDbkMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxtQkFBbUI7Z0JBQ3JDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixDQUFDLFFBQVEsSUFBSSxFQUFFO2dCQUM3QyxNQUFNLEVBQUUsQ0FBQztnQkFDVCxXQUFXLEVBQUUsQ0FBQztnQkFDZCxhQUFhLEVBQUUsQ0FBQztnQkFDaEIsZUFBZSxFQUFFLENBQUM7Z0JBQ2xCLFlBQVksRUFBRSxDQUFDO2dCQUNmLE9BQU8sRUFBRSxDQUFDO2FBQ2IsQ0FBQTtTQUNKO1FBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQzVDLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUE7UUFFcEQsSUFBSSxpQkFBaUIsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFBO2FBQzdDLElBQUksaUJBQWlCLEdBQUcsRUFBRTtZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQTthQUNsRCxJQUFJLGlCQUFpQixHQUFHLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUE7YUFDcEQsSUFBSSxpQkFBaUIsR0FBRyxHQUFHO1lBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFBOztZQUV2RCxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQTtJQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNGLE9BQU8sSUFBSSxDQUFBO0FBQ2YsQ0FBQztBQW5ERCxzQ0FtREMifQ==