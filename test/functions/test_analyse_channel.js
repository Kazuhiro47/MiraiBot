const assert = require("chai").assert;
const analyseChannel = require("../../functions/analyse_channel.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");

let result;
const expectedLength = 240;

describe('getChannelMessages', () => {

    before("Init client", async function() {
        this.timeout(100000);
        if (!client.readyAt) {
            await client.login(bot_data.bot_values.bot_token);
        }
        const conseils_informations = client.channels.find("id", "173410481166352384");

        result = await analyseChannel.getChannelMessages(
            client,
            conseils_informations
        );
    });

    it("is result an array", async () => {

        assert.typeOf(result, 'array');

    }).timeout(100000);

    it('message array length should be ' + expectedLength, async () => {

        assert.equal(result.length, expectedLength, `${result.length} | ${expectedLength}`);

    }).timeout(100000);

    after("Deleting client", function() {
        this.timeout(100000);
        if (client.readyAt) {
            return client.destroy();
        }
    });

});
