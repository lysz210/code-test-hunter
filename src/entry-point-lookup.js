const glob = require('glob')
const path = require('path')
const fs = require('fs')
const {
    cyan,
    yellow
} = require('chalk')

const dir = '..'
const excludeModuleDir = /(node_modules|vendor)/
function* lookup (directory) {
    let stack = [directory]
    while (stack.length) {
        let file = stack.pop()
        console.log(cyan(file))
        if (/(package\.json|composer\.json)$/.test(file)) yield file
        if (excludeModuleDir.test(file)) continue
        let fStats = fs.statSync(file)
        if (!fStats || !fStats.isDirectory()) continue
        let files =glob.sync(`${file}/*`)
        stack.push(...files)
        // console.log(files)
    }
}

module.exports = lookup
