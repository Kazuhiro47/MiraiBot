let RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js").bot_values;

exports.run = (client, member) => {

    if (member.user.id === '180668154106740736') {
        member.ban().catch(console.error);
    } else {

        console.log(`${member.user.username} joined the server.`);
        member.guild.defaultChannel.send(new RichEmbed().setAuthor(member.user.username, member.user.avatarURL)
            .setDescription("Bienvenue à l'Académie du Pic de l'Espoir !")
            .setColor(bot_data.bot_color)
            .setImage(member.user.avatarURL)
        ).catch(console.error);

    }

};
