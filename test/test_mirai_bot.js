const Discord = require('discord.js');
const bot_data = require('../bot_data.js');
const client = new Discord.Client();

const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');
const check_xp = require("../functions/parsing_functions").check_xp;

/* Initialize an instance of Enmap
const userProvider = new EnmapLevel({name: 'memberXP'});
client.memberXP = new Enmap({provider: userProvider});

const SDSE2Provider = new EnmapLevel({name: 'SDSE2Data'});
client.SDSE2Data = new Enmap({provider: SDSE2Provider});

const userstat = new EnmapLevel({name: 'userstat'});
client.userstat = new Enmap({provider: userstat});

const tradProvider = new EnmapLevel({name: 'trad'});
client.trad = new Enmap({provider: tradProvider});

const gSettings = new EnmapLevel({name: "gSettings"});
client.gSettings = new Enmap({provider: gSettings});
*/
const listencmd = true;

client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Mirai_Bot Test connected");
    /*client.guilds.get("168673025460273152").channels.get("473989701800296449").fetchMessage("474182713956368388").then(msg => {
        msg.reactions.array().forEach(r => {
            r.fetchUsers(100).then(users => {
                users.array().forEach(user => {
                    r.remove(user).catch(console.error);
                });
            });
        })
    }).catch(console.error);*/


}).catch(console.error);

client.on("message", (message) => {

    check_xp(client, message);

    if (listencmd && message.author.id !== bot_data.bot_values.bot_id && message.content === "/test") {
        const args = message.content.slice(1).trim().split(/ +/g);

        let commandFile = require(`../commands/SDSE2.js`);

        commandFile.run(client, message, args);
    }

});
