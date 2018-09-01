class JishoSentence {

    constructor(sentence, jisho) {
        this.sentence = sentence;
        this.jisho = jisho;

        this.errorEncountered = false;
        this.data = [];

        this.maxFields = 25;

        return this;
    }

    async query() {

        let query = await this.jisho.searchForPhrase(this.sentence);

        while (this.sentence.length > 0 && this.errorEncountered === false) {
            this.data.push(this.retrieveData(query.data));
            query = await this.jisho.searchForPhrase(this.sentence);
        }

        return this.data;

    }

    retrieveData(data) {

        let result;
        for (let i = 0; i < data.length ; i++) {
            result = data[i];

            if (result.japanese) {

                let japanese;
                for (let j = 0 ; j < result.japanese.length ; j++) {
                    japanese = result.japanese[j];

                    if (japanese.word && this.sentence.indexOf(japanese.word) !== -1) {

                        this.sentence = this.sentence.slice(this.sentence.indexOf(japanese.word) + japanese.word.length);
                        return data.slice(0, this.maxFields);

                    } else if (japanese.reading && this.sentence.indexOf(japanese.reading) !== -1) {

                        this.sentence = this.sentence.slice(this.sentence.indexOf(japanese.reading) + japanese.reading.length);
                        return data.slice(0, this.maxFields);

                    }

                }

            }

        }

        this.errorEncountered = true;
        return null;

    }

}

module.exports = {JishoSentence};
