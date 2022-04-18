import { loadData, saveData } from './db'

const projects = loadData()

console.log(JSON.stringify(projects))
