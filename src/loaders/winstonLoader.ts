import chalk from 'chalk';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { configure, format, transports } from 'winston';

import { env } from '../env';

export const winstonLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  /* const customFormat = format((info, opts) => {
        return `[${info.level}] ${JSON.stringify(info.message, null, 4)}`;
    });  */

  configure({
    transports: [
      new transports.Console({
        level: env.log.level,
        handleExceptions: true,
        format:
          env.node !== 'development'
            ? format.combine(format.json())
            : format.combine(
                format.splat(),
                format.errors({ stack: true }),
                format.colorize({ all: true }),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.printf(({ timestamp, level, message, ...rest }) => {
                  let stack = '';
                  if (rest && rest[0] && rest[0].indexOf('Error:') === 0) {
                    stack = `\n${rest[0]}`;
                  }
                  return `${timestamp} - [${level}]: ${message}${stack}`;
                })
              ),
      }),
    ],
  });
};
