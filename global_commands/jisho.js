const bot_data = require("../bot_data.js");
const RichEmbed = require("discord.js").RichEmbed;
const jishoApi = require("unofficial-jisho-api");
const Menu = require("../functions/menu").Menu;
const JishoSentence = require("../functions/jisho").JishoSentence;
const jisho = new jishoApi();

exports.run = (client, message, args) => {

    let sentence = args.join(' ');

    message.channel.startTyping();
    new JishoSentence(sentence, jisho).query().then(data => {

        let menu = new Menu(message.channel, ["⬅", "➡"]);
        let i = 1;
        let total = data.length;

        data.forEach(parts => {

            let embed = new RichEmbed().setColor(bot_data.bot_values.bot_color)
                .setAuthor("Traduction Jisho", client.user.avatarURL)
                .setDescription(sentence);

            if (!parts) return;

            parts = parts.slice(0, 6);

            parts.forEach(meaning => {

                let japanese = '';

                meaning.japanese.forEach(jp => {
                    if (jp.word) japanese += `${jp.word} /`;
                    if (jp.reading) japanese += `${jp.reading} /`;
                });

                if (japanese.length === 0) japanese = "Unknown";

                let sense = '';

                meaning.senses.forEach(s => {

                    s.english_definitions.forEach(english_definition => {
                        sense += `${english_definition}\n`;
                    });

                    sense += '\n';

                });

                embed.addField(japanese, sense, true);

            });

            embed.setFooter(`Page ${i} / ${total}`);
            i += 1;

            menu.addPage(embed);

        });

        menu.printFirstPage().then((msg) => {

            message.channel.stopTyping(true);

            menu.reactionHandler.initCollector((reaction) => {

                if (reaction.count > 1) {

                    if (reaction.emoji.name === "⬅") {
                        reaction.remove(reaction.users.last()).catch(() => true);
                        menu.previousPage().catch(console.error);
                    } else if (reaction.emoji.name === "➡") {
                        reaction.remove(reaction.users.last()).catch(() => true);
                        menu.nextPage().catch(console.error);
                    } else if (reaction.emoji.name === "🔚") {
                        menu.reactionHandler.collector.stop();
                    }

                }

            }, () => {
                msg.delete().catch(console.error);
            });

        }).catch(() => {
            message.channel.stopTyping(true);
            message.delete().catch(console.error);
        });

    }).catch(err => {
        console.error(err);
        message.channel.stopTyping(true);
    });

};
