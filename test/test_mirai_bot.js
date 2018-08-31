const Discord = require('discord.js');
const bot_data = require('../bot_data.js');
const client = new Discord.Client();

const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');
const check_xp = require("../functions/parsing_functions").check_xp;

const gSettings = new EnmapLevel({name: "gSettings"});
client.gSettings = new Enmap({provider: gSettings});

const LG = new EnmapLevel({name: "LG"});
client.LG = new Enmap({provider: LG});

const listencmd = true;

client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Mirai_Bot Test connected");

}).catch(console.error);

client.on("message", (message) => {

    if (listencmd && !message.author.bot && message.content.startsWith("/test")) {

        const args = message.content.slice(1).trim().split(/ +/g);
        args.shift();

        let commandFile = require(`../global_commands/translate.js`);

        commandFile.run(client, message, args);
    }

});
