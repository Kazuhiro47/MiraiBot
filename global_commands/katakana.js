const japanese = require('hiragana-romaji-katakana');

exports.run = (client, message, args) => {

    message.channel.send(japanese.romajiToKatakana(args.join(' '))).catch(console.error);

};