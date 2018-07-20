let bot_data = require("../bot_data.js").bot_values;

exports.run = (client, message) => {

	console.log('Launching ping command.');
    message.channel.send({embed: {
        color: bot_data.bot_color,
        fields: [{
            name: "Pong !",
            value: `:ping_pong: ${Math.round(client.ping)}ms`
        }]
    }}).catch(console.error);

};