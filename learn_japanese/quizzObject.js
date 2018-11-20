const bot_data = require('../bot_data.js');
const Vocabulary = require("./jlpt").Vocabulary;
const Kanjis = require("./jlpt").Kanjis;
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

        this.messageList = [];
        this.allMessages = [];
    }

    resetStats() {
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

        this.messageList = [];
        this.allMessages = [];
    }

    cleanWorkingData() {
        let i = 0;
        Object.keys(this.workingData).forEach(key => {
            if (key.indexOf("undefined") !== -1 || this.workingData[key].indexOf("undefined") !== -1) {
                delete this.workingData[key];
            }
            i += 1;
        });

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
            .setThumbnail('https://www.global.hokudai.ac.jp/wp-content/uploads/2012/11/nihongo.jpg')
            .addField(
                `Quizz ${this.quizzType} niveau ${this.level}`,
                `${(this.success / (this.success + this.failure) * 100).toFixed(2)}% de réussite\n${this.success} réponse(s) correcte(s)\n${this.failure} réponse(s) fausse(s).`
            )
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
        let va;
        if (this.quizzType === 'kanji') {
            va = 'signification';
        } else if (this.quizzType === 'vocabulaire') {
            va = "signification"
        } else {
            va = 'prononciation';
        }
        let vb;
        if (this.quizzType === "vocabulaire") {
            vb = "mot";
        } else {
            vb = this.quizzType;
        }
        message.channel.send(new RichEmbed()
            .setAuthor(`Question ${this.questionNb}/${this.totalQuestions}`, 'https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-167911.jpg')
            .setTitle(`Quizz ${this.quizzType} niveau ${this.level}`)
            .setColor(bot_data.bot_values.bot_color)
            .addField(`${this.workingData[key]}`, "Quelle est la " + va + " de ce " + vb + " ?")
            .setDescription('Tape stop pour arrêter le quizz'))
            .then(msg => {
                this.messageList.push(msg);
            }).catch(console.error);
    }

    cleanseMessages(msgArray) {
        return new Promise((resolve, reject) => {
            let promises = [];

            msgArray.forEach(msg => {
                promises.push(msg.delete());
            });

            Promise.all(promises).then(() => resolve(true)).catch(console.error);
        });
    }

    hiraganaBegginer(message, i) {
        this.hiragana = new Hiragana();
        const levels = [
            {'h|a': this.hiragana.a['h|a'], 'h|i': this.hiragana.i['h|i'], 'h|e': this.hiragana.e['h|e'], 'h|u': this.hiragana.u['h|u'], 'h|o': this.hiragana.o['h|o']},
            {'h|ka': this.hiragana.a['h|ka'], 'h|ki': this.hiragana.i['h|ki'], 'h|ke': this.hiragana.e['h|ke'], 'h|ku': this.hiragana.u['h|ku'], 'h|ko': this.hiragana.o['h|ko']},
            {'h|sa': this.hiragana.a['h|sa'], 'h|shi': this.hiragana.i['h|shi'], 'h|se': this.hiragana.e['h|se'], 'h|su': this.hiragana.u['h|su'], 'h|so': this.hiragana.o['h|so']},
            {'h|ta': this.hiragana.a['h|ta'], 'h|chi': this.hiragana.i['h|chi'], 'h|te': this.hiragana.e['h|te'], 'h|tsu': this.hiragana.u['h|tsu'], 'h|to': this.hiragana.o['h|to']},
            {'h|na': this.hiragana.a['h|na'], 'h|ni': this.hiragana.i['h|ni'], 'h|ne': this.hiragana.e['h|ne'], 'h|nu': this.hiragana.u['h|nu'], 'h|no': this.hiragana.o['h|no']},
            {'h|ha': this.hiragana.a['h|ha'], 'h|hi': this.hiragana.i['h|hi'], 'h|he': this.hiragana.e['h|he'], 'h|fu': this.hiragana.u['h|fu'], 'h|ho': this.hiragana.o['h|ho']},
            {'h|ma': this.hiragana.a['h|ma'], 'h|mi': this.hiragana.i['h|mi'], 'h|me': this.hiragana.e['h|me'], 'h|mu': this.hiragana.u['h|mu'], 'h|mo': this.hiragana.o['h|mo']},
            {'h|ya': this.hiragana.a['h|ya'], 'h|yu': this.hiragana.u['h|yu'], 'h|yo': this.hiragana.o['h|yo']},
            {'h|ra': this.hiragana.a['h|ra'], 'h|ri': this.hiragana.i['h|ri'], 'h|re': this.hiragana.e['h|re'], 'h|ru': this.hiragana.u['h|ru'], 'h|ro': this.hiragana.o['h|ro']},
            {'h|wa': this.hiragana.a['h|wa'], 'h|wo': this.hiragana.o['h|wo'], 'h|n': this.hiragana.o['h|n']},
        ];
        this.workingData = Object.assign({},
            {'h|a': this.hiragana.a['h|a'], 'h|i': this.hiragana.i['h|i'], 'h|e': this.hiragana.e['h|e'], 'h|u': this.hiragana.u['h|u'], 'h|o': this.hiragana.o['h|o']}
        );
        for (let j = 1; j < i; j++) {
            Object.assign(this.workingData, levels[j]);
        }
        this.quizzType = "hiragana";
        this.level = `débutant ${i}`;
        return this.runQuizz(message);
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

    katakanaBegginer(message, i) {
        this.katakana = new Katakana();
        const levels = [
            {'k|a': this.katakana.a['k|a'], 'k|i': this.katakana.i['k|i'], 'k|e': this.katakana.e['k|e'], 'k|u': this.katakana.u['k|u'], 'k|o': this.katakana.o['k|o']},
            {'k|ka': this.katakana.a['k|ka'], 'k|ki': this.katakana.i['k|ki'], 'k|ke': this.katakana.e['k|ke'], 'k|ku': this.katakana.u['k|ku'], 'k|ko': this.katakana.o['k|ko']},
            {'k|sa': this.katakana.a['k|sa'], 'k|shi': this.katakana.i['k|shi'], 'k|se': this.katakana.e['k|se'], 'k|su': this.katakana.u['k|su'], 'k|so': this.katakana.o['k|so']},
            {'k|ta': this.katakana.a['k|ta'], 'k|chi': this.katakana.i['k|chi'], 'k|te': this.katakana.e['k|te'], 'k|tsu': this.katakana.u['k|tsu'], 'k|to': this.katakana.o['k|to']},
            {'k|na': this.katakana.a['k|na'], 'k|ni': this.katakana.i['k|ni'], 'k|ne': this.katakana.e['k|ne'], 'k|nu': this.katakana.u['k|nu'], 'k|no': this.katakana.o['k|no']},
            {'k|ha': this.katakana.a['k|ha'], 'k|hi': this.katakana.i['k|hi'], 'k|he': this.katakana.e['k|he'], 'k|fu': this.katakana.u['k|fu'], 'k|ho': this.katakana.o['k|ho']},
            {'k|ma': this.katakana.a['k|ma'], 'k|mi': this.katakana.i['k|mi'], 'k|me': this.katakana.e['k|me'], 'k|mu': this.katakana.u['k|mu'], 'k|mo': this.katakana.o['k|mo']},
            {'k|ya': this.katakana.a['k|ya'], 'k|yu': this.katakana.u['k|yu'], 'k|yo': this.katakana.o['k|yo']},
            {'k|ra': this.katakana.a['k|ra'], 'k|ri': this.katakana.i['k|ri'], 'k|re': this.katakana.e['k|re'], 'k|ru': this.katakana.u['k|ru'], 'k|ro': this.katakana.o['k|ro']},
            {'k|wa': this.katakana.a['k|wa'], 'k|wo': this.katakana.o['k|wo'], 'k|n': this.katakana.o['k|n']},
        ];
        this.workingData = Object.assign({},
            {'k|a': this.katakana.a['k|a'], 'k|i': this.katakana.i['k|i'], 'k|e': this.katakana.e['k|e'], 'k|u': this.katakana.u['k|u'], 'k|o': this.katakana.o['k|o']}
        );
        for (let j = 1; j < i; j++) {
            Object.assign(this.workingData, levels[j]);
        }
        this.quizzType = "katakana";
        this.level = `débutant ${i}`;
        return this.runQuizz(message);
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

    allBegginer(message, i) {
        this.katakana = new Katakana();
        this.hiragana = new Hiragana();
        const levels = [
            {'k|a': this.katakana.a['k|a'], 'k|i': this.katakana.i['k|i'], 'k|e': this.katakana.e['k|e'], 'k|u': this.katakana.u['k|u'], 'k|o': this.katakana.o['k|o'],
                'h|a': this.hiragana.a['h|a'], 'h|i': this.hiragana.i['h|i'], 'h|e': this.hiragana.e['h|e'], 'h|u': this.hiragana.u['h|u'], 'h|o': this.hiragana.o['h|o']},
            {'h|ka': this.hiragana.a['h|ka'], 'h|ki': this.hiragana.i['h|ki'], 'h|ke': this.hiragana.e['h|ke'], 'h|ku': this.hiragana.u['h|ku'], 'h|ko': this.hiragana.o['h|ko'],
                'k|ka': this.katakana.a['k|ka'], 'k|ki': this.katakana.i['k|ki'], 'k|ke': this.katakana.e['k|ke'], 'k|ku': this.katakana.u['k|ku'], 'k|ko': this.katakana.o['k|ko']},
            {'h|sa': this.hiragana.a['h|sa'], 'h|shi': this.hiragana.i['h|shi'], 'h|se': this.hiragana.e['h|se'], 'h|su': this.hiragana.u['h|su'], 'h|so': this.hiragana.o['h|so'],
                'k|sa': this.katakana.a['k|sa'], 'k|shi': this.katakana.i['k|shi'], 'k|se': this.katakana.e['k|se'], 'k|su': this.katakana.u['k|su'], 'k|so': this.katakana.o['k|so']},
            {'h|ta': this.hiragana.a['h|ta'], 'h|chi': this.hiragana.i['h|chi'], 'h|te': this.hiragana.e['h|te'], 'h|tsu': this.hiragana.u['h|tsu'], 'h|to': this.hiragana.o['h|to'],
                'k|ta': this.katakana.a['k|ta'], 'k|chi': this.katakana.i['k|chi'], 'k|te': this.katakana.e['k|te'], 'k|tsu': this.katakana.u['k|tsu'], 'k|to': this.katakana.o['k|to']},
            {'h|na': this.hiragana.a['h|na'], 'h|ni': this.hiragana.i['h|ni'], 'h|ne': this.hiragana.e['h|ne'], 'h|nu': this.hiragana.u['h|nu'], 'h|no': this.hiragana.o['h|no'],
                'k|na': this.katakana.a['k|na'], 'k|ni': this.katakana.i['k|ni'], 'k|ne': this.katakana.e['k|ne'], 'k|nu': this.katakana.u['k|nu'], 'k|no': this.katakana.o['k|no']},
            {'h|ha': this.hiragana.a['h|ha'], 'h|hi': this.hiragana.i['h|hi'], 'h|he': this.hiragana.e['h|he'], 'h|fu': this.hiragana.u['h|fu'], 'h|ho': this.hiragana.o['h|ho'],
                'k|ha': this.katakana.a['k|ha'], 'k|hi': this.katakana.i['k|hi'], 'k|he': this.katakana.e['k|he'], 'k|fu': this.katakana.u['k|fu'], 'k|ho': this.katakana.o['k|ho']},
            {'h|ma': this.hiragana.a['h|ma'], 'h|mi': this.hiragana.i['h|mi'], 'h|me': this.hiragana.e['h|me'], 'h|mu': this.hiragana.u['h|mu'], 'h|mo': this.hiragana.o['h|mo'],
                'k|ma': this.katakana.a['k|ma'], 'k|mi': this.katakana.i['k|mi'], 'k|me': this.katakana.e['k|me'], 'k|mu': this.katakana.u['k|mu'], 'k|mo': this.katakana.o['k|mo']},
            {'h|ya': this.hiragana.a['h|ya'], 'h|yu': this.hiragana.u['h|yu'], 'h|yo': this.hiragana.o['h|yo'],
                'k|ya': this.katakana.a['k|ya'], 'k|yu': this.katakana.u['k|yu'], 'k|yo': this.katakana.o['k|yo']},
            {'h|ra': this.hiragana.a['h|ra'], 'h|ri': this.hiragana.i['h|ri'], 'h|re': this.hiragana.e['h|re'], 'h|ru': this.hiragana.u['h|ru'], 'h|ro': this.hiragana.o['h|ro'],
                'k|ra': this.katakana.a['k|ra'], 'k|ri': this.katakana.i['k|ri'], 'k|re': this.katakana.e['k|re'], 'k|ru': this.katakana.u['k|ru'], 'k|ro': this.katakana.o['k|ro']},
            {'h|wa': this.hiragana.a['h|wa'], 'h|wo': this.hiragana.o['h|wo'], 'h|n': this.hiragana.o['h|n'],
                'k|wa': this.katakana.a['k|wa'], 'k|wo': this.katakana.o['k|wo'], 'k|n': this.katakana.o['k|n']},
        ];
        this.workingData = Object.assign({},
            {'k|a': this.katakana.a['k|a'], 'k|i': this.katakana.i['k|i'], 'k|e': this.katakana.e['k|e'], 'k|u': this.katakana.u['k|u'], 'k|o': this.katakana.o['k|o'],
                'h|a': this.hiragana.a['h|a'], 'h|i': this.hiragana.i['h|i'], 'h|e': this.hiragana.e['h|e'], 'h|u': this.hiragana.u['h|u'], 'h|o': this.hiragana.o['h|o']}
        );
        for (let j = 1; j < i; j++) {
            Object.assign(this.workingData, levels[j]);
        }
        this.quizzType = "kanas";
        this.level = `débutant ${i}`;
        return this.runQuizz(message);
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

    JLPT5(message, voc) {
        return new Promise((resolve, reject) => {
            let data;
            if (voc) {
                data = new Vocabulary();
                this.quizzType = "vocabulaire";
            } else {
                data = new Kanjis();
                this.quizzType = "kanji";
            }
            data.constructDataBase().then(() => {
                this.workingData = data.JLPTS.JLPT5;
                this.level = "JLPT5";
                this.runQuizz(message).then(xp => resolve(xp));
            }).catch(err => reject(err));
        })
    }

    JLPT4(message, voc) {
        return new Promise((resolve, reject) => {
            let data;
            if (voc) {
                data = new Vocabulary();
                this.quizzType = "vocabulaire";
            } else {
                data = new Kanjis();
                this.quizzType = "kanji";
            }
            data.constructDataBase().then(() => {
                this.workingData = data.JLPTS.JLPT4;
                this.level = "JLPT4";
                this.runQuizz(message).then(xp => resolve(xp));
            }).catch(err => reject(err));
        })
    }

    JLPT3(message, voc) {
        return new Promise((resolve, reject) => {
            let data;
            if (voc) {
                data = new Vocabulary();
                this.quizzType = "vocabulaire";
            } else {
                data = new Kanjis();
                this.quizzType = "kanji";
            }
            data.constructDataBase().then(() => {
                this.workingData = data.JLPTS.JLPT3;
                this.level = "JLPT3";
                this.runQuizz(message).then(xp => resolve(xp));
            }).catch(err => reject(err));
        })
    }

    JLPT2(message, voc) {
        return new Promise((resolve, reject) => {
            let data;
            if (voc) {
                data = new Vocabulary();
                this.quizzType = "vocabulaire";
            } else {
                data = new Kanjis();
                this.quizzType = "kanji";
            }
            data.constructDataBase().then(() => {
                this.workingData = data.JLPTS.JLPT2;
                this.level = "JLPT2";
                this.runQuizz(message).then(xp => resolve(xp));
            }).catch(err => reject(err));
        })
    }

    JLPT1(message, voc) {
        return new Promise((resolve, reject) => {
            let data;
            if (voc) {
                data = new Vocabulary();
                this.quizzType = "vocabulaire";
            } else {
                data = new Kanjis();
                this.quizzType = "kanji";
            }
            data.constructDataBase().then(() => {
                this.workingData = data.JLPTS.JLPT1;
                this.level = "JLPT1";
                this.runQuizz(message).then(xp => resolve(xp));
            }).catch(err => reject(err));
        })
    }

    answerCorrect(array, answer) {
        let correct = false;
        array.forEach(correctAnswer => {
            if (correctAnswer.includes(answer)) {
                correct = true;
            }
        });
        return correct;
    }

    runQuizz(message) {
        return new Promise((resolve, reject) => {
            this.cleanWorkingData();
            this.successRateData = Object.assign({}, this.workingData);
            this.resetSuccessRateData();
            this.totalQuestions = Object.keys(this.successRateData).length;

            let workingArray = Object.keys(this.workingData);
            let index = get_random_index(workingArray);

            this.printQuestion(message, workingArray[index]);

            const quizz = message.channel.createMessageCollector(m => m.author.id === message.author.id);

            quizz.on('collect', async (msg) => {

                this.messageList.push(msg);

                const answer = msg.content.trim().toLowerCase();

                if (this.answerCorrect(workingArray[index].split('|')[1].split(";")
                    .map(Function.prototype.call, String.prototype.trim)
                    .map(Function.prototype.call, String.prototype.toLowerCase), answer)) {

                    let test = await message.channel.send(':white_check_mark: ' + workingArray[index].split('|')[1]);
                    this.messageList.push(test);
                    this.successRateData[workingArray[index]] = true;
                    this.success += 1;
                    this.xp += 5;

                    this.allMessages.push(this.messageList);

                    if (this.isSuccesRateDataFull()) {
                        this.printResult(message);
                        quizz.stop();
                        return;
                    }

                    this.questionNb += 1;
                    index = this.getIndex(workingArray);

                    this.messageList = [];
                    if (this.allMessages.length >= 2) {
                        this.cleanseMessages(this.allMessages.shift());
                    }
                    this.printQuestion(message, workingArray[index]);

                } else if (answer === 'stop') {

                    this.allMessages.push(this.messageList);
                    this.printResult(message);
                    this.xp = 0;
                    quizz.stop();

                } else {

                    let test = await message.channel.send(
                        new RichEmbed()
                            .setTitle(':x: La réponse était ' + workingArray[index].split('|')[1])
                            .setColor(bot_data.bot_values.bot_color)
                    );
                    this.messageList.push(test);
                    this.failure += 1;
                    this.questionNb += 1;
                    this.totalQuestions += 1;

                    index = this.getIndex(workingArray);
                    this.allMessages.push(this.messageList);
                    this.messageList = [];
                    if (this.allMessages.length >= 2) {
                        this.cleanseMessages(this.allMessages.shift());
                    }
                    this.printQuestion(message, workingArray[index]);

                }
            });

            quizz.on('end', () => {
                let promises = [];
                this.allMessages.forEach(msgArray => {
                    promises.push(this.cleanseMessages(msgArray));
                });

                Promise.all(promises).then(() => {
                    resolve(this.xp * (1 + (this.success / (this.success + this.failure))));
                }).catch(console.error);
            })

        });
    }

}

module.exports = {Quizz};
