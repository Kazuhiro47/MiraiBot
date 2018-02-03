const fs = require("fs");
const bot_data = require('../bot_data.js');

exports.run = (client, message) => {

    fs.readdir('./help', (err, file_names) => {

        if (err) return console.log(err);

        let command_help_message;
        let command_name;
        let commands_help_msgs = [];
        file_names.forEach(file_name => {

            command_name = file_name.split('.')[0];
            command_help_message = require(`../help/${file_name}`);

            commands_help_msgs.push({
                name: bot_data.bot_values.bot_prefix + command_name,
                value: command_help_message.help_msg
            })

        });

        message.channel.send({
            embed: {
                color: message.guild.me.displayColor,
                author: {
                    name: "Commandes du Mirai Bot",
                    icon_url: client.user.avatarURL
                },
                fields: commands_help_msgs
            }
        }).catch(onrejected => {

            console.log("Could not send message");
            console.log(onrejected);

        });

    });

};