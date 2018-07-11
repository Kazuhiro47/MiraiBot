const Discord = require('discord.js');
const bot_data = require('./bot_data.js');
const client = new Discord.Client();

let generalChannelMiraiTeam = undefined;
let testBotChanMT = undefined;

const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');

// file stream import
const fs = require('graceful-fs');
const check_xp = require("./functions/parsing_functions").check_xp;
const get_random_in_array = require("./functions/parsing_functions").get_random_in_array;
const check_message = require("./functions/parsing_functions").check_message;

// Initialize an instance of Enmap
const userProvider = new EnmapLevel({name: 'memberXP'});
client.memberXP = new Enmap({provider: userProvider});

const SDSE2Provider = new EnmapLevel({name: 'SDSE2Data'});
client.SDSE2Data = new Enmap({provider: SDSE2Provider});

const cooldownUserProvider = new EnmapLevel({name: 'userCooldown'});
client.userCooldown = new Enmap({provider: cooldownUserProvider});

const tradProvider = new EnmapLevel({name: 'trad'});
client.trad = new Enmap({provider: tradProvider});

let translationsStats = client.trad.get("stats");
if (!translationsStats) {
    client.trad.set("stats", {
        messages: []
    });
}

client.on('ready', () => {
    let Kazuhiro = client.users.find('id', '140033402681163776');
    generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");
    testBotChanMT = client.channels.find("id", "314122440420884480");
    Kazuhiro.send("El. Psy.. Kongroo.").catch(console.error);
    //analyseLogChan(new Discord.RichEmbed().setColor(bot_data.bot_values.bot_color).setDescription("~~désolé du fail d'avant~~"), testBotChanMT).catch(console.error);
});


// On message
client.on('message', message => {

    check_xp(client, message);
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
            set_monokuma_announcement();
        }

    }, 60000);
}

let monokuma_interval;

function set_monokuma_announcement() {

    let morning_done = false;
    let evening_done = false;
    let day_interval_done = false;

    clearInterval(minute_interval);

    monokuma_interval = setInterval(() => {

        if (evening_done && morning_done && day_interval_done) {
            clearInterval(monokuma_interval);
        }

        let date = new Date();
        let UTChour = (date.getUTCHours() + 2) % 24;

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

        if (UTChour === 0) {
            console.log("Day interval found");
            set_day_interval();
            day_interval_done = true;
        }

    }, 60000 * 60);
}

const monokumaImgs = [
    "https://vignette.wikia.nocookie.net/bloodbrothersgame/images/5/53/Monokuma.jpg/revision/latest/scale-to-width-down/640?cb=20131210191609",
    "https://vignette.wikia.nocookie.net/danganronpa/images/1/12/Monokuma_announcement.png/revision/latest?cb=20161220033639",
    "https://vignette.wikia.nocookie.net/danganronpa/images/1/16/Monokuma_announcement_DR2.png/revision/latest?cb=20161112051042",
    "http://2.bp.blogspot.com/-E5L7PG07qbk/U7zPtDHk_9I/AAAAAAAAAt4/UzoKWesIqWE/s1600/Danganronpa-Episode-07-Monokuma.jpg",
    "https://i.pinimg.com/236x/cc/c5/b1/ccc5b19b6d41e45d108e57433b5c4469.jpg",
    "https://lh3.googleusercontent.com/-Gohd89AiIjM/WgO_OZ5VfwI/AAAAAAAAAEw/Ro9esll7SoEMXhjgjU53oyKjv5MWgT1oQCJoC/w800-h800/Monokuma%2B5.jpg",
    "http://static.tumblr.com/c81445923f61afd3b42fc99273163785/xmdujc6/SrOmrch3o/tumblr_static_tumblr_mptvz4oifo1rnbh24o1_500.gif",
    "http://i.imgur.com/T5s569W.gif",
];

