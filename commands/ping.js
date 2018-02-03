exports.run = (client, message) => {

	console.log('Launching ping command.');
    message.channel.send({embed: {
        color: message.guild.me.displayColor,
        fields: [{
            name: "Pong !",
            value: `:ping_pong: ${Math.round(client.ping)}ms`
        }]
    }});

};