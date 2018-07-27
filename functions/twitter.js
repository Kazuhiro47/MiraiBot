let Twitter = require('twitter');
const bot_data = require("../bot_data");
let RichEmbed = require("discord.js").RichEmbed;

let initTwitterListener = (channel, kazuhiro) => {

    let client = new Twitter({
        consumer_key: bot_data.twitter_api.consumer_key,
        consumer_secret: bot_data.twitter_api.consumer_secret,
        access_token_key: bot_data.twitter_api.access_token_key,
        access_token_secret: bot_data.twitter_api.access_token_secret
    });

    client.stream('statuses/filter', {track: 'danganronpa'},  function(stream) {
        stream.on('data', function(tweet) {

            if (tweet.user.screen_name === "danganronpawiki") {

                let msg = new RichEmbed()
                    .setAuthor(tweet.user.name, tweet.user.profile_image_url)
                    .setDescription(tweet.text)
                    .setFooter(tweet.created_at)
                    .setColor(bot_data.bot_values.bot_color);

                if ("media" in tweet.entities) {
                    tweet.entities.media.forEach(media => {
                        msg.setImage(media.media_url);
                    });
                }

                channel.send(msg).catch(console.error);
            }

        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });

};

module.exports = {initTwitterListener};
