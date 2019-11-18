const bot_data = require("../bot_data");
const RichEmbed = require('discord.js').RichEmbed;

exports.run = async (client, message, args) => {

    console.log("showxpupdate");
    if (message.member && message.member.hasPermission("BAN_MEMBERS")) {

        let msg = new RichEmbed().setColor(bot_data.bot_values.bot_color).setTitle("UpdateXpStat");

        let string = '';

        message.guild.channels.array().forEach(async channel => {

            let channelSettings = client.gSettings.get(channel.id);

            if (channelSettings) {
                let m = await channel.fetchMessage(channelSettings.lastId);

                string += `${channel.name} | ${m.author.username} : ${m.createdAt.toString()}\n`;

            } else {
                string += `${channel.name} | nothing\n`;
            }

        });

        msg.setDescription(string);

        await message.channel.send(msg);

    } else {
        message.reply("Vous n'avez pas la permission").catch(console.error);
    }

};
