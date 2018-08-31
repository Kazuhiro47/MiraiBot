const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");
const ReactionHandler = require("../functions/reactionHandler").ReactionHandler;
const Mute = require("../functions/cmds/mute").Mute;
const oneHour = 60 * 60000;

let muteTarget = (client, message, target, duration) => new Promise((resolve, reject) => {

    if (!target) {
        message.channel.send(new RichEmbed()
            .setColor(bot_data.bot_values.bot_color)
            .setTitle("Cible introuvable")
        ).then(() => reject("target undefined")).catch(err => reject(err));
        return;
    }

    let muteMember = new Mute(client, message, target, duration);

    let hasBeenMutedLastMonth = false;
    muteMember.userData.mutes.forEach(element => {
        let days = (Date.now() - element) / 1000 / 60 / 60 / 24;

        if (days < 30) {
            hasBeenMutedLastMonth = true;
        }
    });

    if (hasBeenMutedLastMonth && duration < 24) {
        message.channel.send(`${target.displayName} a été sanctionné au cours de ce mois. Augmenter la peine pour un mute de 24h ?`).then((msg) => {

            let reactHandler = new ReactionHandler(msg, ["✅", "❎"]);

            reactHandler.addReactions().then(() => {

                reactHandler.initCollector((reaction) => {

                    if (reaction.count > 1 && reaction.users.last().id === message.author.id) {

                        if (reaction.emoji.name === "✅") {
                            duration = 24;
                            reactHandler.stop();
                        } else if (reaction.emoji.name === "❎") {
                            reactHandler.stop();
                        }

                    }
                }, () => {
                    muteMember.mute().then(() => resolve(true)).catch(err => reject(err));
                })

            }).catch(err => reject(err));

        }).catch(err => reject(err));
    } else {
        muteMember.mute().then(() => resolve(true)).catch(err => reject(err));
    }

});

let mute = (client, message, args) => new Promise((resolve, reject) => {
    let moderatorUser = message.member;

    if (!moderatorUser) {
        return;
    }

    if (moderatorUser.hasPermission('BAN_MEMBERS') || moderatorUser.hasPermission('ADMINISTRATOR')) {

        let duration = parseFloat(args.shift());
        console.log(duration);

        if (isNaN(duration)) {
            message.channel.send(new RichEmbed()
                .setColor(bot_data.bot_values.bot_color)
                .addField(
                    "Durée incorrecte ou non spécifiée",
                    "/mute <durée en heure> <pseudo>"
                )
            ).catch(console.error);
            return;
        } else {
            duration = oneHour * duration;
        }

        let promises = [];

        message.mentions.members.array().forEach(target => {
            promises.push(muteTarget(client, message, target, duration));
        });

        Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));

    } else {
        message.channel.send("Tu ne possèdes pas le pouvoir.").catch(console.error);
    }
});

exports.run = (client, message, args) => {

    mute(client, message, args).catch(console.error);

};
