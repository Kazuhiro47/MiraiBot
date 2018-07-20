const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");

exports.run = (client, message) => {

    let result = {
        1: "Pile !",
        2: "Face !"
    };
    let coin = Math.floor(Math.random() * 2 + 1);

    message.channel.send(new RichEmbed()
        .setColor(bot_data.bot_values.bot_color)
        .setTitle("Pile ou Face")
        .setDescription(`${result[coin]}`)
    ).catch(console.error);

};