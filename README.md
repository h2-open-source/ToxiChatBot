# ToxiChatBot

A Telegram bot written in TypeScript to make moderation of large groups simpler. It implements calls to the [Perspective API](https://www.perspectiveapi.com/) to monitor toxicity of the chat.

## Requirements
* [NVM](https://github.com/nvm-sh/nvm)(Recommended)
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

## Start w/Docker
To simplify getting started with this bot, a `docker-compose.yml` file has been included. Ensure you have installed [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/). Once installed, run `docker-compose up -d` to start the environment. This will do a few things:
1. Download and install images for Node 16, MongoDB, and Mongo Express (web interface for managing MongoDB)
2. Install required JavaScript dependencies
3. Setup [ngrok](https://ngrok.com/) tunnel
4. Set the webhook of your bot to the ngrok tunnel.
5. Start [nodemon](https://nodemon.io/) to watch TypeScript files, build on save, and restart the application.

To access Mongo Express, navigate to [http://127.0.0.1:8081](http://127.0.0.1:8081) in your web browser.


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
yarn start
```

This will start a watcher that will compile the code, then run a script that creates an ngrok tunnel and starts up the dev server behind it. When the server starts, it automatically updates the Telegram webhook to point at your ngrok tunnel. If you get the console message "MongoDB connection successful..." you're up and running!

## Tests
We use [Jest](https://jestjs.io/docs/getting-started) for testing. To run the tests, run `npm run test:docker`/`yarn test:docker`. This will run the tests inside of the running Docker containers. If you don't have NPM installed locally, you can run `docker-compose exec node sh -c "yarn test"` instead.

### Configure your editor to use Prettier and ESLint

Do everything they say. If you can, set it up to automatically apply fixes on save. At the very least run the `yarn lint` command and fix the warnings and errors before you push anything up.