function set_morning_day_interval() {
    const generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");
    const creationDate = client.guilds.get('168673025460273152').createdAt;

    let morning_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
        .setColor(bot_data.bot_values.bot_color).addField(
            "Bonjour, tout le monde !",
            "Il est maintenant 7h du matin\n" +
            "et la période de nuit est officiellement terminée !\n" +
            "Il est l'heure de se lever !\n" +
            "\n" +
            "Préparez-vous à accueillir un autre jour meeeeerveilleux !"
        ).setImage(get_random_in_array(monokumaImgs));

    if (creationDate) {
        let days = (new Date().valueOf() - creationDate.valueOf()) / 1000 / 60 / 60 / 24;

        morning_message.setFooter(`Ainsi débute le jour ${days.toFixed(0)} à l'Académie du Pic de l'Espoir.`);
    }

    generalChannelMiraiTeam.send(morning_message).catch(console.error);

    setInterval(() => {

        morning_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
            .setColor(bot_data.bot_values.bot_color).addField(
                "Bonjour, tout le monde !",
                "Il est maintenant 7h du matin\n" +
                "et la période de nuit est officiellement terminée !\n" +
                "Il est l'heure de se lever !\n" +
                "\n" +
                "Préparez-vous à accueillir un autre jour meeeeerveilleux !"
            ).setImage(get_random_in_array(monokumaImgs));

        if (creationDate) {
            let days = (new Date().valueOf() - creationDate.valueOf()) / 1000 / 60 / 60 / 24;

            morning_message.setFooter(`Ainsi débute le jour ${days.toFixed(0)} à l'Académie du Pic de l'Espoir.`);
        }

        generalChannelMiraiTeam.send(morning_message).catch(console.error);

    }, 60000 * 60 * 24);
}

let find_user = (name) => {
    let usersArray = client.users.array();

    for (let i = 0 ; i < usersArray.length ; i++) {
        let user = usersArray[i];
        if (user.username.toLowerCase().trim().includes(name.toLowerCase().trim())) {
            return (user);
        }
    }
    return (null)
};

let analyseLogChan = async (messageEmbed, channel) => {
    const logTradChan = client.channels.find("id", "452118364161048576");

    if (logTradChan) {

        let firstMessage = await logTradChan.fetchMessages({limit: 1});
        let messagesFetched = await logTradChan.fetchMessages({limit: 100, before: firstMessage.first().id});
        let stats = {};
        const now = new Date();

        let checkIfMsgIsToday = (msg) => {
            return (msg.createdAt.getFullYear() === now.getFullYear() &&
                (msg.createdAt.getDate() === now.getDate() ||
                    (msg.createdAt.getDate() + 1 === now.getDate() && msg.createdAt.getHours() > now.getHours())) &&
                msg.createdAt.getMonth() === now.getMonth());
        };

        // check first message
        if (checkIfMsgIsToday(firstMessage.first())) {

            const messageContentArray = firstMessage.first().content.split(/ +/g);
            let user = find_user(messageContentArray[0]);

            if (!user) {
                let Kazuhiro = client.users.find('id', '140033402681163776');

                Kazuhiro.send(`L'utilisateur ${messageContentArray[0]} est introuvable`).catch(console.error);
            } else {

                if (!(user.id in stats)) {
                    stats[user.id] = 0;
                }

                if (messageContentArray.length === 7) {
                    stats[user.id] += 1 + parseInt(messageContentArray[4]);
                } else {
                    stats[user.id] += 1;
                }
            }
        }

        let checkIfArrayHasTodayTS = (msgArray) => {
            for (let i = 0; i < msgArray.length; i++) {
                if (msgArray[i].createdAt.getFullYear() === now.getFullYear() &&
                    (msgArray[i].createdAt.getDate() === now.getDate() ||
                        (msgArray[i].createdAt.getDate() + 1 === now.getDate() && msgArray[i].createdAt.getHours() > now.getHours())) &&
                    msgArray[i].createdAt.getMonth() === now.getMonth()) {
                    return true;
                }
            }
            return false;
        };

        while (messagesFetched.array().length > 0) {

            if (!checkIfArrayHasTodayTS(messagesFetched.array())) {
                break;
            }

            messagesFetched.array().forEach(msgFetched => {

                if (checkIfMsgIsToday(msgFetched)) {

                    const messageContentArray = msgFetched.content.split(/ +/g);
                    let user = find_user(messageContentArray[0]);

                    if (!user) {
                        let Kazuhiro = client.users.find('id', '140033402681163776');

                        Kazuhiro.send(`L'utilisateur ${messageContentArray[0]} est introuvable`).catch(console.error);
                    } else {

                        if (!(user.id in stats)) {
                            stats[user.id] = 0;
                        }

                        if (messageContentArray.length === 7) {
                            stats[user.id] += 1 + parseInt(messageContentArray[4]);
                        } else {
                            stats[user.id] += 1;
                        }
                    }
                }
            });

            messagesFetched = await logTradChan.fetchMessages({limit: 100, before: messagesFetched.last().id});
        }

        let findHighestTranslators = (statObj) => {

            if (Object.keys(statObj).length === 0) {
                return undefined;
            }

            let highest = Object.keys(statObj)[0];

            Object.keys(statObj).forEach(id => {
                if (statObj[id] > statObj[highest]) {
                    highest = id;
                }
            });
            return highest;
        };

        let bestTranslatorId = findHighestTranslators(stats);
        if (bestTranslatorId !== undefined) {
            let translator = client.users.find("id", bestTranslatorId);

            messageEmbed
                .addField("Monokuma nomine le traducteur du jour !", `Merci à **${translator.username}** pour sa contribution considérable aujourd'hui !\n${stats[bestTranslatorId]} répliques traduites ~`)
                .setImage(translator.avatarURL);
        }
    }
    channel.send(messageEmbed).catch(console.error);
};

