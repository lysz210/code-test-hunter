import * as Koa from 'koa'

const app = new Koa()

app.use(async (ctx) => {
    ctx.body = 'hello '
})

app.listen(3000)

console.log(`Server listening at http://localhost:3000`)