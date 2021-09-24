import * as ngrok from 'ngrok';
import * as childProcess from 'child_process';
import { logMessage, logError } from './utils/log';

const port = process.env.PORT || 3000;

ngrok
  .connect({ port })
  .then((url) => {
    const process = childProcess.fork('./src/index.ts', [url]);

    process.on('error', (err) => {
      logError(err);
      ngrok.kill();
    });

    process.on('exit', (code) => {
      ngrok.kill();
    });

    logMessage(`Server starting at ${url}`);
  })
  .catch(async () => ngrok.kill());
