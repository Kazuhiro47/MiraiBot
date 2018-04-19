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
    }

};