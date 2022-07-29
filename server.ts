import 'dotenv/config'
import createServer from './src/server/createServer'
(async () => {
    console.log('CACHE_DIR:', process.env.CACHE_DIR)
    console.log('ALL_UNITS_FILENAME:', process.env.ALL_UNITS_FILENAME)
    console.log('PORT:', process.env.PORT)
    await createServer()
})()
