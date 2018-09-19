import * as path from 'path'
import {
  sync as glob
} from 'glob'
import {
  statSync as stat
} from 'fs'
const excludeModuleDir: RegExp = /(node_modules|vendor|bower_components)/
function* lookup (directory: string) {
  let stack = [path.resolve(directory)]
  while (stack.length) {
    let file = stack.pop()
    if (/(package\.json|composer\.json)$/.test(file)) yield file
    if (excludeModuleDir.test(file)) continue
    let fStats = stat(file)
    if (!fStats || !fStats.isDirectory()) continue
    let files = glob(`${file}/*`)
    stack.push(...files)
  }
  return 'end'
}

module.exports = lookup
