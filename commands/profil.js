const RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js");

exports.run = (client, message) => {

    if (!message.member) return;

    let target = message.member;

    let minutes = target.joinedAt.getMinutes();
    let hours = target.joinedAt.getUTCHours() + 1;
    let day = target.joinedAt.getDate();
    let month = target.joinedAt.getMonth() + 1;
    let year = target.joinedAt.getFullYear();

    let target_role = target.hoistRole;
    if (!target_role) {
        target_role = target.highestRole.name;
    }
    else {
        target_role = target_role.name;
    }
    if (target_role === '@everyone') {
        target_role = 'Aucun rang';
    }

    let target_status = target.user.presence.status;
    if (target_status === 'online') {
        target_status = ':green_heart: En ligne';
    }
    if (target_status === 'idle') {
        target_status = ':yellow_heart: Inactif';
    }
    if (target_status === 'dnd') {
        target_status = ':heart: Ne pas déranger';
    }
    if (target_status === 'offline') {
        target_status = ':black_heart: Hors-ligne';
    }

    let target_game = target.presence.game;
    if (!target_game) {
        target_game = 'Rien';
    }
    else {
        target_game = target_game.name;
    }

    message.channel.send(new RichEmbed()
        .setColor(bot_data.bot_values.bot_color)
        .setAuthor(target.user.username, target.user.avatarURL)
        .addField("A rejoint le serveur le", `${day}/${month}/${year} à ${hours}:${minutes}`, true)
        .addField("Rôle principal", target_role, true)
        .addField("Statut", target_status)
        .addField("Joue à", target_game)
    ).catch(console.error);
};
