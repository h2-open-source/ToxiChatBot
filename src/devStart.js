import nodemon from 'nodemon';
import ngrok from 'ngrok';
import { logMessage } from './utils/log';

const port = process.env.PORT || 3000;

ngrok.connect({ port: port })
    .then((url) =>
        nodemon({
            script: `./src/index.js`,
            args: [url],
            ext: 'js'
        })
        .on('start', async () => {
            logMessage(`Server now available at ${url}`)
        })
        .on('quit', async () => {
            await ngrok.kill()
        })
    )
    .catch(async () => await ngrok.kill());
