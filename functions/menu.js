const RichEmbed = require("discord.js").RichEmbed;
const bot_data = require("../bot_data.js");
const ReactionHandler = require("./reactionHandler").ReactionHandler;
const BOT_COLOR = bot_data.bot_values.bot_color;

class MenuChoice {

    /**
     * Instantiate a choice for a rich embed
     * @param message message object, in order to retrieve user and the channel
     * @param fields fields of the rich embed
     * @param embed the rich embed, don't forget to set the "sentMessage" property of this class if
     * you put this parameter
     * @returns {MenuChoice}
     */
    constructor(message, fields, embed) {
        this.messageIsSent = false;
        this.first = false;
        this.user = message.author;
        this.channel = message.channel;
        this.selectedItemId = 0;
        this.fields = fields;

        this.leftToken = "---[__";
        this.rightToken = "__]---";

        this.reactionHandler = undefined;

        if (embed) {
            this.menuMessage = embed;
            this.messageIsSent = true;
        } else {
            this.menuMessage = new RichEmbed()
                .setColor(BOT_COLOR)
                .setTitle("Pick an option");
        }

        this.sentMessage = undefined;

        return this;
    }

    printMenu() {
        this.refreshSelectedItems();
        this.sendBackMenu();
    }

    resetDisplay() {
        this.fields.forEach((field, index) => {
            if (field.name.startsWith(this.leftToken[0])) {
                this.fields[index].name = field.name.slice(
                    this.leftToken.length, field.name.length - this.rightToken.length
                );
            }
        });

        for (let index = 0; index < this.menuMessage.fields.length; index++) {
            this.menuMessage.fields[index].name = this.fields[index].name;
        }
        return this.sentMessage.edit(this.menuMessage);

    }

    refreshSelectedItems() {

        this.fields.forEach((field, index) => {
            if (field.name.startsWith(this.leftToken[0])) {
                this.fields[index].name = field.name.slice(
                    this.leftToken.length, field.name.length - this.rightToken.length
                );
            }
        });
        this.fields[this.selectedItemId].name = this.leftToken + this.fields[this.selectedItemId].name + this.rightToken;
    }

    sendBackMenu() {

        if (!this.messageIsSent) {
            this.fields.forEach((field, i) => {

                let title = field.name;

                if (this.selectedItemId === i) {
                    title = field.name.toUpperCase();
                }

                this.menuMessage.addField(
                    title,
                    this.fields[i].value
                );

            });

            this.channel.send(this.menuMessage).catch((err) => console.error(err)).then((msg) => {
                this.sentMessage = msg;
                this.getChoice(msg).catch(console.error);
            });
            this.messageIsSent = true;
        } else {

            this.refreshSelectedItems();

            for (let index = 0; index < this.menuMessage.fields.length; index++) {
                this.menuMessage.fields[index].name = this.fields[index].name;
            }
            this.sentMessage.edit(this.menuMessage).catch(console.error);

        }
    }

    getChoice(msg) {
        return new Promise((resolve, reject) => {

            const reactions = ['⬇', '⬆', '🆗'];
            this.reactionHandler = new ReactionHandler(msg, reactions);

            let runFct = async () => {
                if (!this.first) {
                    this.sendBackMenu();
                    await this.reactionHandler.addReactions();
                    this.first = true;
                }
            };
            runFct().then(() => {

                this.reactionHandler.initCollector((reaction) => {

                    if (reaction.count !== 2) {
                        return;
                    }

                    if (reaction.emoji.name === '⬇') {

                        if (++this.selectedItemId >= this.fields.length) {
                            this.selectedItemId = 0;
                        }

                        reaction.remove(this.user).catch(() => true);
                        this.sendBackMenu(this.channel);

                    } else if (reaction.emoji.name === '⬆') {

                        if (--this.selectedItemId < 0) {
                            this.selectedItemId = this.fields.length - 1;
                        }

                        reaction.remove(this.user).catch(() => true);
                        this.sendBackMenu(this.channel);

                    } else if (reaction.emoji.name === '🆗') {

                        reaction.remove(this.user).catch(() => true);
                        this.resetDisplay().then(() => {
                            resolve(this.selectedItemId);
                            this.reactionHandler.collector.stop();
                        }).catch(err => {
                            console.error(err);
                            resolve(this.selectedItemId);
                            this.reactionHandler.collector.stop();
                        });
                    }

                }, () => {
                });

            }).catch(err => reject(err));

        });
    }

}

module.exports = {MenuChoice};