function set_evening_interval() {

    const evening_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
        .setColor(bot_data.bot_values.bot_color).addField(
            "Mm, ahem, ceci est une annonce de l'école.",
            "Il est maintenant 22 h.\n" +
            "\n" +
            "Autrement dit, c'est officiellement la période de nuit.\n" +
            "Les salons discord vont bientôt être fermés, et y discuter à \n" +
            "partir de maintenant est strictement interdit.\n" +
            "Maintenant, faites de beaux rêves ! Le marchand de sable va bientôt passer..."
        ).setImage(get_random_in_array(monokumaImgs));

    generalChannelMiraiTeam.send(evening_message).catch(console.error);

    //analyseLogChan(evening_message, generalChannelMiraiTeam).catch(console.error);

    setInterval(() => {

        const evening_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
            .setColor(bot_data.bot_values.bot_color).addField(
                "Mm, ahem, ceci est une annonce de l'école.",
                "Il est maintenant 22 h.\n" +
                "\n" +
                "Autrement dit, c'est officiellement la période de nuit.\n" +
                "Les salons discord vont bientôt être fermés, et y discuter à \n" +
                "partir de maintenant est strictement interdit.\n" +
                "Maintenant, faites de beaux rêves ! Le marchand de sable va bientôt passer..."
            ).setImage(get_random_in_array(monokumaImgs));

        generalChannelMiraiTeam.send(evening_message).catch(console.error);
        //analyseLogChan(evening_message, generalChannelMiraiTeam).catch(console.error);

    }, 60000 * 60 * 24);

}

function set_day_interval() {
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

    console.log(`Hours[${(date.getUTCHours() + 2) % 24}], Minutes[${date.getUTCMinutes() % 60}]`);
    if ((date.getUTCHours() + 2) % 24 === 0 && date.getMinutes() % 60 === 0) {
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
                            generalChannelMiraiTeam.send(new Discord.RichEmbed()
                                .setAuthor(client.users.get(birthDay.id).username, client.users.get(birthDay.id).avatarURL)
                                .setImage('https://orig08.deviantart.net/3c26/f/2016/167/b/b/mono3_by_bootsii-da6fs8o.gif')
                                .setDescription(`C'est l'anniversaire de <@${birthDay.id}> !`)).catch(console.error);
                        }
                    });

                    obj.dr_anniversaires.forEach(birthDay => {
                        if (birthDay.day === day && birthDay.month === month) {
                            generalChannelMiraiTeam.send(`C'est l'anniversaire de ${birthDay.name} !\nhttps://orig08.deviantart.net/3c26/f/2016/167/b/b/mono3_by_bootsii-da6fs8o.gif`);
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
client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Logged In");
}).catch(console.error);
