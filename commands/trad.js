let fs = require('graceful-fs');
const Discord = require('discord.js');
const analyseLogChan = require("../functions/analyse_channel").analyseLogChan;
const DanganronpaTranslation = require("../functions/translation_statistics").DanganronpaTranslation;
const getrevsPromise = require("../functions/dropbox").getrevsPromise;
const get_file_data = require("../functions/dropbox").get_file_data;
const RichEmbed = require("discord.js").RichEmbed;
const get_revisions = require("../functions/dropbox").get_revisions;
const get_random_index = require("../functions/parsing_functions").get_random_index;
const write_to_file = require("../functions/write_json").write_to_file;
const https = require("https");
const bot_data = require("../bot_data.js");
const utils = require("../functions/utils");
const TerminologySubMenu = require("../functions/sdse_utils").TerminologySubMenu;

class TranslationStatus {

    constructor(client, message) {

        this.client = client;
        this.message = message;

        return this;
    }

}

Array.prototype.unique = function () {
    return Array.from(new Set(this));
};

class DR2Translation extends TranslationStatus {

    constructor(client, message) {
        super(client, message);

        this.path = "../../../Dropbox/Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";
        this.path2 = "../../../Dropbox/Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/";

        this.part = {
            "System Text": [0, 0],
            "Prologue": [0, 0],
            "Chapitre 1": [0, 0],
            "Chapitre 2": [0, 0],
            "Chapitre 3": [0, 0],
            "Chapitre 4": [0, 0],
            "Chapitre 5": [0, 0],
            "Chapitre 6": [0, 0],
            "Epilogue": [0, 0],
            "FTE": [0, 0],
            "Dangan Island": [0, 0],
            "MAP": [0, 0],
            "Logic Dive": [0, 0],
            "Contre Attaque Ballistique": [0, 0],
            "Danganronpa IF": [0, 0],
            "Autre": [0, 0]
        };

        this.global = 0;
        this.global_total = 0;

        return this;
    }

    recurrentTranslation() {
        let terminology = new TerminologySubMenu(this.message.channel, this.message.author);
        terminology.launchMenu().catch(console.error);
    }

    get_section(file_dir, name = false) {
        if (file_dir[2] === '_') {
            if (name)
                return "System Text";
            else
                return this.part["System Text"];
            //console.log(`dir : ${file_dir} = System Text`);
        } else if (file_dir.startsWith('e00_') || file_dir.startsWith("script_pak_e00")) {
            if (name)
                return "Prologue";
            else
                return this.part["Prologue"];
            //console.log(`dir : ${file_dir} = Prologue`);
        } else if (file_dir.startsWith('e01_') || file_dir.startsWith("script_pak_e01")) {
            if (name)
                return "Chapitre 1";
            else
                return this.part["Chapitre 1"];
            //console.log(`dir : ${file_dir} = Chapitre 1`);
        } else if (file_dir.startsWith('e02_') || file_dir.startsWith("script_pak_e02")) {
            if (name)
                return "Chapitre 2";
            else
                return this.part["Chapitre 2"];
            //console.log(`dir : ${file_dir} = Chapitre 2`);
        } else if (file_dir.startsWith('e03_') || file_dir.startsWith("script_pak_e03")) {
            if (name)
                return "Chapitre 3";
            else
                return this.part["Chapitre 3"];
            //console.log(`dir : ${file_dir} = Chapitre 3`);
        } else if (file_dir.startsWith('e04_') || file_dir.startsWith("script_pak_e04")) {
            if (name)
                return "Chapitre 4";
            else
                return this.part["Chapitre 4"];
            //console.log(`dir : ${file_dir} = Chapitre 4`);
        } else if (file_dir.startsWith('e05_') || file_dir.startsWith("script_pak_e05")) {
            if (name)
                return "Chapitre 5";
            else
                return this.part["Chapitre 5"];
            //console.log(`dir : ${file_dir} = Chapitre 5`);
        } else if (file_dir.startsWith('e06_') || file_dir.startsWith("script_pak_e06")) {
            if (name)
                return "Chapitre 6";
            else
                return this.part["Chapitre 6"];
            //console.log(`dir : ${file_dir} = Chapitre 6`);
        } else if (file_dir.startsWith('e07_') || file_dir.startsWith("script_pak_e07")) {
            if (name)
                return "Epilogue";
            else
                return this.part["Epilogue"];
            //console.log(`dir : ${file_dir} = Epilogue`);
        } else if (file_dir.startsWith('e08_') || file_dir.startsWith("script_pak_e08")) {
            if (name)
                return "FTE";
            else
                return this.part["FTE"];
            //console.log(`dir : ${file_dir} = FTE`);
        } else if (file_dir.startsWith('e09_') || file_dir.startsWith("script_pak_e09")) {
            if (name)
                return "Dangan Island";
            else
                return this.part["Dangan Island"];
        } else if (file_dir.startsWith("MAP_")) {
            if (name)
                return "MAP";
            else
                return this.part["MAP"];
        } else if (file_dir.startsWith("ldive_s")) {
            if (name)
                return "Logic Dive";
            else
                return this.part["Logic Dive"];
        } else if (file_dir.startsWith("mtb_s")) {
            if (name)
                return "Contre Attaque Ballistique";
            else
                return this.part["Contre Attaque Ballistique"];
        } else if (file_dir.startsWith("novel_") || file_dir.startsWith("script_pak_novel")) {
            if (name)
                return "Danganronpa IF";
            else
                return this.part["Danganronpa IF"];
        } else {
            return "Contre Attaque Ballistique";
        }
    }

