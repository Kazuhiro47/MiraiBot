const bot_data = require("../bot_data");
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;
const RichEmbed = require("discord.js").RichEmbed;

exports.run = (client, message, args) => {

    if (!bot_data.bot_values.bot_owners.includes(message.author.id)) {
        message.channel.send("Tu n'as pas la permission.").catch(console.error);
        return;
    }

    function analyse_channel(chan, args) {

        return new Promise((resolve, reject) => {

            let msg_collected = 42;

            try {
                chan.fetchMessages({limit:1}).catch(console.error);
            } catch (e) {
                console.error(`${chan.type}, ${chan.id}`);
                resolve(true);
            }
            chan.fetchMessages({limit: 1}).then(messages => {
                let message_id = messages.first().id;

                let count = 0;

                function retrieve_message(id) {

                    chan.fetchMessages({
                        limit: 100,
                        before: id
                    }).then(messages => {

                        if (messages.array().length === 0) {
                            console.log(`${chan.name} analysed`);
                            return resolve(chan);
                        }
                        if (!messages.last()) {
                            console.error(messages.length);
                            console.error("COLLECTION = " + messages);
                        }
                        message_id = messages.last().id;
                        messages.array().forEach(function (msg_obj) {

                            if (!msg_obj.member) {
                                return;
                            }

                            if (args.length !== 0) {

                                let members = message.guild.members.keyArray();
                                let member;
                                let target = null;

                                members.forEach(userId => {

                                    member = message.guild.members.find("id", userId);

                                    if (member.nickname) {
                                        if (member.nickname.toLowerCase().trim().includes(args.join(" ").toLowerCase().trim())) {
                                            target = member;
                                        }
                                    }
                                    if (member.user.username.toLowerCase().trim().includes(args.join(" ").toLowerCase().trim())) {
                                        target = member;
                                    }
                                });

                                if (target === null) {
                                    message.channel.send("Utilisateur introuvable").catch(console.error);
                                    return reject(null);
                                } else {

                                    if (target.id !== msg_obj.author.id) {
                                        return;
                                    }

                                }

                            }

                            let memberXPData = client.memberXP.get(msg_obj.author.id);

                            if (!memberXPData) {
                                client.memberXP.set(msg_obj.author.id, new MemberUserXP(msg_obj.author.id));
                                memberXPData = client.memberXP.get(msg_obj.author.id);
                            }

                            let palier_reached = memberXPData.level;

                            memberXPData.xp += msg_obj.content.length / 10;

                            Object.keys(bot_data.xp_table).forEach(palier => {

                                if (memberXPData.xp > bot_data.xp_table[palier].xp)
                                    palier_reached = palier;

                            });

                            if (palier_reached > memberXPData.level) {
                                memberXPData.level += 1;

                                message.channel.send(new RichEmbed()
                                    .addField(
                                        `**${msg_obj.member.displayName}** est passé à la **Division ${bot_data.xp_table[memberXPData.level].string}**`,
                                        `*${bot_data.xp_table[memberXPData.level].description}*`)
                                    .setColor(message.guild.me.displayColor)
                                ).catch(console.error);

                                message.channel.guild.roles.array().forEach(role => {

                                    if (role.name.split(' ')[1] === bot_data.xp_table[memberXPData.level].string) {
                                        if (msg_obj.member) {
                                            msg_obj.member.addRole(role).catch(err => {
                                                console.error(err);
                                                message.channel.send("Impossible d'ajouter le rôle correspondant.").catch(console.error);
                                            });
                                        } else {
                                            message.channel.send("Impossible d'ajouter le rôle correspondant.").catch(console.error);
                                        }
                                    }

                                });

                            }

                            client.memberXP.set(msg_obj.author.id, memberXPData);

                            count += 1;
                            if (count % 2000 === 0) console.log(`${chan.name}: Successfully analysed (${count}) messages. (${msg_obj.content})`);

                        });

                        msg_collected = messages;
                        return (retrieve_message(message_id));

                    }).catch((err) => {
                        console.error(err);

                    });

                }

                retrieve_message(message_id);


            }).catch(console.error);

        });

    }

    let updateXP = async () => {
        let channels = message.guild.channels.array();

        for (let i = 0 ; i < channels.length ; i++) {
            await analyse_channel(channels[i], args);
        }
    };

    updateXP().then(() => {
        console.log("Update XP Done !");
    }).catch(console.error);

};