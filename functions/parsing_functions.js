const bot_data = require("../bot_data");
const RichEmbed = require("discord.js").RichEmbed;

class MemberUserXP {
    constructor(id) {
        this.id = id;
        this.multiplicateur = 1;
        this.xp = 0;
        this.level = 0;
    }

}

module.exports = {

    MemberUserXP,

    check_message: function (message) {

        function isUpperCase(str) {
            return str === str.toUpperCase();
        }

        /*if (isUpperCase(message.content)) {
            message.channel.send('Pas besoin de crier, ' + message.member.displayName).catch(console.error);
        }*/

        if (message.author.id !== bot_data.bot_values.bot_id) {
            if (message.content.includes('<spoil>') || message.content.includes('</spoil>')) {

                if (!message.content.startsWith(bot_data.bot_values.bot_prefix)) {
                    message.author.send(`Utilise la commande **/spoil** pour utiliser les balises **<spoil>** et **</spoil>**.\n` +
                        `\nVoici ton message qui a été supprimé, au cas où tu voudrais ne pas le perdre :\n` +
                        `\n${message.content}`).catch(console.error);
                    message.delete().catch(console.error);
                }

            }
        }

        /*if (message.author.id !== bot_data.bot_values.bot_id) {

            let check_bad_words = () => new Promise((resolve, reject) => {

                let ctnt = message.content.toLowerCase().trim();

                while (ctnt.indexOf('*') !== -1) {
                    ctnt = ctnt.replace('*', '');
                }

                const short_bad_words = ['tg', 'pd'];

                let lol = false;

                short_bad_words.forEach(shortBadWord => {
                    if (ctnt.endsWith(" " + shortBadWord) || ctnt.startsWith(shortBadWord + " ")) {

                        ctnt = ctnt.replace(shortBadWord, '||');
                        lol = true;
                    }
                });

                if (lol) {
                    message.delete().then(msg => {

                        msg.channel.send(new RichEmbed().setAuthor(msg.member.displayName, msg.author.avatarURL)
                            .setDescription(ctnt)
                        ).catch(console.error);

                    }).catch(console.error);
                }

                if (ctnt === "tg" || ctnt === 'pd') {
                    message.delete().then(msg => {

                        msg.channel.send(new RichEmbed().setAuthor(msg.member.displayName, msg.author.avatarURL)
                            .setDescription("||")
                        ).catch(console.error);

                    }).catch(console.error);
                    return reject(true);
                }

                const bad_words = ["ta gueule", "salope", "pute", " tg "];

                let yes = false;

                bad_words.forEach(bad_word => {
                    if (message.content.includes(bad_word)) {
                        ctnt = ctnt.replace(bad_word, '|||||||');
                        yes = true;
                    }
                });

                if (yes) {
                    resolve(ctnt);
                } else {
                    reject(true);
                }

            });

            check_bad_words().then(ctnt => {
                message.delete().then(msg => {

                    msg.channel.send(new RichEmbed().setAuthor(msg.member.displayName, msg.author.avatarURL)
                        .setColor(msg.member.displayColor)
                        .setDescription(ctnt)
                    ).catch(console.error);

                }).catch(console.error);
            }).catch(() => {
                return;
            })
        }*/

    },

    check_xp: (client, message) => {

        if (message.author.id !== bot_data.bot_values.bot_id) {
            let memberXPData = client.memberXP.get(message.author.id);

            if (!memberXPData) {
                client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                memberXPData = client.memberXP.get(message.author.id);
            }

            if (message.member.roles.find('name', "Robot Ultime")) {
                memberXPData.xp = 0;
                client.memberXP.set(message.author.id, memberXPData);
                return;
            }


            let palier_reached = memberXPData.level;

            memberXPData.xp += message.content.length / 10;

            Object.keys(bot_data.xp_table).forEach(palier => {

                if (memberXPData.xp > bot_data.xp_table[palier].xp)
                    palier_reached = palier;

            });

            if (palier_reached > memberXPData.level) {
                memberXPData.level += 1;

                message.channel.send(new RichEmbed()
                    .addField(
                        `**${message.member.displayName}** est passé à la **Division ${bot_data.xp_table[memberXPData.level].string}**`,
                        `*${bot_data.xp_table[memberXPData.level].description}*`)
                    .setColor(message.guild.me.displayColor)
                ).catch(console.error);

                message.guild.roles.array().forEach(role => {

                    if (role.name.split(' ')[1] === bot_data.xp_table[memberXPData.level].string) {
                        if (message.member) {
                            message.member.addRole(role).catch(err => {
                                console.error(err);
                                message.channel.send("Impossible d'ajouter le rôle correspondant.").catch(console.error);
                            });
                        } else {
                            message.channel.send("Impossible d'ajouter le rôle correspondant.").catch(console.error);
                        }
                    }

                });

            }

            client.memberXP.set(message.author.id, memberXPData);
        } else {
            let memberXPData = client.memberXP.get(message.author.id);

            if (!memberXPData) {
                client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                memberXPData = client.memberXP.get(message.author.id);
            }

            memberXPData.xp = 0;
            client.memberXP.set(message.author.id, memberXPData);
        }

    },

    get_random_index: function (array) {
        if (array.length === 1) return (0);
        return (Math.floor(Math.random() * array.length));
    },

    get_random_in_array: (array) => {
        if (array.length === 1) return (array[0]);
        return (array[Math.floor(Math.random() * array.length)]);
    }

};