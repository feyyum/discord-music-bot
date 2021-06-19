# Feyyum's Bot
## _Qualified Discord Music Bot_

Feyyum's Discord Music Bot is simple discord music bot. It fetches video link from youtube and stream in voice channel. You can easily use this bot.

- Pull my repository
- Create discord bot from [Discord Developer Portal](https://discord.com/developers/applications) and paste Bot Token to config.json.
- Create google developer account, create Google API and enable Youtube Data API from [Google Cloud Console](https://console.cloud.google.com/). And paste API Key to server.js.
- ✨ Run the Bot

## Features

- Playing music from YouTube videos.
- Pause and resume  functionality.
- Never sleeps.

> The bot uses Node@14.16.1. If you have higher version, you have to decrease your
> version. Because ".pause()" working 14.16.1 version of Node.js.


And of course Discord Music Bot itself is open source project on GitHub.

## Installation

Discord Music Bot requires [Node.js](https://nodejs.org/) v10 < version <= v14.16.1 to run.

Install the dependencies and devDependencies and start the server.

```sh
cd discord-music-bot
npm i
npm run start
```
or
```sh
cd discord-music-bot
npm i
npm run dev
```
## After Deployement

You can use [PM2](https://pm2.keymetrics.io/) for production process management.

## License

MIT

**This Bot started development with 💖 by Feyyaz for my best friends. So thank you all.**
