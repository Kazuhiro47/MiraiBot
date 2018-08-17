exports.run = (client, member) => {

    console.log(`${member.user.username} left the server.`);
    if (member.guild.defaultChannel) {
    member.guild.defaultChannel.send(`${member.user.username} vient de quitter l'Académie du Pic de l'Espoir.`)
        .catch(console.error);
        }

};
