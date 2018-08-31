const bot_data = require("../bot_data.js");
const RichEmbed = require("discord.js").RichEmbed;

let showWarnTarget = (client, message, target) => new Promise((resolve, reject) => {

    let data = client.moderationData.get(target.id);

    if (!data) {
        data = bot_data.moderationData;
        client.moderationData.set(target.id, data);
    }

    message.channel.send(new RichEmbed()
        .setColor(bot_data.bot_values.bot_color)
        .setAuthor(target.displayName, target.user.avatarURL)
        .setDescription(`Possède ${data.warnings} avertissement(s)`)
    ).then(() => resolve(true)).catch(err => reject(err));

});

exports.run = (client, message) => {

    let moderatorUser = message.member;

    if (!moderatorUser) {
        return;
    }

    if (moderatorUser.hasPermission('BAN_MEMBERS') || moderatorUser.hasPermission('ADMINISTRATOR')) {

        message.mentions.members.array().forEach(user => {
            showWarnTarget(client, message, user).catch(console.error);
        });

    }

};
