const fs = require("fs");
const RichEmbed = require("discord.js").RichEmbed;
const bot_values = require("../bot_data").bot_values;
const write_to_file = require("../functions/write_json").write_to_file;

exports.run = (client, message) => {

    const command = message.content.slice('dr_birth '.length, message.content.length).trim().split(/ +/g);

    function error_cmd(message, fields = []) {
        let guide_birthday_command = new RichEmbed();

        guide_birthday_command.setColor(message.guild.me.displayColor);
        guide_birthday_command.setAuthor("Erreur commande anniversaire", message.guild.me.user.avatarURL);
        fields.forEach(field => {
            guide_birthday_command.addField(field[0], field[1]);
        });
        guide_birthday_command.addField(
            `Guide commande anniversaire`,
            `${bot_values.bot_prefix}dr_birth <perso dr> <jour>/<mois>`
        );

        message.channel.send(guide_birthday_command);
    }

    const fileName = 'mirai_bot.json';

    if (command[0] === 'show' && command.length === 1) {
        if (!fs.existsSync(fileName)) {
            message.channel.send("Aucun anniversaire enregistré.").catch(err => {
                console.error(err);
                console.error("Ligne 32");
            });
        } else {

            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    error_cmd(message, [['Erreur système', "Le fichier n'a pas pu être ouvert."]]);
                } else {
                    let obj = JSON.parse(data);

                    let months = {
                        1: "Janvier",
                        2: "Février",
                        3: "Mars",
                        4: "Avril",
                        5: "Mai",
                        6: "Juin",
                        7: "Juillet",
                        8: "Aout",
                        9: "Septembre",
                        10: "Octobre",
                        11: "Novembre",
                        12: "Décembre"
                    };


                    function send_anniversaires(array) {
                        let all_birthday = new RichEmbed();

                        all_birthday.setColor(message.guild.me.displayColor);
                        all_birthday.setAuthor("Les anniversaires des personnages Danganronpa");
                        let i = 0;
                        let forward = true;
                        obj.dr_anniversaires.forEach(elem => {
                            if (i === 24) {
                                message.channel.send(all_birthday).then(msg => {
                                }).catch(err => {
                                    console.error(err);
                                });
                                for (let j = 0 ; j < i ; j++)
                                    array.shift();
                                forward = false;
                                return send_anniversaires(array);
                            }
                            all_birthday.addField(elem.name, `Né(e) le ${elem.day} ${months[elem.month]}`, true);
                            i += 1;
                        });

                        if (forward) {
                            message.channel.send(all_birthday).then(msg => {
                            }).catch(err => {
                                console.error(err);
                                console.error("Ligne 76");
                            });
                        }
                    }

                    send_anniversaires(obj.dr_anniversaires)
                }
            });

        }
        return;
    }

    if (bot_values.bot_owners.includes(message.author.id)) {

        let date;
        let day;
        let month;
        let pseudo;
        let memberBirthday;
        if (command[0] === 'delete') {
            if (!fs.existsSync(fileName)) {
                message.channel.send("Aucun anniversaire enregistré.").catch(console.error);
            } else {

                fs.readFile(fileName, 'utf8', (err, data) => {
                    if (err) {
                        console.log(err);
                        error_cmd(message, [['Erreur système', "Le fichier n'a pas pu être ouvert."]]);
                    } else {
                        let obj = JSON.parse(data);

                        let res = -1;
                        let i = 0;
                        obj.dr_anniversaires.forEach(birthDay => {
                            if (birthDay.name === command[1]) {
                                res = i;
                            }
                            i += 1;
                        });

                        if (res !== -1)
                            obj.dr_anniversaires.splice(res, 1);

                        write_to_file(obj, fileName, message, "L'anniversaire a bien été supprimé.");

                    }
                });

            }
            return;
        }

        if (command[0].split('/').length === 2) {
            class Birthday {
                constructor(name, day, month) {
                    this.name = name;
                    this.day = day;
                    this.month = month;
                }
            }

            date = command[0].split('/');
            let copy = command;
            copy.shift();
            pseudo = copy.join(' ');
            day = parseInt(date[0]);
            month = parseInt(date[1]);

            if (isNaN(day) || isNaN(month)) {
                return error_cmd(
                    message,
                    [["Erreur de date", "Le jour ou le mois n'est pas bon."]]
                );
            }

            memberBirthday = new Birthday(pseudo, day, month);
        } else {
            return error_cmd(message);
        }


        if (isNaN(day) || isNaN(month)) {
            return error_cmd(
                message,
                [["Erreur de date", "Le jour ou le mois n'est pas bon."]]
            );
        }


        if (memberBirthday.day > 31 || memberBirthday.day < 1) {
            return (error_cmd(
                message,
                [['Jour incorrect', `Veuillez donner un jour entre 1 et 31`]]
            ))
        }

        if (memberBirthday.month > 12 || memberBirthday.month < 1) {
            return (error_cmd(
                message,
                [['Mois incorrect', `Veuillez donner un mois entre 1 et 12`]]
            ))
        }

        let obj = {
            dr_anniversaires: [
                {
                    name: memberBirthday.name,
                    day: memberBirthday.day,
                    month: memberBirthday.month,
                }
            ]
        };

        // if file don't exists
        if (!fs.existsSync(fileName)) {
            write_to_file(obj, fileName, message, "L'anniversaire a été ajouté");
        } else {

            fs.readFile(fileName, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data); //now it an object

                    let forward = true;
                    let i = 0;
                    let log_message;
                    if (!obj.hasOwnProperty("dr_anniversaires"))
                        obj.dr_anniversaires = [];
                    obj.dr_anniversaires.forEach(elem => {
                        if (elem.name === pseudo) {
                            obj.anniversaires[i].name = memberBirthday.name;
                            obj.anniversaires[i].day = memberBirthday.day;
                            obj.anniversaires[i].month = memberBirthday.month;
                            forward = false;
                            log_message = "L'anniversaire à été mis à jour.";
                        }
                        i += 1;
                    });

                    if (forward) {
                        obj.dr_anniversaires.push({
                            name: memberBirthday.name,
                            day: memberBirthday.day,
                            month: memberBirthday.month,
                        }); //add some data
                        log_message = "L'anniversaire a été ajouté.";
                    }
                    write_to_file(obj, fileName, message, log_message); // write it back
                }
            });

        }
    }

};