const Discord = require('discord.js');
const bot_data = require('./bot_data.js');
const processFcts = require('./functions/check_process.js');
const client = new Discord.Client();

const typingSpeed = 0.2840909090909091;

// UTC + 2 or UTC + 1
const UTC_LOCAL_TIMESHIFT = 2;

let generalChannelMiraiTeam = undefined;
let testBotChanMT = undefined;
let danganronpaNewsChan = undefined;

const Enmap = require("enmap");
const EnmapLevel = require('enmap-level');

// file stream import
const fs = require('graceful-fs');
const Wait = require("./functions/wait").Wait;
const initTwitterListener = require("./functions/twitter").initTwitterListener;
const check_xp = require("./functions/parsing_functions").check_xp;
const get_random_in_array = require("./functions/parsing_functions").get_random_in_array;
const check_message = require("./functions/parsing_functions").check_message;

// Initialize an instance of Enmap
const userProvider = new EnmapLevel({name: 'memberXP'});
client.memberXP = new Enmap({provider: userProvider});

const SDSE2Provider = new EnmapLevel({name: 'SDSE2Data'});
client.SDSE2Data = new Enmap({provider: SDSE2Provider});

const userstat = new EnmapLevel({name: 'userstat'});
client.userstat = new Enmap({provider: userstat});

const gSettings = new EnmapLevel({name: "gSettings"});
client.gSettings = new Enmap({provider: gSettings});

const LG = new EnmapLevel({name: "LG"});
client.LG = new Enmap({provider: LG});

const moderationData = new EnmapLevel({name: 'moderationData'});
client.moderationData = new Enmap({provider: moderationData});

let Kazuhiro = undefined;

client.on('ready', () => {
    Kazuhiro = client.users.find('id', '140033402681163776');
    generalChannelMiraiTeam = client.channels.find("id", "168673025460273152");
    testBotChanMT = client.channels.find("id", "314122440420884480");
    Kazuhiro.send("El. Psy.. Kongroo.").catch(console.error);

    processFcts.processIsRunning("dropbox.exe").then(status => {
        if (!status) {
            processFcts.runDropbox().catch(console.error);
            Kazuhiro.send("Launching dropbox").catch(console.error);
        }
    }).catch(console.error);

    try {
        initTwitterListener(generalChannelMiraiTeam, Kazuhiro);
    } catch (e) {
        console.error(e);
    }

    //analyseLogChan(new Discord.RichEmbed().setColor(bot_data.bot_values.bot_color).setDescription("~~désolé du fail d'avant~~"), testBotChanMT).catch(console.error);
});

client.on('error', err => {
    console.error(err);
});

client.on('disconnect', event => {
    console.error(event);
});

client.on('resume', (nb) => {
    console.info(`Connection resumed. Replayed: ${nb}`);
});

// On message
client.on('message', message => {

    //console.log(`${message.channel.name} | ${message.author.username} : ${message.cleanContent}`);

    check_xp(client, message);
    check_message(client, message);

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(bot_data.bot_values.bot_prefix)) {
        return;
    }

    let date = new Date();

    console.log(`Command: ${command}`);

    try {

        let commandFile = require(`./global_commands/${command}.js`);

        console.log(`${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours() + UTC_LOCAL_TIMESHIFT}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s | ${message.guild} | ${message.channel.name} | ${message.author.username} : ${message.cleanContent}`);

        if (message.guild && message.guild.id === bot_data.mirai_team_gid && message.channel.name !== "bot_room" && message.member && !message.member.hasPermission('BAN_MEMBERS')) {
            message.member.send("Le bot n'est utilisable que dans le channel #bot_room\nton message : " + message.cleanContent).catch(console.error);
            message.delete().catch(console.error);
            return;
        }

        commandFile.run(client, message, args);

    } catch (err) {
        if (err.code !== "MODULE_NOT_FOUND") {
            console.error(err);
        } else if (message.guild && message.guild.id === bot_data.mirai_team_gid) {
            try {

                let commandFile = require(`./commands/${command}.js`);

                console.log(`${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours() + UTC_LOCAL_TIMESHIFT}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s | ${message.guild} | ${message.channel.name} | ${message.author.username} : ${message.cleanContent}`);

                if (command !== "sdse2" && message.channel.name !== "bot_room" && message.member && !message.member.hasPermission('BAN_MEMBERS')) {
                    message.member.send("Le bot n'est utilisable que dans le channel #bot_room\nton message : " + message.cleanContent).catch(console.error);
                    message.delete().catch(console.error);
                    return;
                }

                commandFile.run(client, message, args);

            } catch (err) {
                if (err.code !== "MODULE_NOT_FOUND") {
                    console.error(err);
                }
            }
        }
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

let set_hour_interval = () => {

    processFcts.processIsRunning("dropbox.exe").then(status => {
        if (!status) {
            processFcts.runDropbox().catch(console.error);
            Kazuhiro.send("Launching dropbox").catch(console.error);
        }
    }).catch(console.error);

    setInterval(() => {

        processFcts.processIsRunning("dropbox.exe").then(status => {
            if (!status) {
                processFcts.runDropbox().catch(console.error);
                Kazuhiro.send("Launching dropbox").catch(console.error);
            }
        }).catch(console.error);

    }, 60000 * 60);

};

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
        let UTChour = (date.getUTCHours() + UTC_LOCAL_TIMESHIFT) % 24;

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

        generalChannelMiraiTeam.startTyping();
        Wait.minutes(12)
            .then(() => Wait.seconds(typingSpeed * "Utilisons le gacha !!".length))
            .then(() => generalChannelMiraiTeam.send("Utilisons le gacha !!"))
            .then(() => {generalChannelMiraiTeam.stopTyping(); return Wait.seconds(1)})
            .then(() => {generalChannelMiraiTeam.startTyping(); return Wait.seconds(typingSpeed * "<gacha daily".length)})
            .then(() => generalChannelMiraiTeam.send("<gacha daily"))
            .then(() => Wait.seconds(3))
            .then(() => generalChannelMiraiTeam.send("Nice"))
            .then(() => {generalChannelMiraiTeam.stopTyping(); return Wait.seconds(1)})
            .catch(console.error);

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

    console.log(`Hours[${(date.getUTCHours() + UTC_LOCAL_TIMESHIFT) % 24}], Minutes[${date.getUTCMinutes() % 60}]`);
    if ((date.getUTCHours() + UTC_LOCAL_TIMESHIFT) % 24 === 0 && date.getMinutes() % 60 === 0) {

        if (day === 22 && month === 7) {
            generalChannelMiraiTeam.send(new Discord.RichEmbed().setColor([255, 137, 237])
                .setAuthor("Nico Yazawa", "https://vignette.wikia.nocookie.net/love-live/images/7/7b/S2Ep04_00303.png/revision/latest?cb=20140501113619")
                .addField("C'est l'anniversaire de NICO YAZAWA !", "NICO NICO NII !")
                .setImage("http://images6.fanpop.com/image/photos/40000000/Nico-Yazawa-nico-yazawa-40094465-810-456.jpg")
                .setThumbnail("https://ih0.redbubble.net/image.438189845.6698/raf,750x1000,075,t,fafafa:ca443f4786.jpg")
            ).catch(console.error);
        }

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
