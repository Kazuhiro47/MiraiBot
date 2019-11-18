const RichEmbed = require("discord.js").RichEmbed;
const Quizz = require('../learn_japanese/quizzObject.js').Quizz;
const bot_data = require('../bot_data.js');
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

let askUserIfContinue = (message) => new Promise((resolve, reject) => {

    message.channel.send(new RichEmbed().setTitle("Voulez-vous passer au niveau suivant ?")
        .addField("Oui", "tapez oui")
        .addField("Non", "tapez non")
        .setColor(bot_data.bot_values.bot_color)
    ).then(msg => {
        setTimeout(() => {
            msg.delete().catch(console.error);
        }, 20000);
    }).catch(console.error);

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
            message.channel.send("Veuillez répondre par oui ou non.").then(msg => {
                setTimeout(() => {
                    msg.delete().catch(console.error);
                }, 5000);
            }).catch(console.error);
        }
    });

    answer.on('end', (collected) => {
        let promises = [];
        collected.forEach(m => {
            promises.push(m.delete());
        });
        Promise.all(promises).then(() => {
            resolve(result);
        }).catch(console.error);
    })

});

let printXpReward = (message, xpNb) => {

    if (xpNb > 0) {
        message.channel.send(new RichEmbed()
            .setColor(bot_data.bot_values.bot_color)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setTitle("Vous avez obtenu " + xpNb.toFixed(0) + " fragments d'espoir !")
        ).catch(console.error);
    }

};

