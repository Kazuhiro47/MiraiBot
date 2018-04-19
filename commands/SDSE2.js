const lg_var = require("../bot_data");
let RichEmbed = require("discord.js").RichEmbed;

exports.run = (client, message) => {

    const command = message.content.slice('SDSE2 '.length, message.content.length).trim().split(/ +/g);

    if (command[0] === 'dr2') {

        if (command.length === 0) {
            message.channel.send(new RichEmbed().setColor(lg_var.bot_values.bot_color))
        }

    }

};