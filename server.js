const Discord = require('discord.js');
const config = require("./config.json");
const ytdl = require('ytdl-core');
const google = require('googleapis');
const youtube = new google.youtube_v3.Youtube({ version: 'v3', auth: "YOUTUBE_API" });

const client = new Discord.Client();

const prefix = "-";

let dispatcher;
let connection;
let url;
let list = [];
let cMusic;
let pStatus = false;

client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity("Hymn For The Weekend", {
        type: "LISTENING",
    });
});

client.on('message', async (message) => {
    
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.guild) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    const endHandler = () => {
        dispatcher.on('finish', () => {
            pStatus = false;
            if (list.length >= 1) {
                cMusic = list.shift();
                dispatcher = connection.play(ytdl(`${cMusic.link}`, { type: 'opus', filter: 'audioonly', highWaterMark: 16 }));
                dispatcher.on('start', () => {
                    message.channel.send({embed: {
                        color: "#00FF00",
                        author: {
                          name: cMusic.author.username,
                          icon_url: cMusic.author.avatarURL()
                        },
                        description: `[${cMusic.name}](${cMusic.link}) is playing.`,
                        timestamp: new Date(),
                        footer: {
                          icon_url: client.user.avatarURL(),
                          text: "Discord Music Bot"
                        }
                      }
                    });
                    pStatus = true;
                });
                endHandler();
            } else if (list.length === 0) {
                message.channel.send({embed: {
                    color: "#D35400",
                    description: `There is anything in queue.`,
                    // timestamp: new Date(),
                    // footer: {
                    //   icon_url: client.user.avatarURL(),
                    //   text: "Discord Music Bot"
                    // }
                  }
                });
            }
        });
    }
    
    if (command === 'help' || command === 'h') {
        message.reply(
            `
            Commands:
            -p or -play
            -pause
            -resume
            -skip
            -queue
            -ty --> For Disconnect.
            `
        );
    }

    if (command === 'p' || command === 'play') {
        mName = args.join(' ');
        if (args.length == 0) {
            message.reply("Invalid playing request.");
        } else {
            if (message.member.voice.channel) {
                connection = await message.member.voice.channel.join();
                connection.voice.setSelfDeaf(true);
                await youtube.search.list({ part: 'snippet', q: `${mName}`, type: "video" }, async function (err, data) { 
                    if (err) { 
                        console.error('Error: ' + err);
                        message.reply('Error: '+ err);
                    }
                    if (data) { 
                        console.log(data.data.items);
                        url = "https://www.youtube.com/watch?v=" + await data.data.items[0].id.videoId;
                        ytVideoName = await data.data.items[0].snippet.title;
                        let mObj = {
                            name: ytVideoName,
                            link: url,
                            author: message.author
                        }
                        await list.push(mObj);
                        message.channel.send({embed: {
                            color: "#3498DB",
                            author: {
                              name: mObj.author.username,
                              icon_url: mObj.author.avatarURL()
                            },
                            description: `Queued ${mObj.name}.`,
                            // timestamp: new Date(),
                            // footer: {
                            //   icon_url: client.user.avatarURL(),
                            //   text: "Discord Music Bot"
                            // }
                          }
                        });
                        if (list.length === 1 && pStatus === false) {
                            cMusic = list.shift();
                            dispatcher = connection.play(ytdl(`${cMusic.link}`, { type: 'opus', filter: 'audioonly', highWaterMark: 50 }));
                            dispatcher.on('start', () => {
                                message.channel.send({embed: {
                                    color: "#00FF00",
                                    author: {
                                      name: cMusic.author.username,
                                      icon_url: cMusic.author.avatarURL()
                                    },
                                    // title: `[${cMusic.name}](${cMusic.link}) çalıyorum.`,
                                    // url: "http://google.com",
                                    description: `[${cMusic.name}](${cMusic.link}) is playing.`,
                                    // fields: [{
                                    //     name: "Fields",
                                    //     value: "They can have different fields with small headlines."
                                    //   },
                                    //   {
                                    //     name: "Masked links",
                                    //     value: "You can put [masked links](http://google.com) inside of rich embeds."
                                    //   },
                                    //   {
                                    //     name: "Markdown",
                                    //     value: "You can put all the *usual* **__Markdown__** inside of them."
                                    //   }
                                    // ],
                                    timestamp: new Date(),
                                    footer: {
                                      icon_url: client.user.avatarURL(),
                                      text: "Discord Music Bot"
                                    }
                                  }
                                });
                                pStatus = true;
                            });
                            endHandler();
                        }
                    }
                }).catch((err) => {
                    message.reply('Error: '+err);
                });
            } else {
                message.reply("You have to be in a voice channel.");
            }
        }
    }

    if (command === 'pause') {
        if (message.member.voice.channel) {
            if (pStatus === true) {
                dispatcher.pause();
                pStatus = false;
                message.reply("Paused.");
            } else {
                message.reply("There is anything which playing.");
            }
        } else {
            message.reply("You have to be in a voice channel.");
        }
    }

    if (command === 'resume') {
        if (message.member.voice.channel) {
            if (pStatus === false) {
                dispatcher.resume();
                pStatus = true;
                message.reply("Resuming.");
            } else {
                message.reply("There is an item already played.");
            }
        } else {
            message.reply("You have to be in a voice channel.");
        }
    }

    if (command === 'queue') {
        if (list.length > 0) {
            list.map((e, index) => message.channel.send(`${index+1}- ${e.name}`));
        } else {
            message.reply("There is anything in queue.");
        }
    }

    if (command === 'skip') {
        if (message.member.voice.channel) {
            dispatcher.pause();
            pStatus = false;
            if (list.length >= 1) {
                cMusic = list.shift();
                dispatcher = connection.play(ytdl(`${cMusic.link}`, { type: 'opus', filter: 'audioonly', highWaterMark: 50 }));
                dispatcher.on('start', () => {
                    message.channel.send({embed: {
                        color: "#00FF00",
                        author: {
                          name: cMusic.author.username,
                          icon_url: cMusic.author.avatarURL()
                        },
                        description: `[${cMusic.name}](${cMusic.link}) is playing.`,
                        timestamp: new Date(),
                        footer: {
                          icon_url: client.user.avatarURL(),
                          text: "Discord Music Bot"
                        }
                      }
                    });
                    pStatus = true;
                });
                endHandler();
            } else {
                message.channel.send({embed: {
                    color: "#D35400",
                    description: `There is anything in queue.`,
                    // timestamp: new Date(),
                    // footer: {
                    //   icon_url: client.user.avatarURL(),
                    //   text: "© Beko Bot"
                    // }
                  }
                });
            }
        } else {
            message.reply("You have to be in a voice channel.");
        }
    }

    if (command === 'ty') {
        if (message.member.voice.channel) {
            pStatus = false;
            message.reply("Bye!");
            connection.disconnect();
        } else {
            message.reply("You have to be in a voice channel.");
        }
    }
});

client.login(config.BOT_TOKEN);
