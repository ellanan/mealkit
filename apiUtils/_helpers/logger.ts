import winston from 'winston';

const papertrail = new winston.transports.Http({
  host: 'logs.collector.solarwinds.com',
  path: '/v1/log',
  auth: {
    // @ts-expect-error not sure why papertrail is not working, their example shows new String(''), shouldn't matter but need to try
    // eslint-disable-next-line no-new-wrappers
    username: new String(''),
    password: process.env.PAPERTRAIL_TOKEN,
  },
  ssl: true,
});

export const logger = winston.createLogger({
  transports: [papertrail, new winston.transports.Console()],
});

export const instanceId = (Math.random() + 1).toString(36).substring(7);
