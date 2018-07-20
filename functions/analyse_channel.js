const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js").bot_values;

let find_user = (client, name) => {
    let usersArray = client.users.array();

    for (let i = 0; i < usersArray.length; i++) {
        let user = usersArray[i];
        if (user.username.toLowerCase().trim().includes(name.toLowerCase().trim())) {
            return (user);
        }
    }
    return (null)
};

let getChannelMessages = (client, channel, check_fct) => {
    return new Promise(async (resolve, reject) => {
        if (!channel) {
            reject("Channel not found");
        }

        let messages = [];
        let firstMessage = await channel.fetchMessages({limit: 1});
        let messagesFetched = await channel.fetchMessages({limit: 100, before: firstMessage.first().id});

        messages.concat(messagesFetched.array());

        while (messagesFetched.array().length > 0) {

            if (check_fct && !check_fct(messagesFetched.array())) {
                break;
            }

            messagesFetched.array().forEach(msgFetched => {

                if (check_fct === undefined) {
                    messages.concat(messagesFetched.array());
                }
                if (check_fct && check_fct([msgFetched])) {
                    messages.concat(messagesFetched.array());
                }

            });

            messagesFetched = await channel.fetchMessages({limit: 100, before: messagesFetched.last().id});
        }

        resolve(messages);

    });
};

let analyseLogChan = async (client, channel) => {
    const logTradChan = client.channels.find("id", "452118364161048576");
    let messageEmbed = new RichEmbed().setColor(bot_data.bot_color).setTitle("Statistiques");

    if (logTradChan) {

        let firstMessage = await logTradChan.fetchMessages({limit: 1});
        let messagesFetched = await logTradChan.fetchMessages({limit: 100, before: firstMessage.first().id});
        let stats = {};
        const now = new Date();

        let checkIfMsgIsToday = (msg) => {
            return true;
            /*return (msg.createdAt.getFullYear() === now.getFullYear() &&
                (msg.createdAt.getDate() === now.getDate() ||
                    (msg.createdAt.getDate() + 1 === now.getDate() && msg.createdAt.getHours() > now.getHours())) &&
                msg.createdAt.getMonth() === now.getMonth());*/
        };

        // check first message
        if (checkIfMsgIsToday(firstMessage.first())) {

            const messageContentArray = firstMessage.first().content.split(/ +/g);
            let user = find_user(client, messageContentArray[0].slice(0, messageContentArray[0].length - 2));

            if (!user) {
                let Kazuhiro = client.users.find('id', '140033402681163776');

                Kazuhiro.send(`L'utilisateur ${messageContentArray[0]} est introuvable`).catch(console.error);
            } else {

                if (!(user.id in stats)) {
                    stats[user.id] = 0;
                }

                if (messageContentArray.length === 7) {
                    stats[user.id] += 1 + parseInt(messageContentArray[4]);
                } else {
                    stats[user.id] += 1;
                }
            }
        }

        let checkIfArrayHasTodayTS = (msgArray) => {
            return true;
            /*for (let i = 0; i < msgArray.length; i++) {
                if (msgArray[i].createdAt.getFullYear() === now.getFullYear() &&
                    (msgArray[i].createdAt.getDate() === now.getDate() ||
                        (msgArray[i].createdAt.getDate() + 1 === now.getDate() && msgArray[i].createdAt.getHours() > now.getHours())) &&
                    msgArray[i].createdAt.getMonth() === now.getMonth()) {
                    return true;
                }
            }
            return false;*/
        };

        while (messagesFetched.array().length > 0) {

            if (!checkIfArrayHasTodayTS(messagesFetched.array())) {
                break;
            }

            console.log(messagesFetched.array().length);

            messagesFetched.array().forEach(msgFetched => {

                if (checkIfMsgIsToday(msgFetched)) {

                    const messageContentArray = msgFetched.content.split(/ +/g);
                    let user = find_user(client, messageContentArray[0].slice(0, messageContentArray[0].length - 2));

                    if (!user) {
                        let Kazuhiro = client.users.find('id', '140033402681163776');

                        Kazuhiro.send(`L'utilisateur ${messageContentArray[0]} est introuvable`).catch(console.error);
                    } else {

                        if (!(user.id in stats)) {
                            stats[user.id] = 0;
                        }

                        if (messageContentArray.length === 7) {
                            if (parseInt(messageContentArray[4]) < 1000) {
                                stats[user.id] += 1 + parseInt(messageContentArray[4]);
                            } else {
                                stats[user.id] += 1;
                            }
                        } else {
                            stats[user.id] += 1;
                        }
                    }
                }
            });

            messagesFetched = await logTradChan.fetchMessages({limit: 100, before: messagesFetched.last().id});
        }

        let findHighestTranslators = (statObj) => {

            if (Object.keys(statObj).length === 0) {
                return undefined;
            }

            let highest = Object.keys(statObj)[0];

            Object.keys(statObj).forEach(id => {
                if (statObj[id] > statObj[highest]) {
                    highest = id;
                }
            });
            return highest;
        };

        let rank = 1;
        let i = 1;
        while (Object.keys(stats).length > 0) {
            let bestTranslatorId = findHighestTranslators(stats);
            if (bestTranslatorId !== undefined) {
                let translator = client.users.find("id", bestTranslatorId);

                if (i === 25) {
                    channel.send(messageEmbed).catch(console.error);
                    messageEmbed = new RichEmbed().setColor(bot_data.bot_color);
                    i = 0;
                }
                messageEmbed
                    .addField(`${rank} - **${translator.username}**`, `${stats[bestTranslatorId]} répliques modfiées`);
                i += 1;
                rank += 1;
            }
            delete stats[bestTranslatorId];
        }
        channel.send(messageEmbed).catch(console.error);
    }
};

module.exports = {analyseLogChan, getChannelMessages};
