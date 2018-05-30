const bot_data = require('../bot_data.js');

exports.run = (client, message, args) => {

    if (message.author.id === bot_data.bot_values.bot_owners[0]) {
        message.delete().then(() => {

            let input = args.join(' ');
            let nb_msg = parseInt(input);

            message.channel.fetchMessages({limit: nb_msg}).then(msgs => {
                message.channel.bulkDelete(msgs).catch(console.error);
            }).catch(console.error);

        });
    } else {
        message.delete().catch(console.error);
        message.author.send("Tu n'as pas la permission de supprimer les messages avec le bot.").catch(console.error);
    }

};