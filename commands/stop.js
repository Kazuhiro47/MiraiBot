const bot_data = require('../bot_data.js');

exports.run = (client, message) => {

    if (bot_data.bot_values.bot_owners.includes(message.author.id)) {

        const { exec } = require('child_process');
        exec('pm2 stop Mirai_Bot', (err, stdout, stderr) => {
            if (err) {
                console.log("Couldn't stop bot");
                message.channel.send("Le stop a échoué.").catch(console.error);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });

    } else {
        message.channel.send(`Tu n'as pas la permission, ${message.author.username}`).catch(console.error);
    }

};