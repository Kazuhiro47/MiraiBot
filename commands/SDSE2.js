const lg_var = require("../bot_data");
let RichEmbed = require("discord.js").RichEmbed;
const ALL_DIRS = require("../functions/sdse_utils.js").ALL_DIRS;
const SDSE2 = require("../functions/sdse_utils.js");

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
     * @param ordered if set to true, adds the reactions in order (order of the specified list of reactions)
     * @returns {Promise<bool>} resolve(true) if success, reject(err_message) if failure
     */
    addReactions(ordered) {
        return new Promise((resolve, reject) => {

            let promises = [];

            if (ordered) {

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

class Menu {

    constructor(channel, additionnalReactions) {
        this.index = 0;
        this.reactionList = ["⬆", "⬇", "🔚"];
        this.pages = [];
        this.channel = channel;
        this.reactionHandler = undefined;

        this.currMessage = undefined;

        this.onCollectFct = undefined;
        this.onEndFct = undefined;

        if (additionnalReactions) {
            this.reactionList = this.reactionList.concat(additionnalReactions);
        }
    }

    addPage(embed) {
        this.pages.push(embed);
    }

    printFirstPage() {
        return new Promise((resolve, reject) => {
            this.index = 0;
            this.channel.send(this.pages[this.index]).then(msg => {

                this.currMessage = msg;
                this.reactionHandler = new ReactionHandler(msg, this.reactionList);
                this.reactionHandler
                    .addReactions(true)
                    .then(() => resolve(msg))
                    .catch(err => reject(err));

            }).catch(err => reject(err));
        });
    }

    nextPage() {
        return new Promise((resolve, reject) => {
            if (this.index + 1 === this.pages.length) {
                reject("End of pages");
            }

            this.index += 1;
            this.currMessage.edit(this.pages[this.index]).then(() => resolve(true))
                .catch(err => reject(err));
        });
    }

    previousPage() {
        return new Promise((resolve, reject) => {
            if (this.index === 0) {
                reject("End of pages");
            }

            this.index -= 1;
            this.currMessage.edit(this.pages[this.index]).then(() => resolve(true))
                .catch(err => reject(err));
        });
    }
}

class SDSE2Editor {

    constructor(message, client) {
        this.id = message.author.id;
        this.translator = message.author;
        this.client = client;
        this.channel = message.channel;
        this.emptyFileStr = "<text lang=\"en\" />EMPTY FILE";

        this.menu = new Menu();
        this.embed = undefined;
        this.partList = [];
    }

    getInitialMsg() {
        this.embed = new RichEmbed().setColor(lg_var.bot_values.bot_color)
            .setTitle("SDSE2-In-Discord")
            .setDescription("*Traduire sur Discord c'est possible*")
            .setFooter("Page 1/1");

        Object.keys(ALL_DIRS).forEach(part => {
            if (part === "FTE") {
                let length = 0;
                Object.keys(ALL_DIRS[part]).forEach(character => {
                    length += Object.keys(ALL_DIRS[part][character]).length;
                });
                this.embed.addField(part, `${length} fichiers`, true);
                this.partList.push([part, true]);
            } else {
                this.embed.addField(part, `${Object.keys(ALL_DIRS[part]).length} fichiers`, true);
                this.partList.push([part, false]);
            }
        });
        return true;
    }

    async initMenuSDSE() {

        this.menu.channel = await this.translator.createDM();

        const path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";

        this.getInitialMsg();
        this.menu.addPage(this.embed);

        await this.menu.printFirstPage();

        this.menu.reactionHandler.initCollector((reaction) => {
            if (reaction.count === 2 && reaction.emoji.name === "🔚") {
                reaction.remove(this.translator.user).catch(console.error);
                this.quitEditor();
            }
            if (reaction.count === 2 && reaction.emoji.name === "⬆" || reaction.emoji.name === "⬇") {
                reaction.remove(this.translator.user).catch(console.error);
            }
        }, () => {
            this.menu.currMessage.delete().catch(console.error);
        });

    }

    quitEditor() {
        this.menu.currMessage.delete().catch(console.error);
        this.channel.send(`SDSE2 de ${this.translator.username} fermé.`).catch(console.error);
    }

}

exports.run = (client, message) => {

    let sdse = new SDSE2Editor(message, client);

    sdse.initMenuSDSE().catch(console.error);

};
