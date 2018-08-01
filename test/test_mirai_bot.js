const Discord = require('discord.js');
const bot_data = require('../bot_data.js');
const client = new Discord.Client();

const listencmd = true;

client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Mirai_Bot Test connected");


}).catch(console.error);

client.on("message", (message) => {

    if (listencmd && message.author.id !== bot_data.bot_values.bot_id && message.content === "/test") {

        const args = message.content.slice(1).trim().split(/ +/g);

        let commandFile = require(`../commands/SDSE2.js`);

        commandFile.run(client, message, args);
    }

});
