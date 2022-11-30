"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("dotenv/config");
const createServer_1 = tslib_1.__importDefault(require("./src/server/createServer"));
(async () => {
    const skipRoles = /skip-roles/i.test(process.argv[2]);
    console.log('CACHE_DIR:', process.env.CACHE_DIR);
    console.log('ALL_UNITS_FILENAME:', process.env.ALL_UNITS_FILENAME);
    console.log('PORT:', process.env.PORT);
    if (skipRoles)
        console.log('Skipping roles');
    await (0, createServer_1.default)({ skipRoles });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUFzQjtBQUN0QixxRkFBb0Q7QUFDcEQsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNSLE1BQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFDbEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN0QyxJQUFJLFNBQVM7UUFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDakMsTUFBTSxJQUFBLHNCQUFZLEVBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO0FBQ3JDLENBQUMsQ0FBQyxFQUFFLENBQUEifQ==