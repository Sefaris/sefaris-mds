import type { Logger } from 'winston';
import winston from 'winston';
import { format } from 'winston';
import { getDocumentsPath } from './file-service';
import path from 'path';
const { printf } = format;

let logger: Logger;

const myFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-GB');
  return `${formattedTimestamp} [${level}]: ${message}`;
});

getDocumentsPath().then(documentsPath => {
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), myFormat),
    transports: [
      new winston.transports.File({ filename: path.join(documentsPath, 'gothic3', 'Starter.log') }),
      new winston.transports.Console(),
    ],
  });
});

export function loggerInfo(msg: string) {
  logger.info(msg);
}
export function loggerError(msg: string) {
  logger.error(msg);
}
export function loggerWarn(msg: string) {
  logger.warn(msg);
}
export function loggerHttp(msg: string) {
  logger.http(msg);
}
export function loggerVerbose(msg: string) {
  logger.verbose(msg);
}
export function loggerDebug(msg: string) {
  logger.debug(msg);
}
export function loggerSilly(msg: string) {
  logger.silly(msg);
}