    get_section2(DirName) {
        if (DirName.indexOf("e00") !== -1)
            return "Prologue";
        else if (DirName.indexOf("e01") !== -1)
            return "Chapitre 1";
        else if (DirName.indexOf("e02") !== -1)
            return "Chapitre 2";
        else if (DirName.indexOf("e03") !== -1)
            return "Chapitre 3";
        else if (DirName.indexOf("e04") !== -1)
            return "Chapitre 4";
        else if (DirName.indexOf("e05") !== -1)
            return "Chapitre 5";
        else if (DirName.indexOf("e06") !== -1)
            return "Chapitre 6";
        else if (DirName.indexOf("e07") !== -1)
            return "Epilogue";
        else if (DirName.indexOf("e08") !== -1)
            return "FTE";
        else if (DirName.indexOf("e09") !== -1)
            return "Dangan Island";
        else if (DirName.indexOf("novel") !== -1)
            return "Danganronpa IF";
        else
            return "Autre";
    }

    async read_single_folder(path, file_dir, avancement = true) {

        let files = await utils.readFolder(path + '/' + file_dir);
        let section = this.get_section(file_dir, true);

        await utils.asyncForEach(files, async directory_or_txt => {

            if (directory_or_txt.endsWith(".txt")) {

                if (avancement) {
                    let data = await get_file_data(`${path}/${file_dir}/${directory_or_txt}`);

                    if (data === undefined) {
                        console.log(`Couldn't read.`);
                        return;
                    }
                    if (data.includes(`<text lang="en">`)) {
                        this.part[section][0] += 1;
                        this.global += 1;
                    }
                    try {
                        this.part[section][1] += 1;
                    } catch (err) {
                        console.error(section);
                        return;
                    }
                    this.global_total += 1;
                }

            } else if (directory_or_txt.startsWith("script_pak_")) {

                let files = utils.readFolder(path + '/' + file_dir + '/' + directory_or_txt);

                await utils.asyncForEach(files, async (text_file) => {

                    let data = await get_file_data(`${path}/${file_dir}/${directory_or_txt}/${text_file}`);

                    if (data === undefined) {
                        console.log(`Couldn't read.`);
                        return;
                    }
                    if (data.includes(`<text lang="en">`)) {
                        this.part[section][0] += 1;
                        this.global += 1;
                    }
                    try {
                        this.part[section][1] += 1;
                    } catch (err) {
                        console.error(section);
                        return;
                    }
                    this.global_total += 1;
                });
            }

        });

    }

