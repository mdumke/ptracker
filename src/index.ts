import { loadData, saveData } from './db'

console.log(loadData())

const projects = {
    p1: {
        name: 'project 1',
        target: 123
    }
}

saveData(projects)

console.log(loadData())


