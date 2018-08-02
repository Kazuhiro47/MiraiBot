const check_bad_words = require("../functions/parsing_functions").check_bad_words;
exports.run = (client, oldMessage, newMessage) => {

    if (newMessage.channel.parentID !== "473236555088265266" && newMessage.author.id !== bot_data.bot_values.bot_id) {

        check_bad_words().then(ctnt => {
            newMessage.delete().then(msg => {

                msg.channel.send(new RichEmbed().setAuthor(msg.member.displayName, msg.author.avatarURL)
                    .setColor(msg.member.displayColor)
                    .setDescription(ctnt)
                ).catch(console.error);

            }).catch(console.error);
        }).catch(() => {
            return;
        });
    }

};