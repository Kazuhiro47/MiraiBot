/*
** Created by sam44 for Js_Mirai_Bot
** 30/12/2017
*/

const Discord = require('discord.js');

exports.run = (client, message) => {

    console.log('Launching best_op command');

    let fate_opening = new Discord.RichEmbed();
    let danganronpa_op = new Discord.RichEmbed();

    fate_opening.setTitle("Fate Zero Opening 2");
    fate_opening.setColor(message.guild.me.displayColor);
    fate_opening.setThumbnail("https://www.youtube.com/watch?v=eQDK1qhzf6o");

    danganronpa_op.setTitle("Danganronpa 3 Zetsubou hen opening");
    danganronpa_op.setColor(message.guild.me.displayColor);
    danganronpa_op.setThumbnail("https://youtu.be/qwNrL1NSfxY");

    message.channel.send(fate_opening);
    message.channel.send(danganronpa_op);

};