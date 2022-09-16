# ToxiChatBot

A Telegram bot written in TypeScript to make moderation of large groups simpler. It implements calls to the [Perspective API](https://www.perspectiveapi.com/) to monitor toxicity of the chat.

## Requirements
* [NVM](https://github.com/nvm-sh/nvm) (Recommended)
* [Node](https://nodejs.org/)
* [Yarn](https://yarnpkg.com)
* [MongoDB](https://www.mongodb.com/)

## Before starting

Create a filed named `.env` in the root directory. `.env.example` has default MongoDB credentials provided for use with docker.

```
BOT_TOKEN=
BOT_NAME=
BOT_USERNAME= # No '@' in BOT_USERNAME
PERSPECTIVE_API_TOKEN=

MONGO_SERVER=
MONGO_DATABASE=
MONGO_USER=
MONGO_PASSWORD=

# optional (use with production)
BOT_URL=
```

Use [@BotFather](https://t.me/botfather) to create a Telegram bot and get your bot token.

To get your Perspective API token, follow the [getting started guide](https://developers.perspectiveapi.com/s/docs-get-started), and then follow the "Enable the API" section.

## Start with Docker
To simplify getting started with this bot, a `docker-compose.yml` file has been included. Ensure you have installed [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/). Once installed, run `yarn start:docker` to start the environment. The containers will do a few things:
1. Download and install images for Node 16, MongoDB, and Mongo Express (web interface for managing MongoDB)
2. Install required JavaScript dependencies
3. Setup [ngrok](https://ngrok.com/) tunnel
4. Set the webhook of your bot to the ngrok tunnel.
5. Start [nodemon](https://nodemon.io/) to watch TypeScript files, build on save, and restart the application.

Once the containers have started, your bot will be running ToxiChatBot. Changes you make will be automatically applied.

To access Mongo Express, navigate to [http://127.0.0.1:8081](http://127.0.0.1:8081) in your web browser.

To run commands within the container, for instance; to install new packages try `docker-compose exec node sh -c "yarn add <NEW_PACKAGE_NAME>"`. This tells docker-compose to execute a command within the 'node' container, that the command should be to open a shell, and that the shell should then install a new package with yarn.

If you're getting errors running Docker, ensure the Docker process is running with `systemctl start docker` and add yourself to the `docker` group by following these steps as detailed [here](https://stackoverflow.com/a/55255557):

```
groupadd docker
usermod -aG docker $USER
newgrp - docker
yarn start:docker
```

## Start Locally:
Get Node via NVM

```
nvm install node
```
Install Yarn

```
npm install --global yarn
```

Install dependencies

```
yarn
```
Run the application

```
yarn start:local
```

This will start a watcher that will compile the code, then run a script that creates an ngrok tunnel and starts up the dev server behind it. When the server starts, it automatically updates the Telegram webhook to point at your ngrok tunnel. If you get the console message "MongoDB connection successful..." you're up and running!

## Tests
We use [Jest](https://jestjs.io/docs/getting-started) for testing. To run the tests locally, run `npm test`. To run tests inside your docker environment, run `npm run test:docker`/`yarn test:docker`. This will run the tests inside of the running Docker containers. If you don't have NPM installed locally, you can run `docker-compose exec node sh -c "yarn test"` instead.

### Configure your editor to use Prettier and ESLint

Do everything they say. If you can, set it up to automatically apply fixes on save. At the very least run the `yarn lint` command and fix the warnings and errors before you push anything up.
