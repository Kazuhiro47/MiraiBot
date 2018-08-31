/*
** Created by Kazuhiro for Js_Mirai_Bot
** 20/08/2018
*/

const RichEmbed = require('discord.js').RichEmbed;
const bot_data = require("../bot_data.js");

exports.run = (client, message) => {

    let uptimeSec = client.uptime / 1000;
    let uptimeMin = uptimeSec / 60;
    let uptimeHours = uptimeMin / 60;
    let uptimeDays = uptimeHours / 24;

    let seconds = uptimeSec.toFixed() % 60;
    let minutes = uptimeMin.toFixed() % 60;
    let hours = uptimeHours.toFixed() % 24;
    let days = uptimeDays.toFixed();

    let dateString = `${seconds}s`;

    if (minutes > 0) dateString = `${minutes}m${dateString}`;
    if (hours > 0) dateString = `${hours}h${dateString}`;
    if (days > 0) dateString = `${days}j${dateString}`;

    message.channel.send(new RichEmbed().setColor(bot_data.bot_values.bot_color)
        .setAuthor("Mirai Bot", client.user.avatarURL)
        .setURL(bot_data.bot_values.invitation_link)
        .setTitle("Lien pour ajouter le bot à son serveur")
        .setThumbnail(client.user.avatarURL)
        .addField("Nombre de serveurs", client.guilds.size, true)
        .addField("Nombre d'utilisateurs", client.users.size, true)
        .addField("Dernier reboot", `${client.readyAt.toUTCString()}`, true)
        .addField("Temps actif", `${dateString}`, true)
        .setFooter(`Développé par Kazuhiro#1248`, client.user.avatarURL)
    ).catch(console.error);

};

/*
name: "Nombre de serveurs :",
        value: client.guilds.size
      },
      {
        name: "Nombre d'utilisateurs :",
        value: client.channels.size
      }
 */
