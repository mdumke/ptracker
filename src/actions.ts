import { logger } from './logger'
import { DBAdapter, Project } from './types'
import { dateStr } from './utils'
import {
  addProject,
  computeCompletion,
  archiveProject,
  buildProject,
  findIdLike,
  listProjects,
  updateProject
} from './project-service'

export const init = (db: DBAdapter) => () => {
  try {
    const dbPath = db.init()
    logger.success(`Initialized db at ${dbPath}`)
  } catch (err) {
    logger.error(`Unable to initialize db. ${err}`)
  }
}

export const ls = (db: DBAdapter) => (options: { all: boolean }) => {
  try {
    printList(listProjects(db.load(), options.all))
  } catch (err) {
    logger.error(`Unable to prepare data. ${err}`)
  }
}

export const add = (db: DBAdapter) => (
  title: string,
  target: string,
  options: { startValue?: string }
) => {
  try {
    const projects = db.load()
    const nextProjects = addProject(
      projects,
      buildProject({ title, target, startValue: options.startValue })
    )
    db.save(nextProjects)
    logger.success(`Created new project "${title}"`)
  } catch (err) {
    logger.error(`Could not create project. ${err}`)
  }
}

export const update = (db: DBAdapter) => (title: string, value: string) => {
  try {
    const projects = db.load()
    const id = findIdLike(projects, title)
    db.save(updateProject(projects, id, value))
  } catch (err) {
    logger.error(`Unable to update project. ${err}`)
  }
}

export const archive = (db: DBAdapter) => (title: string) => {
  try {
    const projects = db.load()
    const id = findIdLike(projects, title)
    db.save(archiveProject(projects, id))
  } catch (err) {
    logger.error(`Unable to archive project. ${err}`)
  }
}

export const show = (db: DBAdapter) => (title: string) => {
  try {
    const projects = db.load()
    const id = findIdLike(projects, title)
    printDetails(projects[id])
  } catch (err) {
    logger.error(`Unable to show project details. ${err}`)
  }
}

const printList = (projects: Project[]) => {
  logger.info('tracked projects')
  logger.info('----------------\n')
  projects.forEach(p => {
    logger.info(` - ${p.title} (${computeCompletion(p)}%)`)
  })
  logger.info('')
}

const printDetails = (project: Project) => {
  const start = project.startValue || 0
  const completion = computeCompletion(project)
  const titleStr = `${project.title} (${completion}%, from ${start})`
  logger.info(`\n${titleStr}`)
  logger.info(`${'-'.repeat(titleStr.length)}\n`)
  project.updates.forEach(u => {
    logger.info(`  ${dateStr(u.createdAt)}\t${u.value}`)
  })
  logger.info(`\n  \t\t${project.target}\n`)
}
