const SondageInfiniteChoice = require("../functions/cmds/referendum").SondageInfiniteChoice;
exports.run = (client, message, args) => {

    let options = args.join(' ').split('/');
    let question = options.shift();

    new SondageInfiniteChoice(question, options, message.channel, 60000).post().catch(console.error);

};
