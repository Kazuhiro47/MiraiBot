exports.run = (client, member) => {

    console.log(`${member.user.username} left the server.`);
    member.guild.defaultChannel.send(`${member.user.username} vient de quitter l'Académie du Pic de l'Espoir.`)
        .catch(console.error);

};
