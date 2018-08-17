exports.run = (client, message, args) => {

	if(!args || args.size < 1 || message.author.id !== "140033402681163776") {
		return message.reply("Erreur.");
	}
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`../functions/${args[0]}.js`)];
    message.reply(`la commande ${args[0]} a été rechargée.`);

};
