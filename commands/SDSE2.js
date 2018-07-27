const lg_var = require("../bot_data");
const RichEmbed = require("discord.js").RichEmbed;
const ALL_DIRS = require("../functions/sdse_utils.js").ALL_DIRS;
const SDSE2 = require("../functions/sdse_utils.js");
const ReactionHandler = require("../functions/reactionHandler.js").ReactionHandler;
const MenuChoice = require("../functions/menu.js").MenuChoice;

class Menu {

    constructor(channel, additionnalReactions) {
        this.index = 0;
        this.reactionList = ["🔚"];
        this.pages = [];
        this.channel = channel;
        this.reactionHandler = undefined;

        this.currMessage = undefined;

        if (additionnalReactions) {
            this.reactionList = this.reactionList.concat(additionnalReactions);
        }
    }

    addPage(embed) {
        this.pages.push(embed);
    }

    resetPages() {
        this.index = 0;
        this.pages = this.pages.shift();
    }

    printFirstPage() {
        return new Promise((resolve, reject) => {
            this.index = 0;
            this.channel.send(this.pages[this.index]).then(msg => {

                this.currMessage = msg;
                this.reactionHandler = new ReactionHandler(msg, this.reactionList);
                this.reactionHandler
                    .addReactions()
                    .then(() => resolve(msg))
                    .catch(err => reject(err));

            }).catch(err => reject(err));
        });
    }

    nextPage() {
        return new Promise((resolve, reject) => {
            if (this.index + 1 === this.pages.length) {
                this.index = 0;
            } else {
                this.index += 1;
            }
            this.currMessage.edit(this.pages[this.index]).then(() => resolve(true))
                .catch(err => reject(err));
        });
    }

    previousPage() {
        return new Promise((resolve, reject) => {
            if (this.index === 0) {
                this.index = this.pages.length - 1;
            } else {
                this.index -= 1;
            }
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
        this.message = message;

        this.menu = new Menu();
        this.embed = undefined;
        this.logMessage = undefined;
        this.partList = [];
        this.channel.send("Log message.").then(msg => {
            this.logMessage = msg;
        }).catch(this.quitEditor);
    }

    getInitialMsg() {
        this.embed = new RichEmbed().setColor(lg_var.bot_values.bot_color)
            .setTitle("SDSE2-In-Discord | 🔚 pour quitter le SDSE2")
            .setDescription(
                "*Veuillez choisir une partie à traduire*\n\n" +
                "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection"
            )
            .setFooter("Page 1/1 - Made by Kazuhiro");

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

        this.menu.channel = this.message.channel;

        this.getInitialMsg();
        this.menu.addPage(this.embed);

        await this.menu.printFirstPage();

        this.menu.reactionHandler.initCollector((reaction) => {

            if (reaction.count === 2) {
                if (reaction.emoji.name === "🔚") {
                    reaction.remove(this.translator).catch(() => true);
                    this.quitEditor();
                }
            }

        }, () => {
            this.menu.currMessage.delete().catch(console.error);
        });

        let menuChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
        menuChoice.sentMessage = this.menu.currMessage;
        this.partChoice = await menuChoice.getChoice(menuChoice.sentMessage);

        await this.printFileChoice();
        this.launchFileBrowser();

    }

    getFileChoice() {
        let fileChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
        fileChoice.sentMessage = this.menu.currMessage;
        fileChoice.first = true;
        fileChoice.getChoice(fileChoice.sentMessage).catch(console.error);
    }

    launchFileBrowser() {
        this.menu.reactionHandler.initCollector(
            (reaction) => {
                if (reaction.count === 2) {

                    if (reaction.emoji.name === "⬅") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.previousPage().then(() => {
                            this.getFileChoice();
                        }).catch(console.error);
                    }
                    if (reaction.emoji.name === "➡") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.nextPage().then(() => {
                            this.getFileChoice();
                        }).catch(() => true);
                    }
                    if (reaction.emoji.name === "🔙") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.resetPages();
                        this.getInitialMsg();
                        this.menu.currMessage.edit(this.embed).catch(console.error);
                        let menuChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
                        menuChoice.sentMessage = this.menu.currMessage;
                        menuChoice.getChoice(menuChoice.sentMessage).then((partChoice) => {
                            this.partChoice = partChoice;
                            this.printFileChoice().then(() => {
                                this.launchFileBrowser();
                            }).catch(err => {
                                console.error(err);
                                this.quitEditor();
                            });
                        }).catch(err => {
                            console.error(err);
                            this.quitEditor();
                        });

                    }

                }

            },
            () => {
            }
        );

        let fileChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
        fileChoice.sentMessage = this.menu.currMessage;
        fileChoice.first = true;
        this.fileChoice = fileChoice.getChoice(fileChoice.sentMessage).catch(console.error);
    }

    getEmbedList() {
        let embedList = [];
        this.embed = new RichEmbed().setColor(lg_var.bot_values.bot_color)
            .setTitle("SDSE2-In-Discord")
            .setDescription(
                "*Veuillez choisir un fichier à traduire*\n\n" +
                "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection\n" +
                "Utilisez les réactions ⬅ et ➡ pour changer de page"
            );

        this.menu.pages = [];
        let keys = Object.keys(ALL_DIRS);
        let choice = ALL_DIRS[keys[this.partChoice]];

        let limit = 0;
        choice.forEach(file => {

            if (limit === 24) {
                embedList.push(this.embed);
                this.embed = new RichEmbed().setColor(lg_var.bot_values.bot_color)
                    .setTitle("SDSE2-In-Discord")
                    .setDescription(
                        "*Veuillez choisir un fichier à traduire*\n\n" +
                        "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection\n" +
                        "Utilisez les réactions ⬅ et ➡ pour changer de page et 🔙 pour revenir au menu principal"
                    );
                limit = 0;
            }

            this.embed.addField(
                file, "test", true
            );
            limit += 1;

        });

        embedList.push(this.embed);
        embedList.forEach((embed, i) => {
            embedList[i].setFooter(`Page ${i + 1}/${embedList.length}`);
            this.menu.addPage(embed);
        });
        this.embed = embedList[0];
        return embedList;
    }

    async printFileChoice() {

        let embedList = this.getEmbedList();

        this.menu.currMessage.edit(embedList[0]).catch(console.error);
        await this.menu.reactionHandler.addReaction("⬅");
        await this.menu.reactionHandler.addReaction("➡");
        await this.menu.reactionHandler.addReaction("🔙");

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
