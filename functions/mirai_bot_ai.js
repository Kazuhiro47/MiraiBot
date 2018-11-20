const {get_random_in_array} = require("./parsing_functions");
const Wait = require("./wait").Wait;
const typingSpeed = 0.2840909090909091;

class GachaAI {

    constructor(points, channel) {
        this.points = points;
        this.channel = channel;

        this.reactionSentences = ["Nice", "Parfait", "Merveilleux", "Splendide", "Naïssu"];

        return this;
    }


    doSomething() {
        return new Promise((resolve, reject) => {

            if (this.channel) this.channel.startTyping();

            this.gachaDaily().then(() => {

                if (this.points >= 300) {

                    let wannaBuy = Math.random() + (this.points / 300 / 100 * 5);

                    if (wannaBuy > 0.5) {
                        this.buy().then(() => resolve(true)).catch(err => reject(err));
                    } else {
                        resolve(true);
                    }

                } else {
                    resolve(true);
                }

            }).catch(err => reject(err));

        });
    }

    gachaDaily() {
        return new Promise((resolve, reject) => {
            Wait.seconds(typingSpeed * "<gacha daily".length)
                .then(() => this.channel.send("<gacha daily"))
                .then(() => Wait.seconds(3))
                .then(() => this.channel.send(get_random_in_array(this.reactionSentences)))
                .then(() => {
                    this.channel.stopTyping();
                    return Wait.seconds(1)
                })
                .then(() => resolve(true))
                .catch(err => reject(err));
        });
    }

    buy() {
        return new Promise((resolve, reject) => {
            Wait.seconds(typingSpeed * "<gacha scoutOne".length)
                .then(() => this.channel.send("<gacha scoutOne"))
                .then(() => Wait.seconds(3))
                .then(() => this.channel.send(get_random_in_array(this.reactionSentences)))
                .then(() => {
                    this.channel.stopTyping();
                    return Wait.seconds(1)
                })
                .then(() => resolve(true))
                .catch(err => reject(err));
        })
    }

}

module.exports = GachaAI;
