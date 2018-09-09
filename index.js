const Koa = require('koa')
const {
    green
} = require('chalk')
const app = new Koa()

app.listen(8888)

console.log(green(`Code Test Hunter running at http://localhost:8888`))
