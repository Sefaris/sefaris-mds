import type { Logger } from 'winston';
import winston from 'winston';
import { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as fs from 'fs';
import path from 'path';

const { printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = new Date(timestamp as string).toLocaleString('en-GB');
  return `${formattedTimestamp} [${level}]: ${message}`;
});

export function getLogsDirPath(): string {
  return path.join(path.dirname(process.execPath), 'logs');
}

function createFileLogger(): Logger {
  const dir = getLogsDirPath();
  fs.mkdirSync(dir, { recursive: true });
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
    transports: [
      new DailyRotateFile({
        dirname: dir,
        filename: 'Starter-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
      }),
      new winston.transports.Console(),
    ],
  });
}

function createConsoleOnlyLogger(): Logger {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
    transports: [new winston.transports.Console()],
  });
}

let logger: Logger;
try {
  logger = createFileLogger();
} catch (err) {
  logger = createConsoleOnlyLogger();
  logger.error(`Failed to initialize file logger: ${err instanceof Error ? err.message : err}`);
}

type Level = 'info' | 'error' | 'warn' | 'http' | 'verbose' | 'debug' | 'silly';

function log(level: Level, msg: string) {
  try {
    logger[level](msg);
  } catch (err) {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[logger fallback ${level}] ${msg} (cause: ${err instanceof Error ? err.message : err})`,
    );
  }
}

export function loggerInfo(msg: string) {
  log('info', msg);
}
export function loggerError(msg: string) {
  log('error', msg);
}
export function loggerWarn(msg: string) {
  log('warn', msg);
}
export function loggerHttp(msg: string) {
  log('http', msg);
}
export function loggerVerbose(msg: string) {
  log('verbose', msg);
}
export function loggerDebug(msg: string) {
  log('debug', msg);
}
export function loggerSilly(msg: string) {
  log('silly', msg);
}
