import 'dotenv/config'
import { countRegnskap } from './countAccountant'
import { writeFile } from 'fs/promises'
//const { writeCsv } = require('@ricb/csv');


(async () => {
    const { writeCsv } = await import('@ricb/csv')
    const start = Date.now()

    const regnskap = await countRegnskap({ verbose: true })
    await writeFile('c://temp//regnskap.json', JSON.stringify(regnskap, null, 2))

    const fileName = await writeCsv(Object.values(regnskap), 'c://temp//regnskap.csv', { separator: '\t' })

    console.log(`Wrote ${fileName}. Took ${(Date.now() - start) / 1000 / 60} minutes.`)

})()