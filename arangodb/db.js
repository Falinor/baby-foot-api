const Database = require('arangojs')

module.exports.db = new Database({
  url: process.env.ARANGODB_URL ?? 'http://localhost:8529'
})
