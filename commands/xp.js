const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data");
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

exports.run = async (client, message, args) => {

    let msg = new RichEmbed();

    if (args.length !== 0) {

        let members = message.guild.members.keyArray();
        let member;
        let target = null;

        members.forEach(userId => {

            member = message.guild.members.find("id", userId);

            if (member.nickname) {
                if (member.nickname.toLowerCase().trim().includes(args.join(" ").toLowerCase().trim())) {
                    target = member;
                }
            }
            if (member.user.username.toLowerCase().trim().includes(args.join(" ").toLowerCase().trim())) {
                target = member;
            }
        });

        if (target == null) {
            message.channel.send("Utilisateur introuvable").catch(console.error);
            return;
        } else {

            let memberSQLObj = await client.db.query(
                'SELECT * FROM mirai_team_log.server_member WHERE member_id = ?', [target.id]
            );

            memberSQLObj = memberSQLObj[0];

            msg.setAuthor(target.displayName, target.user.displayAvatarURL)
                .setColor(target.displayColor)
                .addField("Fragments d'espoir", `**${memberSQLObj.xp.toFixed(0)}** fragments d'espoir`)
                .addField("Division", `Division **${bot_data.xp_table[memberSQLObj.division].string}**`);

        }

    } else {

        let memberSQLObj = await client.db.query(
            'SELECT * FROM mirai_team_log.server_member WHERE member_id = ?', [message.author.id]
        );

        if (memberSQLObj.length === 0) {
            memberSQLObj = await client.db.query(
                'INSERT INTO mirai_team_log.server_member (member_id, avatarURL, name) VALUES (?, ?, ?)',
                [message.member.id, message.author.avatarUrl, message.author.username]
            );
        }

        memberSQLObj = memberSQLObj[0];

        msg.setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor(message.member.displayColor)
            .addField("Fragments d'espoir", `**${memberSQLObj.xp.toFixed(0)}** fragments d'espoir`)
            .addField("Division", `Division **${bot_data.xp_table[memberSQLObj.division].string}**`);

    }

    message.channel.send(msg).catch(console.error);

};