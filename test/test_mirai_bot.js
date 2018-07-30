const Discord = require('discord.js');
const bot_data = require('../bot_data.js');
const client = new Discord.Client();

client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Mirai_Bot Test connected");

    const testBotChanMT = client.channels.find("id", "314122440420884480");
    /*const resolvePath = require('path').resolve;

    let path = `https://ibb.co/e5jTOo`;
    testBotChanMT.send(
        new Discord.RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setImage(path)
            .setTitle("https://ibb.co/e5jTOo")
    ).catch(console.error);*/

}).catch(console.error);

client.on("message", (message) => {

    if (message.author.id !== bot_data.bot_values.bot_id && message.content === "/test") {

        const args = message.content.slice(1).trim().split(/ +/g);

        let commandFile = require(`../commands/SDSE2.js`);

        commandFile.run(client, message, args);

    }

});
