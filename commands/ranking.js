const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data");
const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;


function find_highest(client, mems_xp) {

    let highest_xp = 0;
    let res = mems_xp[0];

    mems_xp.forEach(userTarget => {

        if (!userTarget) {
            return;
        }

        if (userTarget.xp > highest_xp) {
            res = userTarget;
            highest_xp = userTarget.xp;
        }
    });

    return res;

}

exports.run = (client, message) => {

/*    let membersXP = [];

    client.users.forEach(user => {
        let userr = client.memberXP.get(user.id);

        if (userr) {
            membersXP.push(userr);
        }
    });

    let msg = new RichEmbed();

    msg.setAuthor("Classement", message.guild.me.user.avatarURL)
        .setColor(message.guild.me.displayColor);

    let target = null;
    let i = 0;
    while (i < 25) {

        if (target) {
            membersXP.splice(membersXP.indexOf(target), 1);
        }

        target = find_highest(client, membersXP);

        let mem = message.guild.members.find("id", target.id);
        if (!mem) {
            continue;
        }
        msg.addField(`**${i + 1}** *${mem.displayName}*`, `**${target.xp.toFixed(0)}** fragments d'espoir`, true);

        i += 1;
    }

    message.channel.send(msg).catch(console.error);*/

};