import fs from 'fs'
import path from 'path'

import { Projects } from './types'
import { datetimeReviver } from './utils'

const DB_FILE = 'database.json'
const DB_PATH = path.join(__dirname, '..', 'db', DB_FILE)


const initDB = (dbPath: string) => {
  console.log(`initializing db at ${dbPath}...\n`)

  try {
    fs.writeFileSync(dbPath, '{}')
  } catch (err) {
    throw new Error(`could not initialize db: ${err}`)
  }
}

const loadData = (): Projects => {
  if (!fs.existsSync(DB_PATH)) {
    initDB(DB_PATH)
  }

  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'), datetimeReviver)
}

const saveData = (data: Projects) => {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Could not find database at ${DB_PATH}`)
  }

  const tmpPath = `${DB_PATH}.tmp`

  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2))
  fs.renameSync(tmpPath, DB_PATH)
}

export { loadData, saveData }
