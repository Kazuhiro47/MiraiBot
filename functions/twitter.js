let Twitter = require('twitter');
const bot_data = require("../bot_data");

let client = new Twitter({
    consumer_key: bot_data.twitter_api.consumer_key,
    consumer_secret: bot_data.twitter_api.consumer_secret,
    access_token_key: bot_data.twitter_api.access_token_key,
    access_token_secret: bot_data.twitter_api.access_token_secret
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: 'danganronpa'},  function(stream) {
    stream.on('data', function(tweet) {
        if (!tweet.text.startsWith("RT")) {
            console.log(tweet.text + "\n--------------------\n");
        }
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});