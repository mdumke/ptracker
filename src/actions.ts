import { loadData, saveData, initDB } from './db'
import { logger } from './logger'
import {
  addProject,
  computeCompletion,
  archiveProject,
  buildProject,
  findIdLike,
  listProjects,
  updateProject
} from './project-service'

export const init = () => {
  try {
    const dbPath = initDB()
    logger.success(`Initialized db at ${dbPath}`)
  } catch (err) {
    logger.error(`Unable to initialize db. ${err}`)
  }
}

export const ls = (options: { all: boolean }) => {
  try {
    const projects = listProjects(loadData(), options.all)
    logger.info('tracked projects\n----------------\n')
    projects.forEach(p => {
      logger.info(` - ${p.title} (${computeCompletion(p)}%)`)
    })
    logger.info('')
  } catch (err) {
    logger.error(`Unable to prepare data. ${err}`)
  }
}

export const add = (title: string, target: string) => {
  try {
    const projects = loadData()
    const nextProjects = addProject(projects, buildProject({ title, target }))
    saveData(nextProjects)
    logger.success(`Created new project "${title}"`)
  } catch (err) {
    logger.error(`Could not create project. ${err}`)
  }
}

export const update = (title: string, value: string) => {
  try {
    const projects = loadData()
    const id = findIdLike(projects, title)
    saveData(updateProject(projects, id, value))
  } catch (err) {
    logger.error(`Unable to update project. ${err}`)
  }
}

export const archive = (title: string) => {
  try {
    const projects = loadData()
    const id = findIdLike(projects, title)
    saveData(archiveProject(projects, id))
  } catch (err) {
    logger.error(`Unable to archive project. ${err}`)
  }
}

export const show = (title: string) => {
  try {
    const projects = loadData()
    const id = findIdLike(projects, title)
    const project = projects[id]
    const titleStr = `${project.title} (${computeCompletion(project)}%)`
    logger.info(`\n${titleStr}`)
    logger.info(`${'-'.repeat(titleStr.length)}\n`)
    project.updates.forEach(u => {
      const dateStr = u.createdAt.toLocaleDateString('de-de')
      logger.info(`${dateStr}\t${u.value}`)
    })
    logger.info(`\n  \t\t${project.target}`)
  } catch (err) {
    logger.error(`Unable to show project details. ${err}`)
  }
}
