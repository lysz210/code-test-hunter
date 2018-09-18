const glob = require('glob')
const path = require('path')
const fs = require('fs')
const {
    cyan,
    yellow
} = require('chalk')

const excludeModuleDir = /(node_modules|vendor|bower_components)/
function* lookup (directory) {
    let stack = [path.resolve(directory)]
    while (stack.length) {
        let file = stack.pop()
        if (/(package\.json|composer\.json)$/.test(file)) yield file
        if (excludeModuleDir.test(file)) continue
        let fStats = fs.statSync(file)
        if (!fStats || !fStats.isDirectory()) continue
        let files =glob.sync(`${file}/*`)
        stack.push(...files)
        // console.log(files)
    }
    return 'end'
}

module.exports = lookup
