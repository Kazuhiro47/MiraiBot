const bot_data = require('../bot_data.js');

let rmAll = async (nb_msg, message) => {

    let toDelete;
    let delNb;
    while (nb_msg > 0) {
        delNb = nb_msg % 100;
        toDelete = await message.channel.fetchMessages({limit: delNb});
        await message.channel.bulkDelete(toDelete);
        nb_msg -= delNb;
    }

};

exports.run = (client, message, args) => {

    if (!message.member && message.author.id === bot_data.bot_values.bot_owners[0]) {

        message.delete().then(() => {
            let input = args.join(' ');
            let nb_msg = parseInt(input);
            rmAll(nb_msg, message).catch(console.error);
        });

    } else if (message.member.hasPermission("MANAGE_MESSAGES")) {

        message.delete().then(() => {
            let input = args.join(' ');
            let nb_msg = parseInt(input);
            rmAll(nb_msg, message).catch(console.error);
        });

    } else {
        message.delete().catch(console.error);
        message.author.send("Tu n'as pas la permission de supprimer les messages avec le bot.").catch(console.error);
    }

};