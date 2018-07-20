const Discord = require('discord.js');
const analyseLogChan = require("../functions/analyse_channel").analyseLogChan;
const DanganronpaTranslation = require("../functions/translation_statistics").DanganronpaTranslation;
const getrevsPromise = require("../functions/dropbox").getrevsPromise;
const get_file_data = require("../functions/dropbox").get_file_data;
const RichEmbed = require("discord.js").RichEmbed;
const get_revisions = require("../functions/dropbox").get_revisions;
const get_random_index = require("../functions/parsing_functions").get_random_index;
const write_to_file = require("../functions/write_json").write_to_file;

exports.run = (client, message) => {

    let fs = require('graceful-fs');
    const command = message.content.slice('trad '.length, message.content.length).trim().split(/ +/g);
    console.log('Launching trad command.');

    if (command[0] === 'register') {


        let obj = {
            table: []
        };

        // if file don't exists
        write_to_file(obj);

        // else append
        fs.readFile('translators.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data); //now it an object
                obj.table.push({id: 2, square: 3}); //add some data
                let json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back
            }
        });

    }
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

        let cleaned_command = command[1].toLowerCase().trim();
        if (cleaned_command === "récurrente" || cleaned_command.startsWith("rec") || cleaned_command.startsWith("réc")) {

            fs.readFile("../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/TerminologyDR2.csv", 'utf8', (err, data) => {

                if (err) {
                    console.log(err);
                } else {

                    let terms = new Discord.RichEmbed();

                    terms.setTitle("Terminologie");
                    terms.setDescription("Traductions récurrentes pour Danganronpa 2");
                    terms.setThumbnail("https://vignette.wikia.nocookie.net/danganronpa/images/f/f7/Danganronpa_2_Goodbye_Despair_Box_Art_NISA_PS_Vita_%282014%29.jpg/revision/latest?cb=20140418154650");
                    terms.setColor(message.guild.me.displayColor);

                    let i = 0;
                    let trads = data.split('\n').slice(1);

                    let translation_array;
                    trads.forEach(line => {
                        translation_array = line.split(',');

                        if (translation_array.length === 3) {
                            if (i === 25) {
                                message.channel.send(terms).catch(console.error);
                                terms = new Discord.RichEmbed()
                                    .setTitle("Terminologie")
                                    .setDescription("Traductions récurrentes pour Danganronpa 2")
                                    .setThumbnail("https://vignette.wikia.nocookie.net/danganronpa/images/f/f7/Danganronpa_2_Goodbye_Despair_Box_Art_NISA_PS_Vita_%282014%29.jpg/revision/latest?cb=20140418154650")
                                    .setColor(message.guild.me.displayColor);
                                    i = 0;
                            }
                            terms.addField(translation_array[1], translation_array[2], true);
                            i += 1;
                        }

                    });

                    message.channel.send(terms);
                }

            });

        }

        let part = {
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
            "Danganronpa IF": [0, 0]
        };

        function get_section(file_dir, part, name = false) {
            if (file_dir[2] === '_') {
                if (name)
                    return "System Text";
                else
                    return part["System Text"];
                //console.log(`dir : ${file_dir} = System Text`);
            } else if (file_dir.startsWith('e00_') || file_dir.startsWith("script_pak_e00")) {
                if (name)
                    return "Prologue";
                else
                    return part["Prologue"];
                //console.log(`dir : ${file_dir} = Prologue`);
            } else if (file_dir.startsWith('e01_') || file_dir.startsWith("script_pak_e01")) {
                if (name)
                    return "Chapitre 1";
                else
                    return part["Chapitre 1"];
                //console.log(`dir : ${file_dir} = Chapitre 1`);
            } else if (file_dir.startsWith('e02_') || file_dir.startsWith("script_pak_e02")) {
                if (name)
                    return "Chapitre 2";
                else
                    return part["Chapitre 2"];
                //console.log(`dir : ${file_dir} = Chapitre 2`);
            } else if (file_dir.startsWith('e03_') || file_dir.startsWith("script_pak_e03")) {
                if (name)
                    return "Chapitre 3";
                else
                    return part["Chapitre 3"];
                //console.log(`dir : ${file_dir} = Chapitre 3`);
            } else if (file_dir.startsWith('e04_') || file_dir.startsWith("script_pak_e04")) {
                if (name)
                    return "Chapitre 4";
                else
                    return part["Chapitre 4"];
                //console.log(`dir : ${file_dir} = Chapitre 4`);
            } else if (file_dir.startsWith('e05_') || file_dir.startsWith("script_pak_e05")) {
                if (name)
                    return "System Text";
                else
                    return part["Chapitre 5"];
                //console.log(`dir : ${file_dir} = Chapitre 5`);
            } else if (file_dir.startsWith('e06_') || file_dir.startsWith("script_pak_e06")) {
                if (name)
                    return "System Text";
                else
                    return part["Chapitre 6"];
                //console.log(`dir : ${file_dir} = Chapitre 6`);
            } else if (file_dir.startsWith('e07_') || file_dir.startsWith("script_pak_e07")) {
                if (name)
                    return "Epilogue";
                else
                    return part["Epilogue"];
                //console.log(`dir : ${file_dir} = Epilogue`);
            } else if (file_dir.startsWith('e08_') || file_dir.startsWith("script_pak_e08")) {
                if (name)
                    return "FTE";
                else
                    return part["FTE"];
                //console.log(`dir : ${file_dir} = FTE`);
            } else if (file_dir.startsWith('e09_') || file_dir.startsWith("script_pak_e09")) {
                if (name)
                    return "Dangan Island";
                else
                    return part["Dangan Island"];
                //console.log(`dir : ${file_dir} = Dangan Island`);
            } else if (file_dir.startsWith("MAP_")) {
                if (name)
                    return "MAP";
                else
                    return part["MAP"];
                //console.log(`dir : ${file_dir} = Map`);
            } else if (file_dir.startsWith("ldive_s")) {
                if (name)
                    return "Logic Dive";
                else
                    return part["Logic Dive"];
                //console.log(`dir : ${file_dir} = Logic Dive`);
            } else if (file_dir.startsWith("mtb_s")) {
                if (name)
                    return "Contre Attaque Ballistique";
                else
                    return part["Contre Attaque Ballistique"];
                //console.log(`dir : ${file_dir} = Contre Attaque Ballistique`);
            } else if (file_dir.startsWith("novel_") || file_dir.startsWith("script_pak_novel")) {
                if (name)
                    return "Danganronpa IF";
                else
                    return part["Danganronpa IF"];
                //console.log(`dir : ${file_dir} = Danganronpa IF`);
            } else {
                return "Erreur";
            }
        }

        function read_single_folder(path, file_dir, part = null, avancement = true, global, global_total, print_progress = function () {
            console.error("None");
        }) {
            return new Promise((resolve, reject) => {


                fs.readdir(path + '/' + file_dir, "utf8", (err, files) => {

                    if (err) {
                        return;
                    }

                    let fileDataPromises = [];

                    let dirPromises = [];
                    let allFilesRes = [];

                    files.forEach(directory_or_txt => {

                        if (directory_or_txt.endsWith(".txt")) {

                            if (avancement)
                                fileDataPromises.push(get_file_data(`${path}/${file_dir}/${directory_or_txt}`));
                            else {
                                let section = get_section(file_dir, part, true);

                                allFilesRes.push({
                                    section: section,
                                    path: path + '/' + file_dir + '/' + directory_or_txt
                                });
                            }


                        } else if (directory_or_txt.startsWith("script_pak_")) {

                            dirPromises.push(new Promise((resolve, reject) => {

                                fs.readdir(path + '/' + file_dir + '/' + directory_or_txt, (err, files) => {

                                    if (err) {
                                        reject(err);
                                    }

                                    files.forEach(text_file => {

                                        if (avancement) {
                                            fileDataPromises.push(get_file_data(`${path}/${file_dir}/${directory_or_txt}/${text_file}`));
                                        } else {
                                            let section = get_section(file_dir, part, true);

                                            allFilesRes.push({
                                                section: section,
                                                path: path + '/' + file_dir + '/' + directory_or_txt + '/' + text_file
                                            })
                                        }
                                    });

                                    resolve(null);
                                });

                            }));
                        }
                    });

                    Promise.all(dirPromises).then(() => {

                        if (avancement) {

                            Promise.all(fileDataPromises).then(allFiles => {

                                let section = get_section(file_dir, part);

                                allFiles.forEach(data => {

                                    if (data === undefined) {
                                        console.log(`Couldn't read.`);
                                        return;
                                    }
                                    if (data.includes(`<text lang="en">`)) {
                                        section[0] += 1;
                                        global += 1;
                                    }
                                    try {
                                        section[1] += 1;
                                    } catch (err) {
                                        console.error(section);
                                        reject(err);
                                    }
                                    global_total += 1;
                                    print_progress();

                                });

                                resolve([global, global_total]);

                            }).catch(err => reject(err));

                        } else {

                            resolve(allFilesRes);

                        }


                    }).catch(err => reject(err));

                });

            });
        }

        const path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";

        function readDirectory(path, encoding) {
            return new Promise((resolve, reject) => {
                fs.readdir(path, encoding, (err, files) => {
                    if (err) reject(err);
                    resolve(files);
                });
            });
        }

        if (cleaned_command === 'stat') {

            analyseLogChan(client, message.channel).catch(console.error);

        }

        if (cleaned_command === "avancement" || cleaned_command.startsWith("avan")) {

            message.channel.send("Analyse des fichiers en cours...").then((msg) => {

                fs.readdir(path, "utf8", (err, files) => {
                    if (err) {
                        msg.delete().catch(console.error);
                        message.channel.send("L'analyse des dossiers a échoué.").catch(console.error);
                        return;
                    }

                    let global = 0;
                    let global_total = 0;
                    let progressInt = 50;

                    let progress_messages = [];

                    function print_translation_status(part) {
                        let avancement = new Discord.RichEmbed();

                        msg.delete().catch(console.error);

                        avancement.setColor(message.guild.me.displayColor);
                        avancement.setDescription("Avancement de la traduction sur Super Danganronpa 2");
                        avancement.setTitle("Super Danganronpa 2");
                        avancement.setImage("https://caneandrinse.com/wp-content/uploads/2017/05/tropicalisland2.jpg");

                        let percentage;
                        Object.keys(part).forEach(single_part => {
                            percentage = (Math.round((part[single_part][0] / part[single_part][1] * 100) * 100) / 100).toFixed(2);
                            avancement.addField(single_part, `${part[single_part][0]} / ${part[single_part][1]} répliques (**${percentage}%**)`, true);
                        });

                        percentage = (Math.round((global / global_total * 100) * 100) / 100).toFixed(2);
                        avancement.addField(`**Avancement global**`, `${global} / ${global_total} répliques (**${percentage}%**)`);

                        message.channel.send(avancement).catch(console.error);

                        progress_messages.forEach(msg => {
                            msg.delete().catch(console.error);
                        });
                    }

                    let directoryAnalysis = [];

                    files.forEach(file_dir => {
                        directoryAnalysis.push(read_single_folder(path, file_dir, part, true, global, global_total, function print_progress() {
                            let percentage = (Math.round((global / global_total * 100) * 100) / 100).toFixed(2);
                            if (percentage > progressInt && percentage < progressInt + 20) {
                                message.channel.send(`${progressInt}% des fichiers analysés`).then(msg => {
                                    progress_messages.push(msg);
                                }).catch(console.error);
                                progressInt += 50;
                            }
                        }));
                    });

                    Promise.all(directoryAnalysis).then((globals) => {

                        globals.forEach(g => {

                            global += g[0];
                            global_total += g[1];

                        });

                        print_translation_status(part);

                    }).catch(err => {
                        console.error(err);
                        message.channel.send("Erreur lors de l'analyse des fichiers").catch(console.error);
                    });


                });
            }).catch(console.error);

        }

        if (cleaned_command === 'get' && command.length === 3) {

            let section;
            let file_dir = `/Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script/${command[2]}`;

            fs.access(`../../${file_dir}`, (err) => {
                if (err) {
                    console.log(`../../${file_dir}`);
                    message.channel.send('Fichier introuvable.').catch(console.error);
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
                    message.channel.send(msg);
                });

            });


        }

        if (cleaned_command === 'random' || cleaned_command.startsWith("rand")) {
            fs.readdir(path, (err, files) => {
                if (err) {
                    message.channel.send("L'analyse des dossiers a échoué.").catch(console.error);
                    return;
                }

                let dirPromises = [];

                files.forEach(file_dir => {

                    dirPromises.push(read_single_folder(path, file_dir, part, false));

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
                                    message.channel.send(msg);
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

        if (command[1] === 'fiches') {
            let fiche_perso = new Discord.RichEmbed();

            fiche_perso.setTitle('Fiche persos pour DR2');
            fiche_perso.setColor(message.guild.me.displayColor);

            fiche_perso.addField("Hajime Hinata", "Kazuhiro - Aujourd'hui à 13:54\n" +
                "Il s'exprime avec un niveau de langage standard, pas d'abréviation, tutoiement, neutre (je pense que c'est très similaire à naegi ?)\n" +
                "0_6498 - Aujourd'hui à 13:55\n" +
                "y a quelques différences aussi xD genre maybe un peu moins poli et brut dans ses mots mais ça se traduira par le texte ça un peu j'imagine\n" +
                "Déjà, du japonais, Hinata n'utilise aucun suffixe à la -san, -kun, -chan, etc, car il doit se sentir à \"égal\" entre chacun des personnages (vu qu'il croit qu'il a un talent mais il l'a oublié donc il se sent à égal parmi les SHSL), utilise aussi ore comme pronom pour se désigner lui même, ainsi que zo au lieu de yo dans le sore wa chigau zo, qui montre ce côté moins délicat et plus \"j'exprime direct mes pensées\", qui peut faire paraitre plus viril certes mais plus direct et par consequent des fois moins respectueux que genre Naegi par exemple.\n" +
                "Kazuhiro - Aujourd'hui à 13:58\n" +
                "Je vois\n" +
                "0_6498 - Aujourd'hui à 13:59\n" +
                "rappel du coup que la différence entre boku et ore c'est qu'ore est moins utilisé en général car assez masculin mais pas si poli genre en milieu scolaire par exemple xD(édité)\n" +
                "mais tu le savais deja\n" +
                "j'imagine\n" +
                "Kazuhiro - Aujourd'hui à 13:59\n" +
                "Boku et ore sont masculins\n" +
                "Ore est juste moins poli\n" +
                "0_6498 - Aujourd'hui à 14:00\n" +
                "yup xD\n" +
                "Kazuhiro - Aujourd'hui à 14:00\n" +
                "Watashi est généralement féminin\n" +
                "0_6498 - Aujourd'hui à 14:00\n" +
                "après y a aussi Akane Owari qui utilise Ore alors que c'est une fille xD\n" +
                "si je me rappelle bien aucun mec dans le jeu utilise watashi donc on est ok de ce pdv");

            fiche_perso.addField("Byakuya Togami", "Il s'exprime de la même manière que togami dans dr1, il prend les gens de haut et n'hésite pas à montrer sa supériorité. Tutoiement, niveau de language quelque peu soutenu parfois\n" +
                "0_6498 - Aujourd'hui à 14:04\n" +
                "Il est plus aimable dans ce jeu aussi, l'autre dans DR1 etait un beaucoup plus gros connard XD\n" +
                "Kazuhiro - Aujourd'hui à 14:04\n" +
                "Oui\n" +
                "xD\n" +
                "0_6498 - Aujourd'hui à 14:04\n" +
                "mais ouaip ça irait sur ça");

            fiche_perso.addField("Teruteru Hanamura", " lui y a le dialecte du kansai je crois\n" +
                "à un moment il parle de maniere villageoise car ça vient de sa ville natale je crois\n" +
                "Kazuhiro - Aujourd'hui à 14:12\n" +
                "donc il faudrait lui donner un accent du sud ?\n" +
                "0_6498 - Aujourd'hui à 14:12\n" +
                "why not xD\n" +
                "Kazuhiro - Aujourd'hui à 14:12\n" +
                "campagnard et tout\n" +
                "0_6498 - Aujourd'hui à 14:13\n" +
                "et encore ça vient que vers la fin du proces 1 iirc\n" +
                "Kazuhiro - Aujourd'hui à 14:13\n" +
                "awh\n" +
                "faut bien noter ça du coup\n" +
                "0_6498 - Aujourd'hui à 14:13\n" +
                "yup\n" +
                "faudrait que je revois le transcript aussi voir si c'est vraiment un dialecte du kansai ou campagnard ou pas mais c'est clairement different des autres manieres de parler des gens");

            message.channel.send(fiche_perso);
        }

    } else {

        message.channel.send(new RichEmbed().setAuthor("Guide commande trad")
            .addField("/trad dr2 récurrente", "afficher les traductions récurrentes de dr2")
            .addField("/trad dr2 avancement", "afficher l'avancement de la traduction sur dr2")
            .addField("/trad dr2 get", "afficher une traduction précise\n\nex: /trad dr2 get e08_003_005.lin/0000.txt")
        ).catch(console.error);

    }

};
