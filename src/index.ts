#!/usr/bin/env node

import { loadData, saveData } from './db'
import { Command } from 'commander'
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

const ls = (options: { all: boolean }) => {
  try {
    const projects = listProjects(loadData(), options.all)
    logger.info('tracked projects\n')
    projects.forEach(p => {
      logger.info(` - ${p.title} (${computeCompletion(p)}%)`)
    })
    logger.info('')
  } catch (err) {
    logger.error(`Could not prepare data: ${err}`)
  }
}

const add = (title: string, target: string) => {
  try {
    const projects = loadData()
    const nextProjects = addProject(projects, buildProject({ title, target }))
    saveData(nextProjects)
    logger.success(`Created new project "${title}"`)
  } catch (err) {
    logger.error(`Could not create project. ${err}`)
  }
}

const update = (title: string, value: string) => {
  try {
    const projects = loadData()
    const id = findIdLike(projects, title)
    saveData(updateProject(projects, id, value))
  } catch (err) {
    logger.error(`Unable to update project. ${err}`)
  }
}

const archive = (title: string) => {
  try {
    const projects = loadData()
    const id = findIdLike(projects, title)
    saveData(archiveProject(projects, id))
  } catch (err) {
    logger.error(`Unable to archive project. ${err}`)
  }
}

const show = (title: string) => {
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

const program = new Command()

program
  .name('ptracker')
  .version('0.1.0')
  .description(
    'Minimalistic utility for tracking progress on multiple projects or tasks'
  )

program
  .command('ls')
  .description('list active projects')
  .option('-a, --all', 'include archived projects')
  .action(ls)

program
  .command('add <title> <target>')
  .description('register a new project together with a target')
  .action(add)

program
  .command('update <title> <target>')
  .description(
    'record a new value for the project given by (partial) id or title'
  )
  .action(update)

program
  .command('archive <title>')
  .description('mark the project as not active')
  .action(archive)

program
  .command('show <title>')
  .description('display update history for the given project')
  .action(show)

program.parse()
