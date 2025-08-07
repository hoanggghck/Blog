import { LoggerService } from "@nestjs/common";
import chalk from "chalk";
import dayjs from "dayjs";
import { Logger, transports, format, createLogger } from "winston";

export class MyLogger implements LoggerService {
  private logger: Logger;
  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, time, level, message }) => {
              const strApp = chalk.green('Goldz'),
              strContext = chalk.yellow(`[${context}]`),
              strMessage = chalk.green(message);
              return `[${strApp}] - ${time} - ${level} - [${strContext}] - ${strMessage}`;
            })
          )
        }),
        new transports.File({
          format: format.combine(
            format.timestamp(),
            format.printf(({ context, time, level, message }) => {
              return `[Goldz] - ${time} - ${level} - [${context}] - ${message}`;
            })
          ),
          dirname: 'logs',
          filename: 'app.log',
        })
      ]
    })
  }
  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context , time});
  }
  info(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context , time});
  }
  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('error', message, { context, time });
  }
  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('warn', message, { context , time});
  }
  debug?(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('debug', message, { context, time });
  }
}
