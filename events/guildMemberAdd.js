let RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js").bot_values;

exports.run = (client, member) => {

    if (member.displayName.includes('appryl')) {
        member.ban().catch(console.error);
    }

};
