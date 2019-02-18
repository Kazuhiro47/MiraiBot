let RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js").bot_values;

exports.run = (client, guild, user) => {

    try {
        client.users.get('140033402681163776').send(new RichEmbed().setAuthor(user.username, user.avatarURL)
            .setDescription(`${user.username} est banni de l'Académie du Pic de l'Espoir`)
            .setColor(bot_data.bot_color)
        ).catch(console.error);
    } catch (e) {
        console.error(e);
    }

};
