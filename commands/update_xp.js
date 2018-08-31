const bot_data = require("../bot_data");
const getChannelMessages = require("../functions/analyse_channel").getChannelMessages;

let updateXpCmd = (client, message, args) => new Promise((resolve, reject) => {

    if (!bot_data.bot_values.bot_owners.includes(message.author.id)) {
        message.channel.send("Tu n'as pas la permission.").catch(console.error);
        return reject(message.author.username + " n'as pas la permission");
    }

    let channel = client.channels.get("314122440420884480");
    let channels = channel.guild.channels.array();

    let messages = [];

    let computeAll = async () => {
        for (let i = 0; i < channels.length; i++) {
            console.log("Analysing " + channels[i].name);
            messages = messages.concat(await getChannelMessages(client, channel, channels[i], args));
        }
        return messages;
    };

    if (args.length === 0) {

        computeAll().then(() => resolve(true)).catch(err => reject(err));

        /*let promises = [];
        channels.forEach(chan => {
            promises.push(getChannelMessages(client, channel, chan, []));
        });

        Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));*/

    } else if (args[0].startsWith("chan/")) {
        let channelChoice = message.guild.channels.find('name', args[0].split('/')[1]);

        console.log(args[0].split('/')[1]);
        if (channelChoice) {
            getChannelMessages(client, channel, channelChoice, []).then(() => resolve("Analyse terminée")).catch(err => reject(err));
        } else {
            reject("Channel not found");
        }
    } else if (args[0].startsWith("category/")) {
        console.log(args.join(' ').split('/')[1]);
        let categoryChoice = message.guild.channels.find("name", args.join(' ').split('/')[1]);

        if (categoryChoice && categoryChoice.type === "category") {

            let computeCategory = async () => {
                let chans = client.channels.array();
                for (let i = 0; i < chans.length; i++) {
                    if (chans[i].parentID === categoryChoice.id) {
                        await getChannelMessages(client, channel, chans[i], []);
                    }
                }
            };

            computeCategory().then(() => resolve("Analyse terminée")).catch(err => reject(err));

        } else {

            reject("Category not found");
        }
    } else {

    }

});

exports.run = (client, message, args) => {

    updateXpCmd(client, message, args).then((msg) => {
        message.channel.send(msg).catch(console.error);
    }).catch(console.error);

};
