const Discord = require('discord.js');
const bot_data = require('./bot_data.js');
const client = new Discord.Client();

const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');

// file stream import
const fs = require('graceful-fs');
const check_xp = require("./functions/parsing_functions").check_xp;
const check_message = require("./functions/parsing_functions").check_message;

// Initialize an instance of Enmap
const userProvider = new EnmapLevel({name: 'memberXP'});
client.memberXP = new Enmap({provider: userProvider});

const cooldownUserProvider = new EnmapLevel({name: 'userCooldown'});
client.userCooldown = new Enmap({provider: cooldownUserProvider});

client.on('ready', () => {

});


// On message
client.on('message', message => {

    check_message(message);
    check_xp(client, message);

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
            set_monokuma_announcement();
            set_hour_interval();
        }

    }, 60000);
}

let monokuma_interval;

function set_monokuma_announcement() {

    let morning_done = false;
    let evening_done = false;

    monokuma_interval = setInterval(() => {

        if (evening_done && morning_done) {
            clearInterval(monokuma_interval);
        }

        let date = new Date();
        let UTChour = date.getUTCHours() + 2;

        if (UTChour === 7) {
            console.log("Morning interval found");
            set_morning_day_interval();
            morning_done = true;
        }

        if (UTChour === 22) {
            console.log("Evening interval found");
            set_evening_interval();
            evening_done = true;
        }

    }, 60000 * 60);
}

function set_morning_day_interval() {
    const generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");

    generalChannelMiraiTeam.send("Bonjour, tout le monde ! Il est maintenant 7h du matin\n" +
        "et la période de nuit est officiellement terminée !\n" +
        "Il est l'heure de se lever !\n" +
        "\n" +
        "Préparez-vous à accueillir un autre jour meeeeerveilleux !").catch(console.error);

    setInterval(() => {


        generalChannelMiraiTeam.send("Bonjour, tout le monde ! Il est maintenant 7h du matin\n" +
            "et la période de nuit est officiellement terminée !\n" +
            "Il est l'heure de se lever !\n" +
            "\n" +
            "Préparez-vous à accueillir un autre jour meeeeerveilleux !").catch(console.error);

    }, 60000 * 60 * 24);
}

function set_evening_interval() {
    const generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");

    generalChannelMiraiTeam.send("Mm, ahem, ceci est une annonce du serveur.\n" +
        "Il est maintenant 22h.\n" +
        "\n" +
        "Autrement dit, c'est officiellement la période de nuit.\n" +
        "Les salons discord vont bientôt être fermés, et y discuter à \n" +
        "partir de maintenant est strictement interdit.\n" +
        "Maintenant... faîtes de beaux rêves ! Bonne nuit, dormez\n" +
        "profondément, ne laissez pas les punaises vous mordre...").catch(console.error);

    setInterval(() => {


        generalChannelMiraiTeam.send("Mm, ahem, ceci est une annonce du serveur.\n" +
            "Il est maintenant 22h.\n" +
            "\n" +
            "Autrement dit, c'est officiellement la période de nuit.\n" +
            "Les salons discord vont bientôt être fermés, et y discuter à \n" +
            "partir de maintenant est strictement interdit.\n" +
            "Maintenant... faîtes de beaux rêves ! Bonne nuit, dormez\n" +
            "profondément, ne laissez pas les punaises vous mordre...").catch(console.error);

    }, 60000 * 60 * 24);

}

let hour_interval;

function set_hour_interval() {
    clearInterval(minute_interval);
    check_birthday();
    hour_interval = setInterval(function () {

        let date = new Date();
        let UTChour = date.getUTCHours() + 2;

        if (UTChour === 0) {
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

    if (((date.getUTCHours() + 2) % 24 === 0 && date.getUTCMinutes() === 0)) {
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

                    obj.dr_anniversaires.forEach(birthDay => {
                        if (birthDay.day === day && birthDay.month === month) {
                            generalChannelMiraiTeam.send(`C'est l'anniversaire de ${birthDay.name} !`);
                            /*let danganronpa_characters = require("danganronpa_characters.js");
                            let dataBirth = danganronpa_characters[birthDay.name];
                            generalChannelMiraiTeam.send(
                                new Discord.RichEmbed()
                                    .setAuthor(`Anniversaire de ${birthDay.name}`, dataBirth.avatar)
                                    .setTitle(birthDay.name)
                                    .setDescription(dataBirth.description)
                                    .addField("Nom Japonais", dataBirth.japaneseName, true)
                                    .addField("Talent", dataBirth.talent, true)
                                    .addField("Aime", dataBirth.likes, true)
                                    .addField("N'aime pas", dataBirth.dislikes, true)
                                    .setImage(dataBirth.image)
                                    .setFooter(`Né(e) le ${day} `)
                            ).catch(console.error);*/
                        }
                    })

                }
            });

        }
    }
}


// Login
client.login(bot_data.bot_values.bot_token).then(() => console.log('Logged in')).catch(console.error);
