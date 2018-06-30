const bot_data = require('../bot_data.js');
const Katakana = require("./kanas").Katakana;
const Hiragana = require("./kanas").Hiragana;
const get_random_index = require("../functions/parsing_functions").get_random_index;
const RichEmbed = require("discord.js").RichEmbed;

class Quizz {

    constructor() {

        this.hiragana = new Hiragana();
        this.katakana = new Katakana();

        this.workingData = {};
        this.successRateData = {};

        this.success = 0;
        this.failure = 0;

        this.questionNb = 1;
        this.totalQuestions = 0;

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
        message.channel.send(new RichEmbed().setAuthor(`Question ${this.questionNb}/${this.totalQuestions}`, 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-167911.jpg')
            .setColor(bot_data.bot_values.bot_color)
            .addField(`**${this.workingData[key]}**`, "Quelle est la prononciation de cet hiragana ?")
            .setDescription('Tape stop pour arrêter le quizz'))
            .catch(console.error);
    }

    questionUser(message) {

        this.workingData = Object.assign({},
            this.hiragana.a, this.hiragana.aDakutenHandakuten, this.hiragana.aPalatalisated,
            this.hiragana.i, this.hiragana.iDakutenHandakuten,
            this.hiragana.e, this.hiragana.eDakutenHandakuten,
            this.hiragana.u, this.hiragana.uDakutenHandakuten, this.hiragana.uPalatalisated,
            this.hiragana.o, this.hiragana.oDakutenHandakuten, this.hiragana.oPalatalisated
        );

        this.successRateData = Object.assign({}, this.workingData);
        this.resetSuccessRateData();
        this.totalQuestions = Object.keys(this.successRateData).length;

        let hiraganaArray = Object.keys(this.workingData);
        let index = get_random_index(hiraganaArray);

        this.printQuestion(message, hiraganaArray[index]);

        const quizz = message.channel.createMessageCollector(m => m.author.id === message.author.id);

        quizz.on('collect', msg => {
            const answer = msg.content.trim().toLowerCase();

            if (answer === hiraganaArray[index]) {

                message.channel.send(':white_check_mark:').catch(console.error);
                this.successRateData[hiraganaArray[index]] = true;
                this.success += 1;

                if (this.isSuccesRateDataFull()) {
                    this.printResult(message);
                    quizz.stop();
                    return;
                }
                this.questionNb += 1;
                index = this.getIndex(hiraganaArray);
                this.printQuestion(message, hiraganaArray[index]);

            } else if (answer === 'stop') {

                this.printResult(message);
                quizz.stop();

            } else {

                message.channel.send(new RichEmbed().setTitle(':x: La réponse était **' + hiraganaArray[index] + "**")
                    .setColor(bot_data.bot_values.bot_color)).catch(console.error);
                this.failure += 1;
                this.questionNb += 1;
                this.totalQuestions += 1;

                index = this.getIndex(hiraganaArray);
                this.printQuestion(message, hiraganaArray[index]);

            }
        });

        quizz.on('end', () => {
            console.log('quizz done');
        })

    }

}

module.exports = {Quizz};
