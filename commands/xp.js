const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data");
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

exports.run = (client, message, args) => {

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

            let memberXPData = client.memberXP.get(target.id);

            if (!memberXPData) {
                return;
            }

            msg.setAuthor(target.displayName, target.user.displayAvatarURL)
                .setColor(target.displayColor)
                .addField("Fragments d'espoir", `**${memberXPData.xp.toFixed(0)}** fragments d'espoir`)
                .addField("Division", `Division **${bot_data.xp_table[memberXPData.level].string}**`);

        }

    } else {

        let memberXPData = client.memberXP.get(message.author.id);

        if (!memberXPData) {

            client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
            memberXPData = client.memberXP.get(message.author.id);
            if (!"xp" in memberXPData) {
                memberXPData["xp"] = 0;
            }

        }

        console.log(memberXPData);

        msg.setAuthor(message.member.displayName, message.author.displayAvatarURL)
            .setColor(message.member.displayColor)
            .addField("Fragments d'espoir", `**${memberXPData.xp.toFixed(0)}** fragments d'espoir`)
            .addField("Division", `Division **${bot_data.xp_table[memberXPData.level].string}**`);

    }

    message.channel.send(msg).catch(console.error);

};