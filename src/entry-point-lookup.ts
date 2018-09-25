import * as path from 'path'
import {
  sync as glob
} from 'glob'
import {
  statSync as stat
} from 'fs'

/**
 * regexp to catch node/composer/bower default directory
 */
const excludeModuleDir: RegExp = /(node_modules|vendor|bower_components)/

/**
 * check for module file descriptor and yield it
 * excludes node/composer/bower directory to avoid
 * listing unnecessary packages
 * @param directory path of the directory to parse
 */
export default function* lookup (directory: string) {
  // stack initialization
  // with the first directory to look
  let stack = [path.resolve(directory)]

  // loop to visite the fs tree
  while (stack.length) {
    let file = stack.pop()
    // yied the filepath if it's a module file
    if (/(package\.json|composer\.json)$/.test(file)) yield file
    // if file an excluded diretory is in the path then skip the whole
    // directory
    if (excludeModuleDir.test(file)) continue
    // get the file stats
    let fStats = stat(file)
    // if it's a file the check next file in stack
    if (!fStats || !fStats.isDirectory()) continue
    // get all the first level content of file(directory)
    let files = glob(`${file}/*`)
    // and push them into the stack
    stack.push(...files)
  }
  return 'end'
}
