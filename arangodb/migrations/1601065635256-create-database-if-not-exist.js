const { database } = require('../db')

const newDatabase = process.env.ARANGODB_NAME

module.exports.up = async () => {
  const system = database('_system')
  const databases = await system.listUserDatabases()
  const db = databases.find((db) => db === newDatabase)
  if (!db) {
    await system.createDatabase(newDatabase)
  }
}

module.exports.down = async () => {
  const system = database('_system')
  const databases = await system.listUserDatabases()
  const db = databases.find((db) => db.name === newDatabase)
  if (db) {
    await system.dropDatabase(newDatabase)
  }
}
