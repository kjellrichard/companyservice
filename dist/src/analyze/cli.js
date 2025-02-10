"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const countAccountant_1 = require("./countAccountant");
const promises_1 = require("fs/promises");
//const { writeCsv } = require('@ricb/csv');
(async () => {
    const { writeCsv } = await import('@ricb/csv');
    const start = Date.now();
    const regnskap = await (0, countAccountant_1.countRegnskap)({ verbose: true });
    await (0, promises_1.writeFile)('c://temp//regnskap.json', JSON.stringify(regnskap, null, 2));
    const fileName = await writeCsv(Object.values(regnskap), 'c://temp//regnskap.csv', { separator: '\t' });
    console.log(`Wrote ${fileName}. Took ${(Date.now() - start) / 1000 / 60} minutes.`);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL2FuYWx5emUvY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXNCO0FBQ3RCLHVEQUFpRDtBQUNqRCwwQ0FBdUM7QUFDdkMsNENBQTRDO0FBRzVDLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDUixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDOUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBRXhCLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSwrQkFBYSxFQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDdkQsTUFBTSxJQUFBLG9CQUFTLEVBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFN0UsTUFBTSxRQUFRLEdBQUcsTUFBTSxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSx3QkFBd0IsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBRXZHLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxRQUFRLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFFdkYsQ0FBQyxDQUFDLEVBQUUsQ0FBQSJ9