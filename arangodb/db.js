const Database = require('arangojs')

module.exports.database = (name = process.env.ARANGODB_NAME ?? '_system') =>
  new Database({
    url: process.env.ARANGODB_URL ?? 'http://localhost:8529',
    databaseName: name
  })
