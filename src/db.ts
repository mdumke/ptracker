import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(__dirname, '..', 'db/data.json')

const initDB = (dbPath: string) => {
  console.log(`initializing db at ${dbPath}...\n`)

  try {
    fs.writeFileSync(dbPath, '{}')
  } catch (err) {
    throw new Error(`could not initialize db: ${err}`)
  }
}

const loadData = (): string => {
  if (!fs.existsSync(DB_PATH)) {
    initDB(DB_PATH)
  }

  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

const saveData = (data: object) => {
  if (!fs.existsSync(DB_PATH)) {
      throw new Error(`Could not find database at ${DB_PATH}`)
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(data))
}

export { loadData, saveData }
