const bot_data = require('../bot_data.js');
const Katakana = require("./kanas").Katakana;
const Hiragana = require("./kanas").Hiragana;
const get_random_index = require("../functions/parsing_functions").get_random_index;
const RichEmbed = require("discord.js").RichEmbed;

class Quizz {

    constructor() {

        this.level = 1;
        this.quizzType = '';

        this.hiragana = undefined;
        this.katakana = undefined;

        this.workingData = {};
        this.successRateData = {};

        this.success = 0;
        this.failure = 0;

        this.questionNb = 1;
        this.totalQuestions = 0;
        this.xp = 0;

    }

    resetSuccessRateData() {
        Object.keys(this.successRateData).forEach(key => {
            this.successRateData[key] = false;
        });
    }

    isRightIndex(key) {
        return !this.successRateData[key];
    }

    isSuccesRateDataFull() {
        let res = true;
        Object.keys(this.successRateData).forEach(key => {
            if (!this.successRateData[key]) {
                res = false;
            }
        });
        return res;
    }

    printResult(message) {
        message.channel.send(new RichEmbed().setAuthor(message.author.username, message.author.avatarURL)
            .setDescription(`${(this.success / (this.success + this.failure) * 100).toFixed(2)}% de réussite\n${this.success} réponse(s) correcte(s)\n${this.failure} réponse(s) fausse(s).`)
            .setColor(bot_data.bot_values.bot_color)
        ).catch(console.error);
    }

    getIndex(array) {
        let index = get_random_index(array);

        while (!this.isRightIndex(array[index])) {
            index = get_random_index(array);
        }
        return index;
    }

