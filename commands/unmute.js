const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");
const find_user = require("../functions/find_user.js").find_user;

let unmute = (client, message, args) => new Promise((resolve, reject) => {
    let moderatorUser = message.member;

    if (!moderatorUser) {
        return;
    }

    if (moderatorUser.hasPermission('BAN_MEMBERS') || moderatorUser.hasPermission('ADMINISTRATOR')) {

        let name = args.join(' ');
        let target = find_user(client, name);

        if (!target) {
            message.channel.send(new RichEmbed()
                .setColor(bot_data.bot_values.bot_color)
                .setTitle("Erreur commande mute")
                .addField("Utilisation", "/mute {pseudo}")
            ).catch(console.error);
            return;
        }

        let promises = [];

        message.guild.channels.array().forEach(channel => {

            if (channel.type === "text") {
                channel.permissionOverwrites.array().forEach(p => {
                    if (p.id === target.id) {
                        promises.push(p.delete());
                    }
                });
            }

        });

        Promise.all(promises).then(() => {
            message.channel.send(new RichEmbed()
                .setColor(target.displayColor)
                .setAuthor(target.displayName, target.user.avatarURL)
                .setDescription("Unmuted")
            ).catch(console.error);
            resolve(true);
        }).catch(err => reject(err));

    } else {
        message.channel.send("Tu ne possèdes pas le pouvoir.").catch(console.error);
    }
});

module.exports = {unmute};

exports.run = (client, message, args) => {

    unmute(client, message, args).catch(console.error);

};