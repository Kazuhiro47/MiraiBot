const fs = require("fs");
let CsvReadableStream = require('csv-reader');

class JLPT {
    constructor() {
        this.JLPTS = {
            JLPT5: {},
            JLPT4: {},
            JLPT3: {},
            JLPT2: {},
            JLPT1: {}
        }
    }
}

class Vocabulary extends JLPT {

    constructOneFile(path) {
        return new Promise((resolve, reject) => {

            let inputStream = fs.createReadStream(path, 'utf8');

            let object = this.JLPTS;

            inputStream
                .pipe(CsvReadableStream({ trim: true, skipEmptyLines: true, multiline: false }))
                .on('data', function (row) {
                    let japaneseKanji = `${row[1]} / ${row[2]}`;
                    let transcription = `${row[3]}`.replace(/,+/g, ';');
                    object[`JLPT${row[0][1]}`][`|${transcription}`] = `${japaneseKanji}`;
                })
                .on('end', function (data) {
                    resolve(true);
                });

        });
    }

    constructDataBase() {
        return new Promise((resolve, reject) => {
            let promises = [];

            for (let i = 1 ; i <= 5 ; i++) {
                promises.push(this.constructOneFile(`./learn_japanese/vocabulary/vocJLPTN${i.toString()}.csv`));
            }

            Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));
        });
    }
}

class Kanjis extends JLPT {

     constructOneEnFile(path, jlptNb) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {encoding:'utf8'}, (err, data) => {

                if (err) {
                    reject(err);
                } else {

                    data.split('\n').forEach(line => {

                        let kanjiData = line.split(/\t+/g);

                        this.JLPTS[`JLPT${jlptNb}`][`|${kanjiData[2]}`] = `${kanjiData[0]} / ${kanjiData[1]}`;

                    });

                    resolve(true);
                }

            });
        });
    }

    constructEnDataBase() {
        return new Promise((resolve, reject) => {
            let promises = [];

            for (let i = 1 ; i <= 5 ; i++) {
                promises.push(this.constructOneEnFile(`./learn_japanese/JLPT${i.toString()}.csv`, i));
            }

            Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));
        });
    }

    constructOneFile(path) {
        return new Promise((resolve, reject) => {

            let inputStream = fs.createReadStream(path, 'utf8');

            let object = this.JLPTS;

            inputStream
                .pipe(CsvReadableStream({ trim: true, skipEmptyLines: true, multiline: false }))
                .on('data', function (row) {
                    let japaneseKanji = `${row[1]} / ${row.slice(2, 4)}`;
                    let transcription = `${row[4]}`.replace(/,+/g, ';');
                    object[`JLPT${row[0][1]}`][`|${transcription}`] = `${japaneseKanji}`;
                })
                .on('end', function (data) {
                    resolve(true);
                });

        });
    }

    constructDataBase() {
        return new Promise((resolve, reject) => {
            let promises = [];

            for (let i = 1 ; i <= 5 ; i++) {
                promises.push(this.constructOneFile(`./learn_japanese/jlpt_all/kanjisJLPTN${i.toString()}.csv`));
            }

            Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));
        });
    }
}

module.exports = {Kanjis, Vocabulary};
