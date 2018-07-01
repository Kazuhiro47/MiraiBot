const fs = require("fs");

class Kanjis {
    constructor() {

        this.JLPTS = {
            JLPT5: {},
            JLPT4: {},
            JLPT3: {},
            JLPT2: {},
            JLPT1: {}
        };

    }

    constructOneFile(path, jlptNb) {
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

    constructDataBase() {
        return new Promise((resolve, reject) => {
            let promises = [];

            for (let i = 1 ; i <= 5 ; i++) {
                promises.push(this.constructOneFile(`./learn_japanese/JLPT${i.toString()}.csv`, i));
            }

            Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));
        });
    }
}

module.exports = {Kanjis};