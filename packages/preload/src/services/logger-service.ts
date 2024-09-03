import winston from 'winston';
import { format } from 'winston';
const { printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString('en-GB');
  return `${formattedTimestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), myFormat),
  transports: [
    new winston.transports.File({ filename: 'app.log' }),
    new winston.transports.Console(),
  ],
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
