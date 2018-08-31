const MemberUserXP = require("../functions/parsing_functions").MemberUserXP;
exports.run = (client, message) => {

    if (message.member && message.member.id === "140033402681163776") {

        client.users.forEach(user => {
            let memberXPData = client.memberXP.get(user.id);

            if (!memberXPData) {
                client.memberXP.set(user.id, new MemberUserXP(user.id));
                memberXPData = client.memberXP.get(user.id);
            }

            memberXPData.xp = 0;
            memberXPData.level = 0;

            client.memberXP.set(user.id, memberXPData);
        });

        message.channel.send("Xp reset.").catch(console.error);

    }

};
