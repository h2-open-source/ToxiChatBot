# ToxiChatBot

A Telegram bot written in TypeScript.

## To Start:

### Get some Node

```
nvm install node
```

### Get Yarn:

```
npm install --global yarn
```

### Install packages:

```
yarn
```

### Install and start Mongo

or otherwise obtain accesss to a MongoDB instance.

### Create a filed named `.env` in the root directory

```
# optional
# BOT_URL=

BOT_TOKEN=
BOT_NAME=
BOT_USERNAME= # No '@' in BOT_USERNAME

MONGO_SERVER= # Probably 127.0.0.1 if you're running locally
MONGO_DATABASE=
MONGO_USER=
MONGO_PASSWORD=

PERSPECTIVE_API_TOKEN=
```

Enter all the information for your setup. Use [@BotFather](https://t.me/botfather) to create a bot and get your bot token.

To get your Perspective API token, follow the [getting started guide](https://developers.perspectiveapi.com/s/docs-get-started), and then follow the "Enable the API" section.

### Go:

```
yarn start
```

This will start a watcher that will compile the code, then run a script that creates an ngrok tunnel and starts up the dev server behind it. When the server starts, it automatically updates the Telegram webhook to point at your ngrok tunnel. If you get the console message "MongoDB connection successful..." you're up and running!

### Configure your editor to use Prettier and ESLint

Do everything they say. If you can, set it up to automatically apply fixes on save. At the very least run the `yarn lint` command and fix the warnings and errors before you push anything up.
