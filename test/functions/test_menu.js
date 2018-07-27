const assert = require("chai").assert;
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");
const RichEmbed = require("discord.js").RichEmbed;

const MenuChoice = require("../../functions/menu.js").MenuChoice;

let msg;
let embed;
let test;
let choice;
let testBotChannel;

describe('Menu Choice object', () => {

    before("init client", async function () {
        this.timeout(100000);
        if (!client.readyAt) {
            await client.login(bot_data.bot_values.bot_token);
        }
        testBotChannel = client.channels.find("id", "314122440420884480");
        embed = new RichEmbed()
            .addField("Choice 1", "1")
            .addField("Choice 2", "2")
            .addField("Choice 3", "3")
            .addField("Choice 4", "4");

        msg = await testBotChannel.send(embed);

        test = new MenuChoice(msg, embed.fields, embed);
        test.user = client.users.find("id", "140033402681163776");
        test.sentMessage = msg;
    });

    it('should returns first choice', async function () {

        await testBotChannel.send("Choisissez le choix 1 pour le bien du test unitaire");
        choice = await test.getChoice(msg);
        assert.equal(choice, 0);

    }).timeout(100000);

    it('should returns second choice', async function () {

        await testBotChannel.send("Choisissez le choix 2 pour le bien du test unitaire");
        choice = await test.getChoice(msg);
        assert.equal(choice, 1);

    }).timeout(100000);

    it('should returns third choice', async function () {

        await testBotChannel.send("Choisissez le choix 3 pour le bien du test unitaire");
        choice = await test.getChoice(msg);
        assert.equal(choice, 2);

    }).timeout(100000);

    it('should returns fourth choice', async function () {

        await testBotChannel.send("Choisissez le choix 4 pour le bien du test unitaire");
        choice = await test.getChoice(msg);
        assert.equal(choice, 3);

    }).timeout(100000);

    after("deleting client", function () {
        this.timeout(100000);
        if (client.readyAt) {
            return client.destroy();
        }
    });

});