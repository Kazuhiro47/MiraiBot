const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data");
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

exports.run = (client, message, args) => {

    let msg = new RichEmbed();

    if (args.length !== 0 && bot_data.bot_values.bot_owners.includes(message.author.id)) {

        let members = message.guild.members.keyArray();
        let member;
        let target = null;

        members.forEach(userId => {

            member = message.guild.members.find("id", userId);

            if (member.nickname) {
                if (member.nickname.toLowerCase().trim().includes(args[0].toLowerCase().trim())) {
                    target = member;
                }
            }
            if (member.user.username.toLowerCase().trim().includes(args[0].toLowerCase().trim())) {
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

            memberXPData.xp -= parseInt(args[1]);

            client.memberXP.set(target.id, memberXPData);

            msg.setAuthor(target.displayName, target.user.displayAvatarURL)
                .setDescription("*Suppression de fragments d'espoir*")
                .setColor(target.displayColor)
                .addField("Fragments d'espoir", `**${memberXPData.xp.toFixed(0)}** fragments d'espoir`)
                .addField("Division", `Division **${bot_data.xp_table[memberXPData.level].string}**`);

        }
        message.channel.send(msg).catch(console.error);

    }


};