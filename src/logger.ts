import chalk from 'chalk'

class Logger {
  error (msg: string) {
    console.error(chalk.red(msg))
  }

  success (msg: string) {
    console.log(chalk.green(msg))
  }

  info (msg: string) {
    console.log(msg)
  }
}

const logger = new Logger()

export { logger }
