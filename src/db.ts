import fs from 'fs'
import path from 'path'

import { Projects } from './types'
import { datetimeReviver } from './utils'

const DB_FILE = '.ptracker.json'
const DB_PATH = path.join(process.env['HOME'] || '~', DB_FILE)

export const initDB = () => {
  if (fs.existsSync(DB_PATH)) {
    throw new Error(`Database already exists at ${DB_PATH}. Aborting`)
  }

  fs.writeFileSync(DB_PATH, '{}')
  return DB_PATH
}

const assertDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(
      `Could not find db at ${DB_PATH}. Be sure to run the "init" command first`
    )
  }
}

export const loadData = (): Projects => {
  assertDB()
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'), datetimeReviver)
}

export const saveData = (data: Projects) => {
  assertDB()
  const tmpPath = `${DB_PATH}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2))
  fs.renameSync(tmpPath, DB_PATH)
}
