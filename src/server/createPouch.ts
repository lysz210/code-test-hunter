import PouchDB from 'pouchdb-node'
import { packagesDD } from './pouchdb/packages'
PouchDB.plugin(require('pouchdb-upsert'))
PouchDB.plugin(require('pouchdb-adapter-memory'))
import { gt, valid } from 'semver'
export default () => {
  var pouch = new PouchDB('db', { adapter: 'memory' })
  pouch.upsert(packagesDD._id, (doc: any) => {
    if (!doc || !doc._id || !valid(doc.version) || gt(packagesDD.version, doc.version)) return packagesDD
    return false
  })
  return pouch
}
