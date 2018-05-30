const request = require("request");

request({
    uri: "https://www.wordreference.com/enfr/thread",
}, function (error, response, body) {
    let cheerio = require("cheerio");
    let $ = cheerio(body);
    let list = $("ul");

    console.log(list.html());
});
