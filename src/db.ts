import fs from 'fs'
import path from 'path'

import { Projects } from './types'
import { datetimeReviver } from './utils'

const DB_FILE = '.ptracker.json'
const DB_PATH = path.join(process.env['HOME'] || '~', DB_FILE)
const TEST_PATH = path.join(__dirname, '../db/database.test.json')

const initDB = (dbPath: string) => (): string => {
  if (fs.existsSync(dbPath)) {
    throw new Error(`Database already exists at ${dbPath}. Aborting`)
  }

  fs.writeFileSync(dbPath, '{}')
  return dbPath
}

const assertDB = (dbPath: string) => {
  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `Could not find db at ${dbPath}. Be sure to run the "init" command first`
    )
  }
}

const loadData = (dbPath: string) => (): Projects => {
  assertDB(dbPath)
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'), datetimeReviver)
}

const saveData = (dbPath: string) => (data: Projects) => {
  assertDB(dbPath)
  const tmpPath = `${dbPath}.tmp`
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2))
  fs.renameSync(tmpPath, dbPath)
}

export const db = {
  init: initDB(DB_PATH),
  load: loadData(DB_PATH),
  save: saveData(DB_PATH)
}

export const testDB = {
  init: initDB(TEST_PATH),
  load: loadData(TEST_PATH),
  save: saveData(TEST_PATH)
}
