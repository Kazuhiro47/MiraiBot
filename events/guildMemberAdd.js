let RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js");

exports.run = (client, member) => {

    if (member.user.id === '180668154106740736') {
        member.ban().catch(console.error);
    } else {

        console.log(`${member.user.username} joined the server.`);

        if (member.guild.id === bot_data.mirai_team_gid) {
            member.send(new RichEmbed()
                .setColor(bot_data.bot_values.bot_color)
                .setAuthor("Bienvenue à l'Académie du Pic de l'Espoir - 未来チーム", client.user.avatarURL)
                .setDescription("N'oublie pas de consulter les règles dans le salon règlement de l'académie.")
                .addField("Tu veux traduire ?", "Envoie un message privé à Kazuhiro#1248")
                .addField("Ou peut-être pas", "Tu peux aussi discuter librement dans l'enceinte du serveur")
            ).catch(console.error);
        }

        if (member.guild.defaultChannel) {
        member.guild.defaultChannel.send(new RichEmbed().setAuthor(member.user.username, member.user.avatarURL)
            .setDescription("Bienvenue à l'Académie du Pic de l'Espoir !")
            .setColor(bot_data.bot_values.bot_color)
            .setImage(member.user.avatarURL)
        ).catch(console.error);
        }

    }

};
