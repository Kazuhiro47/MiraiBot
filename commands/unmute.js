const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");
const Mute = require("../functions/cmds/mute").Mute;
const find_user = require("../functions/find_user.js").find_user;

let unmute = (client, message, args) => new Promise((resolve, reject) => {
    let moderatorUser = message.member;

    if (!moderatorUser) {
        return;
    }

    if (moderatorUser.hasPermission('BAN_MEMBERS') || moderatorUser.hasPermission('ADMINISTRATOR')) {

        let promises = [];
        message.mentions.members.array().forEach(target => {
            promises.push(new Mute(client, message, target).unmute());
        });

        Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));

    } else {
        message.channel.send("Tu ne possèdes pas le pouvoir.").catch(console.error);
    }
});

exports.run = (client, message, args) => {

    unmute(client, message, args).catch(console.error);

};
