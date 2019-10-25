import childProcess from 'child_process';
import pino from 'pino';
import stream from 'stream';

// Environment variables
const cwd = process.cwd();
const { env } = process;
const logPath = `${cwd}/logs`;

// Create a stream where the logs will be written
const logThrough = new stream.PassThrough();
let logger = pino({ name: process.env.npm_package_name }, logThrough);

if (process.env.ENV !== 'development') {
  // Log to multiple files using a separate process
  const child = childProcess.spawn(
    process.execPath,
    [
      require.resolve('pino-tee'),
      'info',
      `${logPath}/info.log`,
      'warn',
      `${logPath}/warn.log`,
      'error',
      `${logPath}/error.log`,
      'fatal',
      `${logPath}/fatal.log`,
    ],
    { cwd, env },
  );
  logThrough.pipe(child.stdin);
} else {
  logger = pino({
    prettyPrint: { colorize: true },
  });
  logThrough.pipe(process.stdout);
}

export default logger;
