const request = require("request");

request({
    uri: "https://www.wordreference.com/enfr/thread",
}, function (error, response, body) {
    let cheerio = require("cheerio");
    let test = cheerio(body);

    console.log(test);
});
