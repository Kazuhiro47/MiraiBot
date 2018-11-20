const jishoApi = require("unofficial-jisho-api");
const jisho = new jishoApi();
const jishoQueryMenu = require("../functions/jisho").jishoQueryMenu;

exports.run = (client, message, args) => {

    let sentence = args.join(' ');

    jishoQueryMenu(client, message, sentence, jisho).catch(console.error);

};
