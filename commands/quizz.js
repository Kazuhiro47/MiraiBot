const RichEmbed = require("discord.js").RichEmbed;
const Quizz = require('../learn_japanese/quizzObject.js').Quizz;
const bot_data = require('../bot_data.js');
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

let askUserIfContinue = (message) => new Promise((resolve, reject) => {

    message.channel.send(new RichEmbed().setTitle("Voulez-vous passer au niveau suivant ?")
        .addField("Oui", "tapez oui")
        .addField("Non", "tapez non")
        .setColor(bot_data.bot_values.bot_color)
    ).catch(console.error);

    const answer = message.channel.createMessageCollector(m => m.author.id === message.author.id);

    let result = false;

    answer.on('collect', msg => {
        const response = msg.content.trim().toLowerCase();

        if (response === 'oui') {
            result = true;
            answer.stop();
        } else if (response === 'non') {
            result = false;
            answer.stop();
        } else {
            message.channel.send("Veuillez répondre par oui ou non.").catch(console.error);
        }
    });

    answer.on('end', () => {
        resolve(result);
    })

});

let printXpReward = (message, xpNb) => {

    if (xpNb > 0) {
        message.channel.send(new RichEmbed()
            .setColor(bot_data.bot_values.bot_color)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Vous avez obtenu " + xpNb.toFixed(1) + " fragments d'espoir !")
        ).catch(console.error);
    }

};

exports.run = (client, message) => {

    const parameters = message.content.trim().toLowerCase().split(/ +/g);
    const q = new Quizz();

    let memberXPData = client.memberXP.get(message.author.id);
    if (!memberXPData) {
        client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
        memberXPData = client.memberXP.get(message.author.id);
    }

    if (parameters.length > 1) {

        if (parameters[1] === 'hiragana') {
            if (parameters.length === 2) {

                q.hiraganaBasic(message).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.hiraganaDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.hiraganaPalatalised(message).then(xp => {
                            memberXPData.xp += xp;
                            client.memberXP.set(message.author.id, memberXPData);
                            printXpReward(message, xp);
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {});

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.hiraganaAll(message).then(xp => {
                        memberXPData += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);
                    }).catch(console.error);
                }

            }
        } else if (parameters[1] === 'katakana') {

            if (parameters.length === 2) {

                q.katakanaBasic(message).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.katakanaDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.katakanaPalatalised(message).then(xp => {
                            memberXPData.xp += xp;
                            client.memberXP.set(message.author.id, memberXPData);
                            printXpReward(message, xp);
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {});

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.katakanaAll(message).then(xp => {
                        memberXPData += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);
                    }).catch(console.error);
                }

            }

        } else if (parameters[1] === 'general') {

            if (parameters.length === 2) {

                q.allBasic(message).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.allDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {
                    memberXPData.xp += xp;
                    client.memberXP.set(message.author.id, memberXPData);
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.allPalatalised(message).then(xp => {
                            memberXPData.xp += xp;
                            client.memberXP.set(message.author.id, memberXPData);
                            printXpReward(message, xp);
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {});

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.allAll(message).then(xp => {
                        memberXPData += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);
                    }).catch(console.error);
                }

            }

        }

    } else {
        message.channel.send(new RichEmbed().setTitle("Erreur commande Quizz")
            .setColor(bot_data.bot_values.bot_color)
            .addField("Commandes disponibles",
            "/quizz hiragana\n" +
            "/quizz katakana\n" +
            "/quizz general\n" +
            "/quizz hiragana all\n" +
            "/quizz katakana all\n" +
            "/quizz general all\n"
        )).catch(console.error);
    }

};