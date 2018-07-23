const assert = require("chai").assert;
const find_user = require("../../functions/find_user.js").find_user;
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");

let result;

describe('find_user', () => {

    before("Init client", function() {
        this.timeout(100000);
        if (!client.readyAt) {
            return client.login(bot_data.bot_values.bot_token);
        }
    });

    describe("Kazuhiro", () => {

        before(() => {
            result = find_user(client, "Kazuhiro");
        });

        it("find Kazuhiro", async () => {
            assert.notEqual(result, null, `${result}`);
            assert.equal(result.user.username, 'Kazuhiro');
        }).timeout(100000);

        it('Kazuhiro should be string', async () => {
            assert.notEqual(result, null, `${result}`);
            assert.typeOf(result.user.username, 'string', `${result.username}`);
        }).timeout(100000);
    });


    describe("Shion", () => {

        before(() => {
            result = find_user(client, "Shion");
        });

        it('find Shion', async () => {
            assert.notEqual(result, null, `${result}`);
            assert.equal(result.user.username, 'Shion', `${result.username}`);
        }).timeout(100000);

        it('Shion should be a string', async () => {
            assert.notEqual(result, null, `${result}`);
            assert.typeOf(result.user.username, 'string', `${result.username}`);
        }).timeout(100000);

    });

    after("Deleting client", function() {
        this.timeout(100000);
        if (client.readyAt) {
            return client.destroy();
        }
    });

});


