const files = ['./.env', './cache/sample.json.gz'];

(async () => {
    const { default: cpy } = await import('cpy')

    for (const file of files) {
        try {
            await cpy(file, './dist/')
        } catch (err) {
            console.log('Cpy err: ' + err.message)
        }
    }
})()