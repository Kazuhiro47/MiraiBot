exports.run = (client, message) => {

    console.log('Launching accents command');

    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            author: {
                name: `Les accents sur majuscules`,
                icon_url: message.guild.me.user.avatarURL
            },
            fields: [
                {
                    name: "Accents en **A**",
                    value: `Â / Ä / À`,
                    inline: true
                },
                {
                    name: "Accents en **E**",
                    value: `Ê / Ë / É / È`,
                    inline: true
                },
                {
                    name: "Accents en **I**",
                    value: `Î / Ï`,
                    inline: true
                },
                {
                    name: "Accents en **O**",
                    value: `Ô / Ö`,
                    inline: true
                },
                {
                    name: "Accents en **U**",
                    value: `Û / Ü / Ù`,
                    inline: true
                },
                {
                    name: "Autres accents",
                    value: `Ç / Œ / Æ`,
                    inline: true
                },
            ]
        }
    });

};