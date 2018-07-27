let bot_data = require("../bot_data.js").bot_values;
let RichEmbed = require("discord.js").RichEmbed;

exports.run = (client, message) => {

    console.log('Launching ping command.');
    message.channel.send(new RichEmbed().setColor(bot_data.bot_color)
        .addField("Pong !", `:ping_pong: ${Math.round(client.ping)}ms`)
    ).catch(console.error);

};