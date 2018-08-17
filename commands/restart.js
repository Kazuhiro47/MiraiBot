const bot_data = require('../bot_data.js');
const ReactionHandler = require("../functions/reactionHandler").ReactionHandler;

let askIfChangesHasBeenSaved = (client, channelId) => new Promise((resolve, reject) => {

    let channel = client.channels.get(channelId);
    let reactionHandler;
    let askingMessage;

    if (channel) {
        channel.send("Veuillez sauvegarder vos changements avant le redémarrage du bot.").then((msg) => {

            askingMessage = msg;
            reactionHandler = new ReactionHandler(askingMessage, ["✅"]);

            return reactionHandler.addReactions();

        }).then(() => {

            reactionHandler.initCollector((reaction) => {
                if (reaction.count === 2 && reaction.emoji.name === "✅") {
                    reactionHandler.collector.stop();
                }
            }, () => {
                askingMessage.delete().catch(console.error);
                return resolve(true);
            })

        }).catch(err => reject(err));

    } else {
        reject(false);
    }
});

let restartBot = (message) => {
    const {exec} = require('child_process');
    exec('pm2 restart mirai_bot', (err, stdout, stderr) => {
        if (err) {
            console.log("Couldn't reboot bot");
            message.channel.send("Le reboot a échoué.").catch(console.error);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
};

exports.run = (client, message) => {

    if (bot_data.bot_values.bot_owners.includes(message.author.id)) {

        let gSettings = client.gSettings.get(message.guild.id);
        if (gSettings) {

            let promises = [];

            gSettings.sdse2.forEach(channelId => {
                promises.push(askIfChangesHasBeenSaved(client, channelId));
            });

            gSettings.sdse2 = [];
            client.gSettings.set(message.guild.id, gSettings);

            Promise.all(promises).then(() => {
                restartBot(message);
            }).catch(console.error);

        } else {
            restartBot(message);
        }

    } else {
        message.channel.send(`Tu n'as pas la permission, ${message.author.username}`).catch(console.error);
    }

};