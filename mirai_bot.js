const Discord = require('discord.js');
const bot_data = require('./bot_data.js');
const client = new Discord.Client();

// file stream import
const fs = require('graceful-fs');
const check_message = require("./functions/parsing_functions").check_message;


client.on('ready', () => {
    console.log('I am ready!');
});


// On message
client.on('message', message => {

    check_message(message);

    if (!message.content.startsWith(bot_data.bot_values.bot_prefix)) return;

    let date = new Date();

    const args = message.content.slice(bot_data.bot_values.bot_prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    console.log(`Command: ${command}`);

    try {

        let commandFile = require(`./commands/${command}.js`);

        console.log(`${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours() + 1}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s | ${message.guild} | ${message.channel.name} | ${message.author.username} : ${message.content}`);

        commandFile.run(client, message, args);

    } catch (err) {
        console.error(err);
    }


});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});

let find_interval = setInterval(function () {
    let date = new Date();
    let UTCseconds = date.getUTCSeconds();
    let seconds = date.getSeconds();

    if (UTCseconds === 0 || seconds === 0) {
        console.log("Minute interval found");
        set_minute_interval();
    }

}, 1000);

let minute_interval;

function set_minute_interval() {
    clearInterval(find_interval);
    check_birthday();
    minute_interval = setInterval(function () {

        let date = new Date();
        let UTCminute = date.getUTCMinutes();
        let minute = date.getMinutes();

        if (UTCminute === 0 || minute === 0) {
            console.log("Hour interval found");
            set_hour_interval();
        }

    }, 60000);
}

let hour_interval;

function set_hour_interval() {
    clearInterval(minute_interval);
    check_birthday();
    hour_interval = setInterval(function () {

        let date = new Date();
        let UTChour = date.getUTCHours();
        let hour = date.getHours();

        if (UTChour === 0 || hour === 0) {
            console.log("Day interval found");
            set_day_interval();
        }

    }, 60000 * 60);
}

function set_day_interval() {
    clearInterval(hour_interval);
    check_birthday();
    setInterval(function () {
        check_birthday();
    }, 60000 * 60 * 24);
}

function check_birthday() {
    let date = new Date();
    const generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");
    const fileName = 'mirai_bot.json';
    let day = date.getDate() + 1;
    let month = date.getMonth() + 1;

    if (((date.getUTCHours() + 1) % 24 === 0 && date.getUTCMinutes() === 0)) {
        if (!fs.existsSync(fileName)) {
            console.error("Aucun anniversaire enregistré.");
        } else {

            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    console.error("Le fichier n'a pas pu être ouvert.");
                } else {
                    let obj = JSON.parse(data);

                    obj.anniversaires.forEach(birthDay => {
                        if (birthDay.day === day && birthDay.month === month) {
                            generalChannelMiraiTeam.send(`C'est l'anniversaire de <@${birthDay.id}> !`);
                        }
                    });

                }
            });

        }
    }
}

/*let ncp = require('ncp').ncp;

ncp.limit = 16;

setInterval(function () {
    ncp("../../Danganronpa 2 traduction FR/", "../../../Documents/", function (err) {
        if (err) {
            return console.error(err);
        }
        console.log('Backup of DR2 done');
    });
}, 60000 * 60 * 60 * 48);*/

/*net = require("net");

net.createServer((socket) => {
    //just added
    socket.on("error", (err) => {
            console.log("Caught flash policy server socket error: ");
            console.log(err.stack);
        }
    );

    socket.end();
}).listen(843);*/


// Login
client.login(bot_data.bot_values.bot_token).then(() => console.log('Logged in')).catch(console.error);
