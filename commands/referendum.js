const Referendum = require("../functions/cmds/referendum").Referendum;
const RichEmbed = require("discord.js").RichEmbed;

exports.run = (client, message, args) => {

    if (message.member) {

        if (message.member.hasPermission("BAN_MEMBERS")) {

            if (args.length === 0) {
                message.channel.send(new RichEmbed()
                    .setTitle("Aucune question n'a été spécifiée en argument")
                    .addField("Guide commande Referendum", "/referendum <question>")
                ).catch(console.error);
            } else {

                const question = args.join(' ');

                if (question.startsWith("Souhaitez-vous")) {

                    let referendum = new Referendum(question, client, message.member, 60000 * 60 * 48);

                    if (!referendum.channelExists()) {
                        message.channel.send("Erreur : le salon de publication pour le référendum n'existe pas").catch(console.error);
                        return;
                    }

                    referendum.post().catch(console.error);

                } else {
                    message.channel.send("Erreur : La question du référendum ne commence pas par \"Souhaitez-vous\"").catch(console.error);
                }

            }

        } else {
            message.channel.send("Tu n'as pas la permission de lancer un référendum.").catch(console.error);
        }

    } else {
        message.channel.send("Commande non utilisable en mp").catch(console.error);
    }

};
