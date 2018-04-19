const Discord = require('discord.js');

exports.run = (client, message) => {

    let message_w_tag = message.content.slice('spoil '.length, message.content.length).trim();

    if (message_w_tag.length === 0) {

        message.channel.send("Message vide.\n\nExemple d'utilisation :\n/spoil <spoil>Kazuhiro</spoil> est <spoil>l'instigateur</spoil>.").then(msg => {
            message.delete().catch((onrejected) => {
                console.error(onrejected);
            });
        }).catch(console.error);
        return;
    }

    let spoil_tag = "<spoil>";
    let spoil_end_tag = "</spoil>";

    class Spoiler {

        constructor(message_w_tag) {
            this.msg_w_tag = message_w_tag;
            this.msg = message_w_tag;
            this.tags_index = [];
            this.remove_tags();
        }

        is_incorrect() {

            let checker = this.find_one_tag(0);
            if (checker === -42)
                return true;
            while (checker !== -42) {

                if (checker === -1)
                    return true;
                checker = this.find_one_tag(checker);

            }

            return false;

        }

        find_one_tag(index) {

            let begin = this.msg_w_tag.indexOf(spoil_tag, index);

            let end = this.msg_w_tag.indexOf(spoil_end_tag, index);

            // No more tag has been found, returning -42 to notify end of parsing
            if (begin === -1 && end === -1)
                return -42;

            // If one of the tag has not been found, error.
            if (begin === -1 || end === -1)
                return -1;

            // if there is 2 begin tag in a row without a end tag in between, error.
            let second_begin = this.msg_w_tag.indexOf(spoil_tag, begin + spoil_tag.length);
            if (second_begin !== -1 && second_begin < end)
                return -1;

            this.tags_index.push([begin + spoil_tag.length, end]);

            return (end + spoil_end_tag.length);

        }

        remove_tags() {
            this.msg = this.msg_w_tag.replace(spoil_tag, '').replace(spoil_end_tag, '');
            while (this.msg.includes(spoil_tag) && this.msg.includes(spoil_end_tag)) {
                this.msg = this.msg.replace(spoil_tag, '').replace(spoil_end_tag, '');
            }
        }

        silence_sentence() {

            let begin;
            let end;
            let spoiler;
            let spoiler_replacement;
            let msg_with_tags = this.msg_w_tag;
            this.tags_index.forEach(spoiler_tag => {

                begin = spoiler_tag[0];
                end = spoiler_tag[1];
                spoiler = spoil_tag + msg_with_tags.substring(begin, end) + spoil_end_tag;
                spoiler_replacement = [];
                for (let i = 0 ; i < end - begin ; i++) {
                    if (msg_with_tags[i + begin] === ' ') {
                        spoiler_replacement.push(' ');
                    } else {
                        spoiler_replacement.push('\\*');
                    }
                }
                spoiler_replacement = spoiler_replacement.join('');

                this.msg_w_tag = this.msg_w_tag.replace(spoiler, spoiler_replacement);

            });

        }

    }

    let spoiler_message = new Spoiler(message_w_tag);

    if (spoiler_message.is_incorrect()) {
        message.author.send(`Il n'y a pas de tag <spoil> ou de tag </spoil>, ou ils ne sont pas disposés correctement.\n\n` +
                            `Exemple d'utilisation :\n/spoil <spoil>Kazuhiro</spoil> est <spoil>l'instigateur</spoil>.\n\nVotre message :\n\n${message.content}`)
            .then(console.log("Tag parsing failed.")).catch(console.error);

    } else {

        console.log('Tag parsing succeed.');

        spoiler_message.silence_sentence();

        let date = new Date();
        let msg = new Discord.RichEmbed();

        msg.setAuthor(message.author.username, message.author.avatarURL);
        msg.addField("Message spoil (ajoutez une réaction pour voir le message)", spoiler_message.msg_w_tag);
        if (message.member)
            msg.setColor(message.member.displayColor);
        msg.setFooter(`Le message sera scellé le ${date.getUTCDate() + 1}/${date.getUTCMonth() + 1} à ${date.getUTCHours() + 2}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s`);
        message.channel.send(msg).then((msg) => {

            const collector = msg.createReactionCollector(
                () => {return true},
                { time: 60000 * 60 * 24 }
            );

            collector.on("collect", reaction => {
                reaction.users.last().send(spoiler_message.msg).catch((onrejected) => {
                    console.error(onrejected);
                    message.channel.send(`Le message n'a pas pu être envoyé à ${reaction.users.last().username}`).catch(console.error);
                });
            });

            collector.on("end", collected => {
                console.log(collected);
            })

        }).catch(console.error);

    }

    message.delete().catch((onrejected) => {
        console.error(onrejected);
    });

};