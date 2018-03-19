exports.run = (client, message, args) => {

    const request = require('request');

    request('http://conjugueur.reverso.net/conjugaison-francais-verbe-être.html', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body);
    });

};