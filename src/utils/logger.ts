import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = isDevelopment
    ? pino({
        level: process.env.LOG_LEVEL || 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    })
    : pino({
        level: process.env.LOG_LEVEL || 'info',
    });
