class ReactionHandler {

    /**
     * Constructor of the reaction handler
     * @param message an existing message in a discord channel
     * @param reactionListInit optional parameter to init a list of reaction to the message
     */
    constructor(message, reactionListInit) {
        this.message = message;
        this.collector = undefined;

        if (reactionListInit) {
            this.reactionList = reactionListInit;
        } else {
            this.reactionList = [];
        }
    }

    /**
     * removes every reactions of the message
     * @returns {Promise<bool>} resolve(true) if success, reject(err_message) if failure
     */
    removeAllReactions() {
        return new Promise((resolve, reject) => {
            if (!this.message) {
                reject("Message is undefined or null");
            }
            let reactionPromises = [];
            this.message.reactions.array().forEach(react => {
                reactionPromises.push(react.remove());
            });

            Promise.all(reactionPromises).then(() => {
                resolve(true);
            }).catch(err => reject(err));
        });
    }

    /**
     *
     * @param notordered if set to true, adds the reactions without order
     * @returns {Promise<bool>} resolve(true) if success, reject(err_message) if failure
     */
    addReactions(notordered) {
        return new Promise((resolve, reject) => {

            let promises = [];

            if (!notordered) {

                let addAll = async () => {
                    for (let i = 0; i < this.reactionList.length; i++) {
                        await this.message.react(this.reactionList[i]);
                    }
                };
                promises.push(addAll());

            } else {

                this.reactionList.forEach(reaction => {
                    promises.push(this.message.react(reaction))
                });

            }
            Promise.all(promises).then(() => resolve(true)).catch(err => reject(err));
        });
    }

    addReaction(reaction) {
        this.reactionList.push(reaction);
        return this.message.react(reaction);
    }

    removeReaction(reaction) {
        this.reactionList.splice(this.reactionList.indexOf(reaction), 1);
        return this.message.reactions.find('name', reaction).remove();
    }

    /**
     *
     * @param func on collect function
     * @param endFunc on end function
     * @param filter filter of the collector
     */
    initCollector(func, endFunc, filter) {
        if (!filter) {
            filter = () => {
                return true
            };
        }
        this.collector = this.message.createReactionCollector(filter);

        this.collector.on('collect', func);

        this.collector.on('end', endFunc);
    }

}

module.exports = {ReactionHandler};