    printQuestion(message, key) {
        message.channel.send(new RichEmbed()
            .setAuthor(`Question ${this.questionNb}/${this.totalQuestions}`, 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-167911.jpg')
            .setTitle(`Quizz ${this.quizzType} niveau ${this.level}`)
            .setColor(bot_data.bot_values.bot_color)
            .addField(`**${this.workingData[key]}**`, "Quelle est la prononciation de ce " + this.quizzType + " ?")
            .setDescription('Tape stop pour arrêter le quizz'))
            .catch(console.error);
    }

    hiraganaPalatalised(message) {
        return new Promise((resolve, reject) => {
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.hiragana.aPalatalisated,
                this.hiragana.uPalatalisated,
                this.hiragana.oPalatalisated
            );
            this.quizzType = "hiragana";
            this.level = 3;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    hiraganaDakuten(message) {
        return new Promise((resolve, reject) => {
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.hiragana.aDakutenHandakuten,
                this.hiragana.iDakutenHandakuten,
                this.hiragana.eDakutenHandakuten,
                this.hiragana.uDakutenHandakuten,
                this.hiragana.oDakutenHandakuten,
            );
            this.quizzType = "hiragana";
            this.level = 2;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    hiraganaBasic(message) {
        return new Promise((resolve, reject) => {
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.hiragana.a,
                this.hiragana.i,
                this.hiragana.e,
                this.hiragana.u,
                this.hiragana.o,
            );
            this.quizzType = "hiragana";
            this.level = 1;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    hiraganaAll(message) {
        return new Promise((resolve, reject) => {
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.hiragana.a, this.hiragana.aDakutenHandakuten, this.hiragana.aPalatalisated,
                this.hiragana.i, this.hiragana.iDakutenHandakuten,
                this.hiragana.e, this.hiragana.eDakutenHandakuten,
                this.hiragana.u, this.hiragana.uDakutenHandakuten, this.hiragana.uPalatalisated,
                this.hiragana.o, this.hiragana.oDakutenHandakuten, this.hiragana.oPalatalisated
            );
            this.quizzType = "général";
            this.level = "ultime";
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    katakanaPalatalised(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.workingData = Object.assign({},
                this.katakana.aPalatalisated,
                this.katakana.uPalatalisated,
                this.katakana.oPalatalisated
            );
            this.quizzType = "katakana";
            this.level = 3;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    katakanaDakuten(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.workingData = Object.assign({},
                this.katakana.aDakutenHandakuten,
                this.katakana.iDakutenHandakuten,
                this.katakana.eDakutenHandakuten,
                this.katakana.uDakutenHandakuten,
                this.katakana.oDakutenHandakuten,
            );
            this.quizzType = "katakana";
            this.level = 2;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    katakanaBasic(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.workingData = Object.assign({},
                this.katakana.a,
                this.katakana.i,
                this.katakana.e,
                this.katakana.u,
                this.katakana.o,
            );
            this.quizzType = "katakana";
            this.level = 1;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    katakanaAll(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.workingData = Object.assign({},
                this.katakana.a, this.katakana.aDakutenHandakuten, this.katakana.aPalatalisated,
                this.katakana.i, this.katakana.iDakutenHandakuten,
                this.katakana.e, this.katakana.eDakutenHandakuten,
                this.katakana.u, this.katakana.uDakutenHandakuten, this.katakana.uPalatalisated,
                this.katakana.o, this.katakana.oDakutenHandakuten, this.katakana.oPalatalisated
            );
            this.quizzType = "général";
            this.level = "ultime";
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    allPalatalised(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.katakana.aPalatalisated, this.hiragana.aPalatalisated,
                this.katakana.uPalatalisated, this.hiragana.uPalatalisated,
                this.katakana.oPalatalisated, this.hiragana.oPalatalisated,
            );
            this.quizzType = "général";
            this.level = 3;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    allDakuten(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.katakana.aDakutenHandakuten, this.hiragana.aDakutenHandakuten,
                this.katakana.iDakutenHandakuten, this.hiragana.iDakutenHandakuten,
                this.katakana.eDakutenHandakuten, this.hiragana.eDakutenHandakuten,
                this.katakana.uDakutenHandakuten, this.hiragana.uDakutenHandakuten,
                this.katakana.oDakutenHandakuten, this.hiragana.oDakutenHandakuten,
            );
            this.quizzType = "général";
            this.level = 2;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    allBasic(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.katakana.a, this.hiragana.a,
                this.katakana.i, this.hiragana.i,
                this.katakana.e, this.hiragana.e,
                this.katakana.u, this.hiragana.u,
                this.katakana.o, this.hiragana.o,
            );
            this.quizzType = "général";
            this.level = 1;
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    allAll(message) {
        return new Promise((resolve, reject) => {
            this.katakana = new Katakana();
            this.hiragana = new Hiragana();
            this.workingData = Object.assign({},
                this.katakana.a, this.katakana.aDakutenHandakuten, this.katakana.aPalatalisated,
                this.katakana.i, this.katakana.iDakutenHandakuten,
                this.katakana.e, this.katakana.eDakutenHandakuten,
                this.katakana.u, this.katakana.uDakutenHandakuten, this.katakana.uPalatalisated,
                this.katakana.o, this.katakana.oDakutenHandakuten, this.katakana.oPalatalisated,
                this.hiragana.a, this.hiragana.aDakutenHandakuten, this.hiragana.aPalatalisated,
                this.hiragana.i, this.hiragana.iDakutenHandakuten,
                this.hiragana.e, this.hiragana.eDakutenHandakuten,
                this.hiragana.u, this.hiragana.uDakutenHandakuten, this.hiragana.uPalatalisated,
                this.hiragana.o, this.hiragana.oDakutenHandakuten, this.hiragana.oPalatalisated,
            );
            this.quizzType = "général";
            this.level = "ultime";
            this.runQuizz(message).then((xp) => resolve(xp));
        });
    }

    runQuizz(message) {
        return new Promise((resolve, reject) => {
            this.successRateData = Object.assign({}, this.workingData);
            this.resetSuccessRateData();
            this.totalQuestions = Object.keys(this.successRateData).length;

            let workingArray = Object.keys(this.workingData);
            let index = get_random_index(workingArray);

            this.printQuestion(message, workingArray[index]);

            const quizz = message.channel.createMessageCollector(m => m.author.id === message.author.id);

            quizz.on('collect', msg => {
                const answer = msg.content.trim().toLowerCase();

                if (answer === workingArray[index].split('|')[1]) {

                    message.channel.send(':white_check_mark:').catch(console.error);
                    this.successRateData[workingArray[index]] = true;
                    this.success += 1;
                    this.xp += 5;

                    if (this.isSuccesRateDataFull()) {
                        this.printResult(message);
                        quizz.stop();
                        return;
                    }

                    this.questionNb += 1;
                    index = this.getIndex(workingArray);

                    this.printQuestion(message, workingArray[index]);

                } else if (answer === 'stop') {

                    this.printResult(message);
                    this.xp = 0;
                    quizz.stop();

                } else {

                    message.channel.send(new RichEmbed().setTitle(':x: La réponse était **' + workingArray[index].split('|')[1] + "**")
                        .setColor(bot_data.bot_values.bot_color)).catch(console.error);
                    this.failure += 1;
                    this.questionNb += 1;
                    this.totalQuestions += 1;

                    index = this.getIndex(workingArray);
                    this.printQuestion(message, workingArray[index]);

                }
            });

            quizz.on('end', () => {
                resolve(this.xp * (1 + (this.success / (this.success + this.failure))));
            })

        });
    }

}

module.exports = {Quizz};
