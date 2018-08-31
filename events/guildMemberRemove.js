let bot_data = require("../bot_data.js");

exports.run = (client, member) => {

    console.log(`${member.user.username} left the server.`);
    if (member.guild.id === bot_data.mirai_team_gid && member.guild.defaultChannel) {
    member.guild.defaultChannel.send(`${member.user.username} vient de quitter l'Académie du Pic de l'Espoir.`)
        .catch(console.error);
        }

};
