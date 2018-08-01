/*const assert = require("chai").assert;
const mute = require("../../commands/mute.js").mute;
const unmute = require("../../commands/unmute.js").unmute;
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");

let testChannel;
let testMsg;
const KazuhiroId = "140033402681163776";

describe('mute and unmute test', () => {

    before("Init client", async function() {
        this.timeout(100000);
        await client.login(bot_data.bot_values.bot_token);
        testChannel = client.channels.find('id', "314122440420884480");
        testMsg = await testChannel.send("Test message");
    });

    it("mute test", async () => {

        await mute(client, testMsg, ['Kazuhiro']);
        let channels = client.guilds.first().channels.array();
        for (let i = 0 ; i < channels.length ; i++) {
            if (channels[i].type === 'text') {
                let overwrite = channels[i].permissionOverwrites.find('id', KazuhiroId);

                assert.equal(overwrite.id, KazuhiroId);
                break;
            }
        }
    });

    it('unmute test', async () => {

        await unmute(client, testMsg, ['Kazuhiro']);
        client.guilds.first().channels.array().forEach(channel => {
            if (channel.type === 'text') {
                let overwrite = channel.permissionOverwrites.find('id', KazuhiroId);

                assert.notEqual(overwrite, KazuhiroId);
            }
        });

    });

    after("Deleting client", function() {
        this.timeout(100000);
        if (client.readyAt) {
            return client.destroy();
        }
    });

});
*/