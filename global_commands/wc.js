const RichEmbed = require('discord.js').RichEmbed;
const botColor = require('../bot_data').bot_values.bot_color;

exports.run = (client, message, args) => {

    let sentence = args.join(' ');

    message.channel.send(new RichEmbed()
        .addField('Phrase', sentence)
        .addField('Nombre de mots', `${args.length}`, true)
        .addField('Nombre de lettres', `${sentence.replace(/\s+/g, '').length}`, true)
        .setColor(botColor)
    ).catch(console.error);

};
