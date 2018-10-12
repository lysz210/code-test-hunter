declare var emit: any;
// TODO: need e reducer to collect all rows with same keys and convert
// package into packages.
export const packagesDD: PouchDB.Core.PutDocument<any> = {
  _id: '_design/packages',
  version: '0.0.6',
  views: {
    dependencies: {
      map: function (doc: PouchDB.Core.PostDocument<any>) {
        if (doc.dependencies) {
          for (let mod in doc.dependencies) {
            emit([mod, doc.dependencies[mod]], {
              name: mod,
              versione: doc.dependencies[mod],
              package: {
                _id: doc._id,
                name: doc.name,
                version: doc.version
              }
            })
          }
        }
      }.toString()
    }
  }
}