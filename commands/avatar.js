const RichEmbed = require('discord.js').RichEmbed;


function find_user (name, members, message) {

    let member;

    // iterates over all members
    for (let index in members) {

        member = message.guild.members.find("id", members[index]);

        /*
        toLowerCase() method converts all characters into lower case
        (https://www.w3schools.com/jsref/jsref_tolowercase.asp)

        trim() method removes whitespace at the beginning and the end of a string
        (https://www.w3schools.com/jsref/jsref_trim_string.asp)

        this way the comparison will be more handy :)
        */

        // compare with nickname
        if (member.nickname) {
            if (member.nickname.toLowerCase().trim().includes(name.toLowerCase().trim())) {
                return (member);
            }
        }

        // compare with username
        if (member.user.username.toLowerCase().trim().includes(name.toLowerCase().trim())) {
            return (member);
        }

    }

    // If we can't find the user, return null
    return (null)

}

function error_message (client, message, command, nature, utilisation) {
    message.channel.send({
        embed: {
            color: 7419530,
            author: {
                name: `${command} - Erreur`,
                icon_url: client.user.avatarURL
            },
            description: nature,
            fields: [{
                name: "Utilisation :",
                value: utilisation
            }]
        }
    });
}

exports.run = (client, message, args) => {

    let command = 'Avatar';

    let name = args.join(' ');
    let members = message.guild.members.keyArray();

    if (!name) {
        let target = message.member;
        let target_avatarURL = target.user.avatarURL;
        message.channel.send(new RichEmbed().setImage(target_avatarURL)
            .setAuthor(`Avatar de ${target.displayName}`, target.user.avatarURL)
            .setTitle(`*Lien de l'image*`)
            .setURL(target_avatarURL)
            .setColor(target.displayColor));
    }
    else {
        let target = find_user(name, members, message);
        if (!target) {
            let nature = 'L\'utilisateur n\'a pas été trouvé.';
            let utilisation = `/avatar <pseudo>*`;
            error_message(client, message, command, nature, utilisation);
        }

        else {
            let target_avatarURL = target.user.avatarURL;
            if (!target_avatarURL) {
                let nature = 'L\'utilisateur n\'a pas d\'avatar.';
                let utilisation = `/avatar <pseudo>*`;
                error_message(client, message, command, nature, utilisation);
            }
            else {
                message.channel.send(new RichEmbed().setImage(target_avatarURL)
                    .setAuthor(`Avatar de ${target.displayName}`, target.user.avatarURL)
                    .setTitle(`*Lien de l'image*`)
                    .setURL(target_avatarURL)
                    .setColor(target.displayColor));
            }
        }
    }

};