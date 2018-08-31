const fs = require("graceful-fs");

exports.run = (client, message, args) => {

	if(!args || args.size < 1 || message.author.id !== "140033402681163776") {
		return message.reply("Erreur.");
	}
    // the path is relative to the *current folder*, so just ./filename.js

    if (fs.existsSync(`./commands/${args[0]}.js`)) {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
        message.reply(`la commande ${args[0]} a été rechargée.`).catch(console.error);
    } else if (fs.existsSync(`./global_commands/${args[0]}.js`)) {
        delete require.cache[require.resolve(`../global_commands/${args[0]}.js`)];
        message.reply(`la commande ${args[0]} a été rechargée.`).catch(console.error);
    } else {
        message.reply("Commande introuvable").catch(console.error);
    }

};
