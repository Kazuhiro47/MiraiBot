const {translate, detectLanguage, wordAlternatives, translateWithAlternatives} = require('deepl-translator');
const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");

exports.run = (client, message, args) => {

    message.channel.startTyping();

    translateWithAlternatives(
        args.join(' '),
        'FR'
    ).then(res => {

        let promises = [];
        let content = '';
        let msg = new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setAuthor("Traduction", client.user.avatarURL);

        let totalLength = 0;
        let descriptionSet = false;

        let fieldIndex = 0;

        res.translationAlternatives.forEach(alternative => {

            if (fieldIndex === 25) return;

            if (!descriptionSet && totalLength + alternative.length > 2048) {
                msg.setDescription(content);
                content = '';
                totalLength = 0;
                descriptionSet = true;
            }

            if (descriptionSet && totalLength + alternative.length > 1024) {
                msg.addField("Traductions supplémentaires", content);
                content = '';
                totalLength = 0;
                fieldIndex += 1;
            }

            content += `- *${alternative}*\n\n`;
            totalLength += alternative.length;

        });

        if (!descriptionSet) msg.setDescription(content);

        promises.push(message.channel.send(msg));

        Promise.all(promises).then(() => {
            message.channel.stopTyping(true);
        }).catch(err => {
            console.error(err);
            message.channel.stopTyping(true);
        });

    }).catch(err => {
        console.error(err);
        message.channel.send("Une erreur s'est produite. Veuillez réessayer.").catch(console.error);
        message.channel.stopTyping(true);
    });

};
