const fs = require("fs");
const RichEmbed = require("discord.js").RichEmbed;
const bot_values = require("../bot_data").bot_values;
const write_to_file = require("../functions/write_json").write_to_file;

exports.run = (client, message) => {

    const command = message.content.slice('anniversaire '.length, message.content.length).trim().split(/ +/g);

    function error_cmd(message, fields = []) {
        let guide_birthday_command = new RichEmbed();

        guide_birthday_command.setColor(message.guild.me.displayColor);
        guide_birthday_command.setAuthor("Erreur commande anniversaire", message.guild.me.user.avatarURL);
        fields.forEach(field => {
            guide_birthday_command.addField(field[0], field[1]);
        });
        guide_birthday_command.addField(
            `Guide commande anniversaire`,
            `${bot_values['bot_prefix']}anniversaire <jour>/<mois>`
        );

        message.channel.send(guide_birthday_command);
    }

    const fileName = 'mirai_bot.json';

    if (command[0] === 'show' && command.length === 1 && bot_values['bot_owners'].includes(message.author.id)) {
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

                    let all_birthday = new RichEmbed();

                    all_birthday.setColor(message.guild.me.displayColor);
                    all_birthday.setAuthor("Les anniversaires de la Team Mirai");
                    obj.anniversaires.forEach(elem => {
                        all_birthday.addField(elem.name, `${elem.name} est né(e) le ${elem.day} ${months[elem.month]}`, false);
                    });
                    all_birthday.setFooter("Message auto-détruit dans 10 secondes");

                    message.channel.send(all_birthday).then(msg => {
                        setTimeout(function () {
                            msg.delete().catch(err => {
                                console.error(err);
                                console.error("Ligne 71");
                            });
                        }, 10000)
                    }).catch(err => {
                        console.error(err);
                        console.error("Ligne 76");
                    });
                }
            });

        }
        return;
    }

    let date;
    let day;
    let month;
    let pseudo;
    let memberBirthday;
    if (command.length < 2) {

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

                        message.guild.fetchMember(message).then(guildMem => {
                            let res = -1;
                            let i = 0;
                            obj.anniversaires.forEach(birthDay => {
                                if (birthDay.id === guildMem.user.id) {
                                    console.log(`${birthDay.id} === ${guildMem.user.id}`);
                                    res = i;
                                }
                                i += 1;
                            });

                            if (res !== -1)
                                obj.anniversaires.splice(res, 1);

                            write_to_file(obj, fileName, message, "L'anniversaire a bien été supprimé.");

                        }).catch(err => {
                            console.error(err);
                            message.channel.send("L'utilisateur n'a pas pu être récupéré");
                        });
                    }
                });

            }
            return;
        }

        if (command[0].split('/').length === 2) {
            class Birthday {
                constructor(message, day, month) {
                    this.name = message.author.username;
                    this.day = day;
                    this.month = month;
                    this.id = message.author.id;
                    this.member = message.member;
                }
            }
            date = command[0].split('/');

            day = parseInt(date[0]);
            month = parseInt(date[1]);

            if (isNaN(day) || isNaN(month)) {
                return error_cmd(
                    message,
                    [["Erreur de date", "Le jour ou le mois n'est pas bon."]]
                );
            }

            memberBirthday = new Birthday(message, day, month);
        } else {
            return error_cmd(message);
        }
    } else {

        if (!bot_values['bot_owners'].includes(message.author.id)) {
            return error_cmd(message, [['Permissions', "Tu n'as pas le droit de modifier l'anniversaire de quelqu'un d'autre."]]);
        }

        if (command[1].split('/').length !== 2)
            return error_cmd(message);

        class BirthdayAdmin {
            constructor(message, pseudo, day, month) {
                this.name = pseudo;
                this.day = day;
                this.month = month;
                this.fetch_user();
                if (this.member) {
                    this.id = this.member.user.id;
                    this.name = this.member.user.username;
                }
            }

            fetch_user() {

                let members = message.guild.members.keyArray();
                let member;

                members.forEach(userId => {

                    member = message.guild.members.find("id", userId);

                    if (member.nickname) {
                        if (member.nickname.toLowerCase().trim().includes(this.name.toLowerCase().trim())) {
                            this.member = member;
                        }
                    }
                    if (member.user.username.toLowerCase().trim().includes(this.name.toLowerCase().trim())) {
                        this.member = member;
                    }
                });

            }
        }

        pseudo = command[0];
        date = command[1].split('/');

        day = parseInt(date[0]);
        month = parseInt(date[1]);

        if (isNaN(day) || isNaN(month)) {
            return error_cmd(
                message,
                [["Erreur de date", "Le jour ou le mois n'est pas bon."]]
            );
        }

        memberBirthday = new BirthdayAdmin(message, pseudo, day, month);
    }

    if (!memberBirthday.member) {
        return (error_cmd(
            message,
            [['Utilisateur non trouvé',
                "L'utilisateur n'a pas été trouvé"]]));
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
        anniversaires: [
            {
                name: memberBirthday.name,
                day: memberBirthday.day,
                month: memberBirthday.month,
                id: memberBirthday.id
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
                obj.anniversaires.forEach(elem => {
                    if (elem.id === memberBirthday.id) {
                        obj.anniversaires[i].name = memberBirthday.name;
                        obj.anniversaires[i].day = memberBirthday.day;
                        obj.anniversaires[i].month = memberBirthday.month;
                        forward = false;
                        log_message = "L'anniversaire à été mis à jour.";
                    }
                    i += 1;
                });

                if (forward) {
                    obj.anniversaires.push({
                        name: memberBirthday.name,
                        day: memberBirthday.day,
                        month: memberBirthday.month,
                        id: memberBirthday.id
                    }); //add some data
                    log_message = "L'anniversaire a été ajouté.";
                }
                    write_to_file(obj, fileName, message, log_message); // write it back
            }
        });

    }

};