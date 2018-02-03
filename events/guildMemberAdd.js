exports.run = (client, member) => {

    console.log(`${member.user.username} joined the server.`);
    member.guild.defaultChannel.send(`Bienvenue à l'Académie du Pic de l'Espoir, ${member.user.username}.`)
        .catch(console.error);

};
