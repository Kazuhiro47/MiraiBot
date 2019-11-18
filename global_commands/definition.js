const getDefinitions = require('../functions/definitions');
const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js").bot_values;

exports.run = (client, message, args) => {

    console.log('Launching definitions command.');

    const wordQuery = args.join(' ');

    message.channel.startTyping();

    getDefinitions(wordQuery).then(defs => {

    	let embed = new RichEmbed().setColor(bot_data.bot_color).setTitle(wordQuery).setURL(`https://www.cnrtl.fr/definition/${wordQuery}`);
    	str = '';

   		defs.forEach((def, i) => {
   			if (str.length + def.length > 2048) {
   				embed.setDescription(str);
    			message.channel.send(embed).catch(console.error);
    			str = '';
   			}
   			str += `- **${def}**\n\n`;
   		})

   		embed.setDescription(str);
    	message.channel.send(embed).catch(console.error);
    	message.channel.stopTyping();

    }).catch(err => {
    	message.channel.stopTyping();
    	console.error(err);
    })

};