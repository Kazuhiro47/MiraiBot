const japanese = require('hiragana-romaji-katakana');

exports.run = (client, message, args) => {

    message.channel.send(japanese.romajiToHiragana(args.join(' '))).catch(console.error);

};