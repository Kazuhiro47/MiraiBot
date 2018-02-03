const Discord = require('discord.js');
const write_to_file = require("../functions/write_json").write_to_file;

exports.run = (client, message) => {

    let fs = require('fs');
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

    if (command[0] === 'dr2') {

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
                            //TODO: handle 1024 character limit
                            terms.addField(translation_array[1], translation_array[2], true);
                            i += 1;
                        }

                    });

                    message.channel.send(terms);
                }

            });

        }

        if (cleaned_command === "avancement" || cleaned_command.startsWith("avan")) {

            let path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";

            message.channel.send("Analyse de plus de 60 000 fichiers en 30 secondes... Le bot est indisponible pendant ce laps de temps.").then((msg) => {

                fs.readdir(path, "utf8", (err, files) => {
                    if (err) {
                        msg.delete().catch(console.error);
                        message.channel.send("L'analyse des dossiers a échoué.").catch(console.error);
                        return;
                    }

                    let global = 0;
                    let global_total = 0;

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

                    let last_directory = files.length;
                    let total_files = 0;
                    let totaldir_it = 0;
                    let progressInt = 20;

                    console.log(last_directory);

                    function print_translation_status() {
                        let avancement = new Discord.RichEmbed();

                        msg.delete().catch(console.error);

                        console.log("ANALYSE COMPLETE2");
                        avancement.setColor(message.guild.me.displayColor);
                        avancement.setDescription("Avancement de la traduction sur Super Danganronpa 2");
                        avancement.setTitle("Super Danganronpa 2");
                        avancement.setImage("https://image.noelshack.com/fichiers/2018/05/5/1517611222-unknown.png");

                        let percentage;
                        Object.keys(part).forEach(single_part => {
                            percentage = (Math.round((part[single_part][0] / part[single_part][1] * 100) * 100) / 100).toFixed(2);
                            avancement.addField(single_part, `${part[single_part][0]} / ${part[single_part][1]} répliques (**${percentage}%**)`, true);
                        });

                        percentage = (Math.round((global / global_total * 100) * 100) / 100).toFixed(2);
                        avancement.addField(`**Avancement global**`, `${global} / ${global_total} répliques (**${percentage}%**)`);

                        message.channel.send(avancement);
                    }

                    files.forEach(file_dir => {
                        fs.readdir(path + '/' + file_dir, "utf8", (err, files) => {

                            if (err) return;

                            let section = [0, 0];

                            if (file_dir[2] === '_') {
                                section = part["System Text"];
                                //console.log(`dir : ${file_dir} = System Text`);
                            } else if (file_dir.match(/e00_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e00")) {
                                section = part["Prologue"];
                                //console.log(`dir : ${file_dir} = Prologue`);
                            } else if (file_dir.match(/e01_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e01")) {
                                section = part["Chapitre 1"];
                                //console.log(`dir : ${file_dir} = Chapitre 1`);
                            } else if (file_dir.match(/e02_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e02")) {
                                section = part["Chapitre 2"];
                                //console.log(`dir : ${file_dir} = Chapitre 2`);
                            } else if (file_dir.match(/e03_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e03")) {
                                section = part["Chapitre 3"];
                                //console.log(`dir : ${file_dir} = Chapitre 3`);
                            } else if (file_dir.match(/e04_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e04")) {
                                section = part["Chapitre 4"];
                                //console.log(`dir : ${file_dir} = Chapitre 4`);
                            } else if (file_dir.match(/e05_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e05")) {
                                section = part["Chapitre 5"];
                                //console.log(`dir : ${file_dir} = Chapitre 5`);
                            } else if (file_dir.match(/e06_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e06")) {
                                section = part["Chapitre 6"];
                                //console.log(`dir : ${file_dir} = Chapitre 6`);
                            } else if (file_dir.match(/e07_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e07")) {
                                section = part["Epilogue"];
                                //console.log(`dir : ${file_dir} = Epilogue`);
                            } else if (file_dir.match(/e08_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e08")) {
                                section = part["FTE"];
                                //console.log(`dir : ${file_dir} = FTE`);
                            } else if (file_dir.match(/e09_\d\d\d_\d\d\d.lin/) || file_dir.startsWith("script_pak_e09")) {
                                section = part["Dangan Island"];
                                //console.log(`dir : ${file_dir} = Dangan Island`);
                            } else if (file_dir.startsWith("MAP_")) {
                                section = part["MAP"];
                                //console.log(`dir : ${file_dir} = Map`);
                            } else if (file_dir.startsWith("ldive_s")) {
                                section = part["Logic Dive"];
                                //console.log(`dir : ${file_dir} = Logic Dive`);
                            } else if (file_dir.startsWith("mtb_s")) {
                                section = part["Contre Attaque Ballistique"];
                                //console.log(`dir : ${file_dir} = Contre Attaque Ballistique`);
                            } else if (file_dir.startsWith("novel_") || file_dir.startsWith("script_pak_novel")) {
                                section = part["Danganronpa IF"];
                                //console.log(`dir : ${file_dir} = Danganronpa IF`);
                            }

                            let last_file1 = files.length;
                            total_files += files.length - 1;
                            let last_file_iterator = 0;
                            files.forEach(txt_file => {

                                if (txt_file.endsWith(".txt")) {


                                    let data;
                                    try {
                                        data = fs.readFileSync(path + '/' + file_dir + '/' + txt_file, 'utf8');
                                    } catch (err) {
                                        try {
                                            data = fs.readFileSync(path + '/' + file_dir + '/' + txt_file, 'utf16le');
                                        } catch (err2) {
                                            console.log(`Couldn't read ${txt_file}`);
                                            return;
                                        }
                                    }

                                    if (data === undefined) {
                                        console.log(`Couldn't read ${txt_file}`);
                                        return;
                                    }

                                    if (data.includes(`<text lang="en">`)) {
                                        section[0] += 1;
                                        global += 1;
                                    }
                                    section[1] += 1;
                                    global_total += 1;
                                    last_file_iterator += 1;

                                    if (global_total === total_files && totaldir_it === last_directory) {
                                        console.log(`last_file_it ${totaldir_it} === last_directory ${last_directory}`);
                                        console.log(`last_file_iterator ${last_file_iterator} === last_file1 ${last_file1}`);
                                        return print_translation_status();
                                    }

                                } else if (txt_file.startsWith("script_pak_")) {

                                    fs.readdir(path + '/' + file_dir + '/' + txt_file, 'utf8', (err, files) => {

                                        if (err) return;

                                        function analyse_fil_is_done(data) {
                                            if (data === undefined) {
                                                console.log(`Couldn't read ${txt_file}`);
                                                return;
                                            }

                                            if (data.includes(`<text lang="en">`)) {
                                                section[0] += 1;
                                                global += 1;
                                            }
                                            section[1] += 1;
                                            global_total += 1;
                                            last_file_iterator += 1;

                                            if (global_total === total_files - 124 && totaldir_it === last_directory) {
                                                console.log(`last_file_it ${totaldir_it} === last_directory ${last_directory}`);
                                                console.log(`last_file_iterator ${last_file_iterator} === last_file1 ${last_file1}`);
                                                return true;
                                            }
                                            return false;
                                        }

                                        let last_file1 = files.length;
                                        total_files -= 1;
                                        total_files += files.length;
                                        let last_file_iterator = 0;
                                        files.forEach(text_file => {

                                            fs.readFile(path + '/' + file_dir + '/' + txt_file + '/' + text_file, 'utf8', (err, data) => {

                                                if (err) {
                                                    fs.readdir(path + '/' + file_dir + '/' + txt_file + '/' + text_file, 'utf16le', (err, data) => {
                                                        if (err) return;

                                                        if (analyse_fil_is_done(data))
                                                            return print_translation_status();

                                                    });
                                                    return;
                                                }

                                                if (analyse_fil_is_done(data))
                                                    return print_translation_status();
                                            });
                                        });
                                    });
                                }
                            });
                            totaldir_it += 1;
                        });
                    });
                });
            }).catch(console.error);
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

    }

};
