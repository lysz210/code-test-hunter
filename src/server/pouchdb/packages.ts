declare var emit: any;

export const packagesDD: PouchDB.Core.PutDocument<any> = {
  _id: '_design/packages',
  version: '0.0.2',
  views: {
    dependencies: {
      map: function (doc: PouchDB.Core.PostDocument<any>) {
        if (doc.dependencies) {
          for (let mod in doc.dependencies) {
            emit([mod, doc.dependencies[mod]], {name: doc.name, version: doc.version})
          }
        }
      }.toString()
    }
  }
}