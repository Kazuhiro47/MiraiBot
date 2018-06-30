const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;

exports.run = (client, member, message) => {
    let memberXPData = client.memberXP.get(message.author.id);

    if (!memberXPData) {
        client.memberXP.set(message.author.id, new MemberUserXP(message.author.id));
        memberXPData = client.memberXP.get(message.author.id);
    }

    memberXPData.xp -= message.content.length / 10;

    client.memberXP.set(message.author.id, memberXPData);

};