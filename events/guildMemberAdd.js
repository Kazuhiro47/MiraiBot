let RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js").bot_values;

exports.run = async (client, member) => {

    if (member.displayName.toLowerCase().includes('appryl')) {
        member.ban().catch(console.error);
    } else {
        await client.db.query(
            'INSERT INTO mirai_team_log.server_member (member_id, avatarURL, name) VALUES (?, ?, ?)',
            [member.id, member.user.avatarUrl, member.user.username]
        );
    }

};
