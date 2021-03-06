const Discord = require('discord.js');
const bot_data = require('./bot_data.js');
const processFcts = require('./functions/check_process.js');
const client = new Discord.Client();
const mysql = require('promise-mysql');

// UTC + 2 or UTC + 1
const UTC_LOCAL_TIMESHIFT = 1;

let generalChannelMiraiTeam = undefined;
let testBotChanMT = undefined;

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
let miraiTeam = undefined;

let updateMiraiTeamDB = async (miraiTeam, conn) => {
    await conn.beginTransaction();
    let j = 0;

    try {
        let membersArray = miraiTeam.members.array();
        for (let i = 0 ; i < membersArray.length ; i++) {
            let member = membersArray[i];
            let req = await conn.query(
                'SELECT * FROM mirai_team_log.server_member WHERE member_id = ?',
                [member.id]
            );
            if (req.length === 0) {
                await conn.query(
                    'INSERT INTO mirai_team_log.server_member (member_id, avatarURL, name) VALUES (?, ?, ?)',
                    [member.id, member.user.avatarURL, member.user.username]
                );
            }
            j += 1;
        }

        let channelsArray = miraiTeam.channels.array();
        for (let i = 0 ; i < channelsArray.length ; i++) {
            let channel = channelsArray[i];
            let req = await conn.query(
                'SELECT * FROM mirai_team_log.server_channel WHERE channel_id = ?',
                [channel.id]
            );
            if (req.length === 0) {
                await conn.query(
                    'INSERT INTO mirai_team_log.server_channel (channel_id, name) VALUES (?, ?)',
                    [channel.id, channel.name]
                );
            }
            j += 1;
        }
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    }

    return j;
};

