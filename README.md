# ToxiChatBot

A Telegram bot written in JavaScript.

## To Start:
Get some Node
```
nvm install node
```

Get Yarn:
```
npm install --global yarn
```

Install:
```
yarn
```

Set up an environment file called `.env.local` with the appropriate values:
```
# optional
# BOT_URL=
BOT_TOKEN=
BOT_NAME=
BOT_USERNAME=
MONGO_SERVER=
MONGO_DATABASE=
MONGO_USER=
MONGO_PASSWORD=
```

Go:
```
yarn start
```

This will create an ngrok tunnel, then sart up the dev server behind it.
