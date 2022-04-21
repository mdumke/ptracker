#!/usr/bin/env node

import { Command } from 'commander'
import { init, ls, add, update, archive, show } from './actions'

const program = new Command()

program
  .name('ptracker')
  .version('0.1.0')
  .description(
    'Minimalistic utility for tracking progress on multiple projects or tasks'
  )

program
  .command('init')
  .description('prepare database file')
  .action(init)

program
  .command('ls')
  .description('list active projects')
  .option('-a, --all', 'include archived projects')
  .action(ls)

program
  .command('add <title> <target>')
  .description('register a new project together with a target')
  .option('-s, --start-value <start>', 'the value at which the project begins')
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
