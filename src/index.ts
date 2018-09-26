import * as Koa from 'koa'
import createPouch from './createPouch'
import lookup from './entry-point-lookup'
import { readFileSync } from 'fs'

async function main() {
    const app = new Koa()
    const db = createPouch()
    
    db.info().then(console.log)
    app.use(async (ctx) => {
        ctx.body = 'hello'
    })

    for (let filename of lookup('..')) {
        let pkg = JSON.parse(readFileSync(filename).toString())
        for(let key in pkg) {
            if(key.startsWith('_')) delete pkg[key]
        }
        console.log(await db.upsert(filename, (doc:any) => {
            if (!doc._id) doc._id = filename
            return {...doc, ...pkg}
        }))
    }

    console.log(JSON.stringify(await db.query('packages/dependencies'), null, 4))
    
    const httpServer = app.listen(3000)
    
    console.log(`Server listening at http://localhost:3000`)
    return {httpServer, db}
}

main()
    .catch(err => {
        console.error('error in main', err)
    })