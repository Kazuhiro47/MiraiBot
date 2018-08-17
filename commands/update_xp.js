const bot_data = require("../bot_data");
const getChannelMessages = require("../functions/analyse_channel").getChannelMessages;

let updateXpCmd = (client, message, args) => new Promise((resolve, reject) => {

    if (!bot_data.bot_values.bot_owners.includes(message.author.id)) {
        message.channel.send("Tu n'as pas la permission.").catch(console.error);
        return reject(message.author.username + " n'as pas la permission");
    }

    let channel = client.channels.get("314122440420884480");
    let channels = channel.guild.channels.array();

    let promises = [];
    let messages = [];

    for (let i = 0; i < channels.length; i++) {
        console.log("Analysing " + channels[i].name);
        promises.push(getChannelMessages(client, channels[i], args));
    }

    Promise.all(promises).then((messagesArrrays) => {
        messagesArrrays.forEach(array => {
            messages = messages.concat(array);
        });

        messages = messages.filter((msg) => {
            return msg.member && !msg.author.bot
        });

        channel.send("Update done.").then(() => {
            resolve("Done");
        }).catch(err => {
            console.error(err);
        });

    }).catch(err => {
        console.error(err);
    });

});

exports.run = (client, message, args) => {

    updateXpCmd(client, message, args).then((msg) => {
        console.log(msg);
    }).catch(console.error);

};
