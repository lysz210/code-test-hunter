import * as Koa from 'koa'
import * as Static from 'koa-static'
import { resolve } from 'path'
import createPouch from './createPouch'
import lookup from './entry-point-lookup'
import { readFileSync } from 'fs';
import createApolloServer from './createApolloServer'

const app = new Koa()
const db = createPouch()
const apollo = createApolloServer()

for (let filename of lookup('..')) {
  let pkg = JSON.parse(readFileSync(filename).toString())
  for (let key in pkg) {
    if (key.startsWith('_')) delete pkg[key]
    db.upsert(filename, (doc:any) => {
      if (!doc._id) doc._id = filename
      return {
        ...doc,
        ...pkg
      }
    })
  }
}

apollo.applyMiddleware({ app })

app.use(async (ctx: any, next:any) => {
  if (ctx.path !== '/test') return await next()
  ctx.body = await db.allDocs()
})
app.use(Static(resolve(__dirname, 'public')))

console.log('ciao ', process.env.NODE_ENV)

const server = process.env.NODE_ENV !== 'development' ? app.listen(3000) : false
export {
  server,
  app
}