client.on('ready', () => {
    Kazuhiro = client.users.get('140033402681163776');
    generalChannelMiraiTeam = client.channels.get("168673025460273152");
    testBotChanMT = client.channels.get("314122440420884480");
    Kazuhiro.send("El. Psy.. Kongroo.").catch(console.error);

    /*mysql.createConnection({
        host: 'amadeusdb.cirn3jnlkw1k.eu-west-3.rds.amazonaws.com',
        user: 'amadeus',
        password: 'zqsesdswxdxcplmplm11037',
        port: 3306,
        connectTimeout: 60000
    }).then(conn => {
        client.db = conn;

        miraiTeam = client.guilds.get('168673025460273152');

        updateMiraiTeamDB(miraiTeam, conn).then(res => console.log(`${res} elements updated`)).catch(console.error);

        //const registerAllLogs = require("./registerLogs");
        //registerAllLogs(client).then(() => console.log('OKOK')).catch(console.error);

        console.log('Mysql Database connected');
        Kazuhiro.send('Mysql Database connected').catch(console.error);
    }).catch(err => {
        console.error(err);
    });*/

    try {
        //initTwitterListener(generalChannelMiraiTeam, Kazuhiro);
    } catch (e) {
        console.error(e);
    }

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

    /*const bot_rooms = ['bot_room', 'test_bot'];

    if (message.guild && message.guild.id === bot_data.mirai_team_gid && !bot_rooms.includes(message.channel.name)  && message.author.bot) {
        message.delete().then(msg => {
            Kazuhiro.send(msg).catch(console.error);
        }).catch(console.error);
    }*/

    //check_xp(client, message).catch(console.error);
    //check_message(client, message);

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(bot_data.bot_values.bot_prefix)) {
        return;
    }

    let date = new Date();

    console.log(`Command: ${command}`);

    if (command === "sdse2") {

        try {
            let commandFile = require(`./commands/${command}.js`);

            commandFile.run(client, message, args);
        } catch (e) {
            console.error(e);
        }

        return;
    }

    const freeCmds = ['ah'];

    try {

        let commandFile = require(`./global_commands/${command}.js`);

        console.log(`${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours() + UTC_LOCAL_TIMESHIFT}h${date.getUTCMinutes()}m${date.getUTCSeconds()}s | ${message.guild} | ${message.channel.name} | ${message.author.username} : ${message.cleanContent}`);

        if (message.guild && message.guild.id === bot_data.mirai_team_gid && message.channel.name !== "bot_room" && message.member && !message.member.hasPermission('BAN_MEMBERS') && !freeCmds.includes(command)) {
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

                if (command !== "sdse2" && message.channel.name !== "bot_room" && message.member && !message.member.hasPermission('BAN_MEMBERS') && !freeCmds.includes(command)) {
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

let set_minute_interval = () => {
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
};

let set_hour_interval = () => {

    /*setInterval(() => {

    }, 60000 * 60);*/

};

let monokuma_interval;

let set_monokuma_announcement = () => {

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
};

const monokumaImgs = [
    "https://vignette.wikia.nocookie.net/bloodbrothersgame/images/5/53/Monokuma.jpg/revision/latest/scale-to-width-down/640?cb=20131210191609",
    "https://vignette.wikia.nocookie.net/danganronpa/images/1/12/Monokuma_announcement.png/revision/latest?cb=20161220033639",
    "https://vignette.wikia.nocookie.net/danganronpa/images/1/16/Monokuma_announcement_DR2.png/revision/latest?cb=20161112051042",
    "http://2.bp.blogspot.com/-E5L7PG07qbk/U7zPtDHk_9I/AAAAAAAAAt4/UzoKWesIqWE/s1600/Danganronpa-Episode-07-Monokuma.jpg",
    "https://i.pinimg.com/236x/cc/c5/b1/ccc5b19b6d41e45d108e57433b5c4469.jpg",
    "https://lh3.googleusercontent.com/-Gohd89AiIjM/WgO_OZ5VfwI/AAAAAAAAAEw/Ro9esll7SoEMXhjgjU53oyKjv5MWgT1oQCJoC/w800-h800/Monokuma%2B5.jpg",
    "http://i.imgur.com/T5s569W.gif",
    "https://i.imgur.com/K14wGy5.jpg?1",
    "https://i.imgur.com/aH1xD9S.gif"
];

const quotes = [
    "La nature fait les hommes semblables, la vie les rend différents.",
    "Chercher à comprendre les questions est plus intéressant que de chercher à connaître les réponses.",
    "Celui qui ne progresse pas chaque jour, recule chaque jour.",
    "Une petite impatience ruine un grand projet.",
    "Apprendre sans réfléchir est vain. Réfléchir sans apprendre est dangereux.",
    "Commencez par faire ce qui est nécessaire ; puis faites ce qui est possible ; et soudain vous faites l'impossible.",
    "Les professeurs ouvrent la porte, mais vous devez entrer par vous-même.",
    "Le seigneur est le bateau, les gens ordinaires l'eau : l'eau porte le bateau ou le fait chavirer.",
    "Chaumière où l'on rit vaut mieux que palais où l'on pleure.",
    "L'archer est un modèle pour le sage; quand il a manqué le centre de la cible, il s'en prend à lui-même.",
    "Ne craignez pas d’être lent, craignez seulement d’être à l’arrêt.",
    "Il suffit qu'un homme avisé entende une chose pour en apprendre dix.",
];

let set_morning_day_interval = () => {
    const generalChannelMiraiTeam = client.channels.get("168673025460273152");
    const creationDate = client.guilds.get('168673025460273152').createdAt;

    let morning_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
        .setColor(bot_data.bot_values.bot_color).addField(
            "Bonjour, tout le monde !",
            "Il est maintenant 7h du matin\n" +
            "et la période de nuit est officiellement terminée !\n" +
            "Il est l'heure de se lever !\n" +
            "\n" +
            "Préparez-vous à accueillir un autre jour meeeeerveilleux !"
        ).setFooter(get_random_in_array(quotes)).setImage(get_random_in_array(monokumaImgs));

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
};

const GachaAI = require("./functions/mirai_bot_ai");
const gachaChannel = client.channels.get('504626600286093312');

let set_evening_interval = () => {


    const evening_message = new Discord.RichEmbed().setAuthor("Monokuma", "https://vignette.wikia.nocookie.net/danganronpa/images/c/c6/Strikes_Back.jpg/revision/latest?cb=20161029022327")
        .setColor(bot_data.bot_values.bot_color).addField(
            "Mm, ahem, ceci est une annonce de l'école.",
            "Il est maintenant 22 h.\n" +
            "\n" +
            "Autrement dit, c'est officiellement la période de nuit.\n" +
            "Les salons discord vont bientôt être fermés, et y discuter à \n" +
            "partir de maintenant est strictement interdit.\n" +
            "Maintenant, faites de beaux rêves ! Le marchand de sable va bientôt passer..."
        ).setImage(get_random_in_array(monokumaImgs)).addField("Citation du jour", get_random_in_array(quotes));

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
            ).setImage(get_random_in_array(monokumaImgs)).addField("Citation du jour", get_random_in_array(quotes));

        generalChannelMiraiTeam.send(evening_message).catch(console.error);

        Wait.minutes(Math.floor(Math.random() * 60))
            .then(() => new GachaAI(300, gachaChannel).doSomething())
            .then(() => {
                if (gachaChannel) gachaChannel.stopTyping(true);
            })
            .catch(console.error);

        //analyseLogChan(evening_message, generalChannelMiraiTeam).catch(console.error);

    }, 60000 * 60 * 24);

};

let set_day_interval = () => {
    check_birthday();
    setInterval(function () {
        check_birthday();
    }, 60000 * 60 * 24);
};

let check_birthday = () => {
    let date = new Date();
    const generalChannelMiraiTeam = client.channels.get("168673025460273152");
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
};


// Login
client.login(bot_data.bot_values.bot_token).then(() => {
    console.log("Logged In");
}).catch(console.error);
