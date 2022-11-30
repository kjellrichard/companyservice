import 'dotenv/config'
import createServer from './src/server/createServer'
(async () => {
    const skipRoles = /skip-roles/i.test(process.argv[2])
    console.log('CACHE_DIR:', process.env.CACHE_DIR)
    console.log('ALL_UNITS_FILENAME:', process.env.ALL_UNITS_FILENAME)
    console.log('PORT:', process.env.PORT)
    if (skipRoles)
        console.log('Skipping roles')
    await createServer({ skipRoles })
})()