exports.run = (client, message, args) => {

    const parameters = message.content.trim().toLowerCase().split(/ +/g);
    const q = new Quizz();

    console.log(parameters);

    if (parameters.length > 1) {

        if (parameters[1] === 'hiragana') {
            if (parameters.length === 2) {

                q.hiraganaBasic(message).then((xp) => {
                    /**/
                    q.resetStats();
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.hiraganaDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {
                    /**/
                    q.resetStats();
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.hiraganaPalatalised(message).then(xp => {
                            /**/
                            q.resetStats();
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {
                });

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.hiraganaAll(message).then(xp => {

                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "débutant") {

                    let doBegginerHiragana = async () => {
                        let xp;
                        for (let i = 1 ; i <= 10 ; i++) {
                            xp = await q.hiraganaBegginer(message, i);
                            q.resetStats();
                            if (await askUserIfContinue(message) === false) {
                                return;
                            }
                        }
                    };

                    doBegginerHiragana().catch(console.error);

                }

            }
        } else if (parameters[1] === 'katakana') {

            if (parameters.length === 2) {

                q.katakanaBasic(message).then((xp) => {

                    q.resetStats();
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.katakanaDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {
                    q.resetStats();
                    printXpReward(message, xp);
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.katakanaPalatalised(message).then(xp => {
                            q.resetStats();
                            printXpReward(message, xp);
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {
                });

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.katakanaAll(message).then(xp => {
                        q.resetStats();
                        printXpReward(message, xp);
                    }).catch(console.error);
                } else if (parameters[2] === 'débutant') {
                    let doIt = async () => {
                        let xp;
                        for (let i = 1 ; i <= 10 ; i++) {
                            xp = await q.katakanaBegginer(message, i);
                            q.resetStats();

                            if (await askUserIfContinue(message) === false) {
                                return;
                            }
                        }
                    };

                    doIt().catch(console.error);
                }

            }

        } else if (parameters[1] === 'kana') {

            if (parameters.length === 2) {

                q.allBasic(message).then((xp) => {

                    q.resetStats();
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        return q.allDakuten(message);
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).then((xp) => {

                    q.resetStats();
                    return askUserIfContinue(message);
                }).then(wantsToContinue => {
                    if (wantsToContinue) {
                        q.allPalatalised(message).then(xp => {

                            q.resetStats();
                        });
                    } else {
                        return new Promise((resolve, reject) => reject(true));
                    }
                }).catch(() => {
                });

            } else if (parameters.length >= 3) {

                if (parameters[2] === 'all') {
                    q.allAll(message).then(xp => {

                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === 'débutant') {
                    let doIt = async () => {
                        let xp;
                        for (let i = 1 ; i <= 10 ; i++) {
                            xp = await q.allBegginer(message, i);
                            q.resetStats();

                            if (await askUserIfContinue(message) === false) {
                                return;
                            }
                        }
                    };

                    doIt().catch(console.error);
                }

            }

        } else if (parameters[1] === 'kanji') {
            if (parameters.length === 3) {
                if (parameters[2] === "jlpt5") {
                    q.JLPT5(message).then(xp => {
                        q.resetStats();
                        printXpReward(message, xp);
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt4") {
                    q.JLPT4(message).then(xp => {

                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt3") {
                    q.JLPT3(message).then(xp => {

                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt2") {
                    q.JLPT2(message).then(xp => {

                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt1") {
                    q.JLPT1(message).then(xp => {
                        /**/
                        q.resetStats();
                    }).catch(console.error);
                }
            }
        } else if (parameters[1] === 'vocabulaire') {
            if (parameters.length === 3) {
                if (parameters[2] === "jlpt5") {
                    q.JLPT5(message, true).then(xp => {
                        /*let memberXPData = client.memberXP.get(message.author.id);
                        if (!memberXPData) {
                            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                            memberXPData = client.memberXP.get(message.author.id);
                        }
                        memberXPData.xp += xp;
                        client.memberXP.set(message.author.id, memberXPData);*/
                        q.resetStats();
                        printXpReward(message, xp);
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt4") {
                    q.JLPT4(message, true).then(xp => {
                        /*let memberXPData = client.memberXP.get(message.author.id);
                        if (!memberXPData) {
                            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                            memberXPData = client.memberXP.get(message.author.id);
                        }
                        memberXPData.xp += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);*/
                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt3") {
                    q.JLPT3(message, true).then(xp => {
                        /*let memberXPData = client.memberXP.get(message.author.id);
                        if (!memberXPData) {
                            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                            memberXPData = client.memberXP.get(message.author.id);
                        }
                        memberXPData.xp += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);*/
                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt2") {
                    q.JLPT2(message, true).then(xp => {
                        /*let memberXPData = client.memberXP.get(message.author.id);
                        if (!memberXPData) {
                            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                            memberXPData = client.memberXP.get(message.author.id);
                        }
                        memberXPData.xp += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);*/
                        q.resetStats();
                    }).catch(console.error);
                } else if (parameters[2] === "jlpt1") {
                    q.JLPT1(message, true).then(xp => {
                        /*let memberXPData = client.memberXP.get(message.author.id);
                        if (!memberXPData) {
                            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
                            memberXPData = client.memberXP.get(message.author.id);
                        }
                        memberXPData.xp += xp;
                        client.memberXP.set(message.author.id, memberXPData);
                        printXpReward(message, xp);*/
                        q.resetStats();
                    }).catch(console.error);
                }
            }
        }

    } else {
        message.channel.send(new RichEmbed().setTitle("Guide des commandes Quizz")
            .setDescription("Veuillez tapez au clavier une des commandes ci-dessous")
            .setColor(bot_data.bot_values.bot_color)
            .addField("Hiragana",
                "/quizz hiragana débutant\n" +
                "/quizz hiragana\n" +
                "/quizz hiragana all\n"
                , true)
            .addField("Katakana",
                "/quizz katakana débutant\n" +
                "/quizz katakana\n" +
                "/quizz katakana all\n"
            , true)
            .addField("kana",
                "/quizz kana débutant\n" +
                "/quizz kana\n" +
                "/quizz kana all\n"
                , true)
            .addField("kanji",
                "/quizz kanji JLPT5\n" +
                "/quizz kanji JLPT4\n" +
                "/quizz kanji JLPT3\n" +
                "/quizz kanji JLPT2\n" +
                "/quizz kanji JLPT1\n"
                , true)
            .addField("Vocabulaire",
                "/quizz vocabulaire JLPT5\n" +
                "/quizz vocabulaire JLPT4\n" +
                "/quizz vocabulaire JLPT3\n" +
                "/quizz vocabulaire JLPT2\n" +
                "/quizz vocabulaire JLPT1\n"
                , true)
            .setImage("https://www.global.hokudai.ac.jp/wp-content/uploads/2012/11/nihongo.jpg")
        ).catch(console.error);
    }

};
