const getChannelMessages = require("../analyse_channel.js").getChannelMessages;
const bot_data = require('../../bot_data.js');
const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');
const Discord = require('discord.js');
let client = new Discord.Client();
console.log(process.argv);
const args = [];

// Initialize an instance of Enmap
const userProvider = new EnmapLevel({name: 'memberXP'});
client.memberXP = new Enmap({provider: userProvider});

client.login(bot_data.bot_values.bot_token).catch(err => {
    console.error(err);
    process.exit(0);
});

client.on('disconnect', event => {
    console.error(event);
    process.exit(1);
});

client.on('error', err => {
    console.error(err);
});

client.on("ready", () => {

});