    readDirectory(path, encoding) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, encoding, (err, files) => {
                if (err) reject(err);
                resolve(files);
            });
        });
    }

    async avancement2() {

        let msg = await this.message.channel.send("Analyse des fichiers en cours...");

        let allTxtFiles = await new utils.Walk(this.path2, ".txt").on();

        allTxtFiles = allTxtFiles.unique();


        let j = 5;

        await utils.asyncForEach(allTxtFiles, async (txtFile, i) => {

            if (txtFile === null) return;

            if (i / allTxtFiles.length * 100 > j) {
                msg.edit(`${j}% des fichiers analysés`).catch(console.error);
                j += 5;
            }

            let section = this.get_section2(txtFile);
            let data = await get_file_data(txtFile);

            if (data === undefined) {
                console.log(`Couldn't read.`);
                return;
            }
            if (data.includes(`<text lang="en">`) || data.includes("<text lang=\"ja\" />") || data.includes("<text lang=\"ja\"></text>")) {
                this.part[section][0] += 1;
                this.global += 1;
            }
            try {
                this.part[section][1] += 1;
            } catch (err) {
                console.error(section);
                return;
            }
            this.global_total += 1;

        });

        msg.delete().catch(console.error);
        this.print_translation_status();

    }

    async avancement() {

        let msg = await this.message.channel.send("Analyse des fichiers en cours...");

        let files = await this.readDirectory(this.path, "utf8");

        let j = 10;
        for (let i = 0; i < files.length; i++) {
            if (i / files.length * 100 > j) {
                msg.edit(`${j}% des fichiers analysés`).catch(console.error);
                j += 10;
            }
            await this.read_single_folder(this.path, files[i], true);
        }


        msg.delete().catch(console.error);
        this.print_translation_status();

    }

    print_translation_status() {
        let avancement = new Discord.RichEmbed();

        avancement.setColor(this.message.guild.me.displayColor);
        avancement.setDescription("Avancement de la traduction sur Super Danganronpa 2");
        avancement.setTitle("Super Danganronpa 2");
        avancement.setImage("https://caneandrinse.com/wp-content/uploads/2017/05/tropicalisland2.jpg");

        let percentage;
        Object.keys(this.part).forEach(single_part => {
            percentage = (Math.round((this.part[single_part][0] / this.part[single_part][1] * 100) * 100) / 100).toFixed(2);

            if (this.part[single_part][1] === 0) {
                return;
            }

            avancement.addField(single_part, `${this.part[single_part][0]} / ${this.part[single_part][1]} répliques (**${percentage}%**)`, true);
        });

        percentage = (Math.round((this.global / this.global_total * 100) * 100) / 100).toFixed(2);
        avancement.addField(`**Avancement global**`, `${this.global} / ${this.global_total} répliques (**${percentage}%**)`);

        this.message.channel.send(avancement).catch(console.error);
        let requestLink = "https://api.thingspeak.com/update?api_key=0WSSEJIK6I2EVHTX&field1=" + percentage;
        https.get(requestLink, null);

    }

    getTranslation(command) {
        let section;
        let file_dir = `/Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script/${command[2]}`;

        fs.access(`../../${file_dir}`, (err) => {
            if (err) {
                console.log(`../../${file_dir}`);
                this.message.channel.send('Fichier introuvable.').catch(console.error);
                return;
            }

            if (file_dir[2] === '_') {
                section = "System Text";
            } else if (file_dir.match(/e00_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e00")) {
                section = "Prologue";
            } else if (file_dir.match(/e01_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e01")) {
                section = "Chapitre 1";
            } else if (file_dir.match(/e02_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e02")) {
                section = "Chapitre 2";
                //console.log(`dir : ${file_dir} = Chapitre 2`);
            } else if (file_dir.match(/e03_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e03")) {
                section = "Chapitre 3";
                //console.log(`dir : ${file_dir} = Chapitre 3`);
            } else if (file_dir.match(/e04_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e04")) {
                section = "Chapitre 4";
                //console.log(`dir : ${file_dir} = Chapitre 4`);
            } else if (file_dir.match(/e05_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e05")) {
                section = "Chapitre 5";
                //console.log(`dir : ${file_dir} = Chapitre 5`);
            } else if (file_dir.match(/e06_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e06")) {
                section = "Chapitre 6";
                //console.log(`dir : ${file_dir} = Chapitre 6`);
            } else if (file_dir.match(/e07_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e07")) {
                section = "Epilogue";
                //console.log(`dir : ${file_dir} = Epilogue`);
            } else if (file_dir.match(/e08_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e08")) {
                section = "FTE";
                //console.log(`dir : ${file_dir} = FTE`);
            } else if (file_dir.match(/e09_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e09")) {
                section = "Dangan Island";
                //console.log(`dir : ${file_dir} = Dangan Island`);
            } else if (file_dir.startsWith("MAP_")) {
                section = "MAP";
                //console.log(`dir : ${file_dir} = Map`);
            } else if (file_dir.startsWith("ldive_s")) {
                section = "Logic Dive";
                //console.log(`dir : ${file_dir} = Logic Dive`);
            } else if (file_dir.startsWith("mtb_s")) {
                section = "Contre Attaque Ballistique";
                //console.log(`dir : ${file_dir} = Contre Attaque Ballistique`);
            } else if (file_dir.startsWith("novel_") || file_dir.startsWith("script_pak_novel")) {
                section = "Danganronpa IF";
                //console.log(`dir : ${file_dir} = Danganronpa IF`);
            }

            get_revisions(file_dir, (err, revisions) => {
                if (err) return;

                let msg = new RichEmbed();
                msg.setAuthor(revisions[0].fileName, message.guild.me.user.avatarURL);
                msg.setTitle(`**${section}** - ${revisions[0].fileName}`);
                msg.setColor(message.guild.me.displayColor);
                msg.setDescription(file_dir);
                revisions.forEach(revision => {
                    msg.addField(`Modifié le ${revision.date} par ${revision.modifier_name.name}.`, revision.data);
                });
                this.message.channel.send(msg);
            });

        });
    }

    getRandom() {
        fs.readdir(this.path, (err, files) => {
            if (err) {
                this.message.channel.send("L'analyse des dossiers a échoué.").catch(console.error);
                return;
            }

            let dirPromises = [];

            files.forEach(file_dir => {

                dirPromises.push(this.read_single_folder(this.path, file_dir, this.part, false));

            });

            Promise.all(dirPromises).then(arrayOfArrayOfFiles => {

                let files = [];
                arrayOfArrayOfFiles.forEach(array => {

                    files = files.concat(array);

                });

                let randomTrad = files[get_random_index(files)];

                function find_trad(randomTrad) {
                    get_file_data(randomTrad.path).then((data) => {
                        let ignore = [
                            '...', 'Yes', 'No', 'Not really...', 'Outside',
                            'See who else is around', 'Leave here?', 'Cancel', 'Definitely!'
                        ];
                        data = data.toString();
                        let en_index = data.indexOf(`<text lang="ja">`);
                        if (data.includes(`<text lang="en">`) && !ignore.includes(data.substring(en_index + `<text lang="ja">`.length, data.indexOf(`</text>`, en_index)))) {
                            get_revisions(randomTrad.path.substring(5), (err, revisions) => {
                                if (err) return;

                                let msg = new RichEmbed();
                                msg.setAuthor("Traduction aléatoire", message.guild.me.user.avatarURL);
                                msg.setTitle(`**${randomTrad.section}** - ${revisions[0].fileName}`);
                                msg.setColor(message.guild.me.displayColor);
                                msg.setDescription(randomTrad.path);
                                revisions.forEach(revision => {
                                    msg.addField(`Modifié le ${revision.date} par ${revision.modifier_name.name}.`, revision.data);
                                });
                                this.message.channel.send(msg);
                            });
                        } else {
                            randomTrad = files[get_random_index(files)];
                            return find_trad(randomTrad);
                        }
                    }).catch(err => {
                        console.error(err);
                    });
                }

                find_trad(randomTrad);

            }).catch(console.error);

        });
    }

}

exports.run = (client, message) => {

    const command = message.content.slice('trad '.length, message.content.length).trim().split(/ +/g);
    console.log('Launching trad command.');
    console.log(command);

    if (command[0] === 'dr1') {

        let cleaned_command = command[1].toLowerCase().trim();
        if (cleaned_command === 'récurrente' || cleaned_command.startsWith('rec') || cleaned_command.startsWith('réc')) {

            //fs.readFile("../../Danganronpa traduction FR/Super_Duper_Script_Editor/SDSE.csv")

        }

        if (cleaned_command === "stat") {

            let stat = new DanganronpaTranslation(client, message);

            stat.get_dr1_stat().then((res) => {

                console.log(res);

            }).catch(console.error);

        }

    } else if (command[0] === 'dr2') {

        let translationStatus = new DR2Translation(client, message);

        let cleaned_command = command[1].toLowerCase().trim();
        if (cleaned_command === "récurrente" || cleaned_command.startsWith("rec") || cleaned_command.startsWith("réc")) {
            translationStatus.recurrentTranslation();
        }

        if (cleaned_command === 'stat') {
            if (message.author.id === bot_data.bot_values.bot_owners[0]) {
                analyseLogChan(client, message.channel).catch(console.error);
            }
        }

        if (cleaned_command === "avancement" || cleaned_command.startsWith("avan")) {
            translationStatus.avancement2().catch(console.error);
        }

        if (cleaned_command === 'get' && command.length === 3) {
        }

    } else {

        message.channel.send(new RichEmbed().setAuthor("Guide commande trad")
            .setColor(bot_data.bot_values.bot_color)
            .addField("/trad dr2 récurrente", "afficher les traductions récurrentes de dr2")
            .addField("/trad dr2 avancement", "afficher l'avancement de la traduction sur dr2")
            .addField("/trad dr2 get", "afficher une traduction précise\n\nex: /trad dr2 get e08_003_005.lin/0000.txt")
        ).catch(console.error);

    }

};
