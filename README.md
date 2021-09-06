# ToxiChatBot

A Telegram bot written in JavaScript.

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

### Install and start Mongo, or otherwise obtain accesss to a MongoDB instance.

### Set up an environment file called `.env.local` with the appropriate values:
```
# optional
# BOT_URL=

BOT_TOKEN=
BOT_NAME=
# No '@' in BOT_USERNAME
BOT_USERNAME=

MONGO_SERVER=
MONGO_DATABASE=
MONGO_USER=
MONGO_PASSWORD=
```

### Go:
```
yarn start
```

This will create an ngrok tunnel, then start up the dev server behind it and automatically update the Telegram webhook to point at your tunnel.

