const get_random_index = require("../lg/lg_functions").get_random_index;
exports.run = (client, message) => {
    const ahs = [
        "https://cdn.discordapp.com/attachments/168673025460273152/482912955982413825/ah.gif",
        "https://gyazo.com/20944cdea56b6226a1c748f04b4fc7af"
    ];

    let index = get_random_index(ahs);

    message.channel.send(ahs[index]).catch(console.error);
};
