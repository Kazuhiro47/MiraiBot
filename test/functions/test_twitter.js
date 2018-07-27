const assert = require("chai").assert;
const twitter = require("../../functions/twitter.js").initTwitterListener;
const Discord = require("discord.js");
const client = new Discord.Client();

twitter(null, null);

/*describe('twitter listener', () => {
    it('should get a tweet', function () {
    }).timeout(100000);
});*/