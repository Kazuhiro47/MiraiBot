const Menu = require("./menu").Menu;
const bot_data = require("../bot_data.js");
const RichEmbed = require("discord.js").RichEmbed;

class JishoSentence {

    constructor(sentence, jisho) {
        this.sentence = sentence;
        this.jisho = jisho;

        this.errorEncountered = false;
        this.data = [];

        this.maxFields = 25;

        return this;
    }

    async query() {

        let query = await this.jisho.searchForPhrase(this.sentence);

        while (this.sentence.length > 0 && this.errorEncountered === false) {
            this.data.push(this.retrieveData(query.data));
            query = await this.jisho.searchForPhrase(this.sentence);
        }

        return this.data;

    }

    retrieveData(data) {

        let result;
        for (let i = 0; i < data.length; i++) {
            result = data[i];

            if (result.japanese) {

                let japanese;
                for (let j = 0; j < result.japanese.length; j++) {
                    japanese = result.japanese[j];

                    if (japanese.word && this.sentence.indexOf(japanese.word) !== -1) {

                        this.sentence = this.sentence.slice(this.sentence.indexOf(japanese.word) + japanese.word.length);
                        return data.slice(0, this.maxFields);

                    } else if (japanese.reading && this.sentence.indexOf(japanese.reading) !== -1) {

                        this.sentence = this.sentence.slice(this.sentence.indexOf(japanese.reading) + japanese.reading.length);
                        return data.slice(0, this.maxFields);

                    }

                }

            }

        }

        this.errorEncountered = true;
        return null;

    }

}

let jishoQueryMenu = (client, message, sentence, jisho) => new Promise((resolve, reject) => {
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
                        sense += `${english_definition} / `;
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
                Promise.all([
                    msg.delete().catch(console.error),
                    message.delete().catch(console.error)
                ]).then(() => resolve(true)).catch(err => reject(err));
            });

        }).catch(() => {
            message.channel.stopTyping(true);
            message.delete().catch(console.error);
        });

    }).catch(err => {
        message.channel.stopTyping(true);
        reject(err);
    });
});

module.exports = {jishoQueryMenu, JishoSentence};
