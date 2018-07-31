const bot_data = require("../bot_data");
const RichEmbed = require("discord.js").RichEmbed;
const ALL_DIRS = require("../functions/sdse_utils.js").ALL_DIRS;
const SDSE2 = require("../functions/sdse_utils.js");
const fs = require("fs");
const ReactionHandler = require("../functions/reactionHandler.js").ReactionHandler;
const MenuChoice = require("../functions/menu.js").MenuChoice;

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};

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
        console.log("Menu created");
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

    resetReactionHandler() {
        if (this.reactionHandler.collector) {
            this.reactionHandler.collector.stop();
        }
        this.reactionHandler = new ReactionHandler(this.currMessage, this.reactionList);
    }
}

class SDSE2Editor {

    constructor(message, client) {
        this.logChannel = client.channels.find("id", "452118364161048576");

        this.id = message.author.id;
        this.translator = message.author;
        this.client = client;
        this.channel = message.channel;
        this.message = message;

        this.menuChoice = undefined;
        this.fileChoice = undefined;

        this.menu = new Menu();
        this.embed = undefined;
        this.logMessage = undefined;
        this.partList = [];

        this.logmsginit = "Rapport d'activité sdse2 :\n\n";
        if (!message.member)
            this.logmsginit += "Le sdse est lancé en mp, les réactions seront donc à enlever manuellement.";
        this.channel.send(this.logmsginit).then(msg => {
            this.logMessage = msg;
        }).catch(this.quitEditor);

        this.currScenes = [];

        this.translationBuffer = undefined;
        this.translationGetter = undefined;
        this.msgBuffer = undefined;

        return this;
    }

    _getInitialMsg() {
        this.embed = new RichEmbed().setColor(bot_data.bot_values.bot_color)
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

        this._getInitialMsg();
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
        });

        if (this.menuChoice) {
            delete this.menuChoice;
        }
        this.menuChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
        this.menuChoice.sentMessage = this.menu.currMessage;
        this.partChoice = await this.menuChoice.getChoice(this.menuChoice.sentMessage);

        await this._printFileChoice();
        this._launchFileBrowser();

    }

    _getFileChoice() {
        if (this.fileChoice) {
            delete this.fileChoice;
        }
        this.fileChoice = new MenuChoice(this.message, this.menu.pages[this.menu.index].fields, this.menu.pages[this.menu.index]);
        this.fileChoice.sentMessage = this.menu.currMessage;
        this.fileChoice.first = true;
        this.fileChoice.sendBackMenu();
        return this.fileChoice.getChoice(this.fileChoice.sentMessage);
    }

    _launchFileBrowser() {
        this.menu.reactionHandler.initCollector(
            (reaction) => {
                if (reaction.count === 2) {

                    if (reaction.emoji.name === "⬅") {
                        reaction.remove(this.translator).catch(() => true);
                        this.fileChoice.reactionHandler.collector.stop();
                        this.menu.previousPage().then(() => {
                            this._getFileChoice().then(fileChoice => {
                                this._openFileFolder(this.menu.pages[this.menu.index].fields[fileChoice].name).catch(console.error);
                            }).catch(console.error);
                        }).catch(console.error);
                    }
                    if (reaction.emoji.name === "➡") {
                        reaction.remove(this.translator).catch(() => true);
                        this.fileChoice.reactionHandler.collector.stop();
                        this.menu.nextPage().then(() => {
                            this._getFileChoice().then(fileChoice => {
                                this._openFileFolder(this.menu.pages[this.menu.index].fields[fileChoice].name).catch(console.error);
                            }).catch(console.error);
                        }).catch(() => true);
                    }
                    if (reaction.emoji.name === "🔙") {
                        reaction.remove(this.translator).catch(() => true);
                        this.fileChoice.reactionHandler.collector.stop();
                        this._returnToMainMenu();
                    }

                }

            },
            () => {
            }
        );

        this._getFileChoice().then(fileChoice => {
            this._openFileFolder(this.menu.pages[this.menu.index].fields[fileChoice].name).catch(console.error);
        }).catch(console.error);
    }

    _returnToMainMenu() {
        this.menu.resetPages();
        this._getInitialMsg();
        this.menu.currMessage.edit(this.embed).catch(console.error);

        if (this.menuChoice) {
            delete this.menuChoice;
        }
        this.menuChoice = new MenuChoice(this.message, this.embed.fields, this.embed);
        this.menuChoice.sentMessage = this.menu.currMessage;
        this.menuChoice.getChoice(this.menuChoice.sentMessage).then((partChoice) => {
            this.partChoice = partChoice;
            this._printFileChoice().then(() => {
                this._launchFileBrowser();
            }).catch(err => {
                console.error(err);
                this.quitEditor();
            });
        }).catch(err => {
            console.error(err);
            this.quitEditor();
        });
        this.menu.reactionHandler.collector.stop();
    }

    _getEmbedList() {
        let embedList = [];
        this.embed = new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setTitle("SDSE2-In-Discord")
            .setDescription(
                "*Veuillez choisir un fichier à traduire*\n\n" +
                "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection\n" +
                "Utilisez les réactions ⬅ et ➡ pour changer de page"
            );

        this.menu.pages = [];
        let keys = Object.keys(ALL_DIRS);
        this.partChosen = keys[this.partChoice];
        let choice = ALL_DIRS[this.partChosen];

        let limit = 0;
        choice.forEach(file => {

            if (limit === 9) {
                embedList.push(this.embed);
                this.embed = new RichEmbed().setColor(bot_data.bot_values.bot_color)
                    .setTitle("SDSE2-In-Discord")
                    .setDescription(
                        "*Veuillez choisir un fichier à traduire*\n\n" +
                        "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection\n" +
                        "Utilisez les réactions ⬅ et ➡ pour changer de page et 🔙 pour revenir au menu principal"
                    );
                limit = 0;
            }

            //todo: add file stat
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

    async _printFileChoice() {

        let embedList = this._getEmbedList();

        this.menu.currMessage.edit(embedList[0]).catch(console.error);
        await this.menu.reactionHandler.addReaction("⬅");
        await this.menu.reactionHandler.addReaction("➡");
        await this.menu.reactionHandler.addReaction("🔙");

    }

    _getFileWorkingEmbed() {
        let keys = Object.keys(ALL_DIRS);
        return new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setTitle(this.currentFileName)
            .setDescription(keys[this.partChoice]);
    }

    async _openFileFolder(fileChoice) {
        this.currentFileName = fileChoice;
        let DR2File = new SDSE2.DR2File(fileChoice);
        this.currScenes = [];

        await this.logMessage.edit("Veuillez patienter...");
        console.log(`Working directory : ${DR2File.directory}, ${fileChoice}`);
        if (DR2File.checkDir()) {

            await DR2File.computeScenesInfo();

            this.menu.pages = [];
            this.menu.index = 0;

            console.log(`Scene number : ${DR2File.scenesInfo.length}`);

            DR2File.scenesInfo.forEach(scene => {

                if (!scene.line) {
                    return;
                }
                let embed = this._getFileWorkingEmbed();

                if (scene.flash !== -1) {
                    if (String(scene.flash.pad(3)) in SDSE2.ALL_IMG.flash) {
                        console.log(`${scene.flash.pad(3)} image has been set`);
                        embed.setImage(SDSE2.ALL_IMG.flash[String(scene.flash.pad(3))]);
                    }
                } else if (scene.sprite.sprite_id !== -1) {

                    let key = `${scene.sprite.char_id.pad(2)}_${scene.sprite.sprite_id.pad(2)}`;

                    if (key in SDSE2.ALL_IMG.sprites) {
                        embed.setImage(SDSE2.ALL_IMG.sprites[key]);
                    }
                } else if (scene.bgd !== -1) {
                    let key = scene.bgd.pad(3);

                    if (key in SDSE2.ALL_IMG.bgd) {
                        embed.setImage(SDSE2.ALL_IMG.bgd[key]);
                    }
                }

                if (scene.line.text.french === "") {
                    embed.addField("Texte Français", "__[A TRADUIRE]__");
                } else {
                    embed.addField("Texte Français", scene.line.text.french);
                }
                if (scene.line.text.english === "") {
                    return;
                } else {
                    embed.addField("Texte Anglais", scene.line.text.english);
                }
                if (scene.line.text.japanese === "") {
                    return;
                } else {
                    embed.addField("Texte Japonais", scene.line.text.japanese);
                }
                embed.setFooter(`Ligne ${scene.index + 1}/${DR2File.scenesInfo.length}`);

                this.menu.addPage(embed);
                this.currScenes.push(scene);

            });

            this.embed = this.menu.pages[0];
            await this.logMessage.edit(`Fichier ${fileChoice} chargé`);
            this._initializeFileNavigation();

        } else {
            console.error("Couldn't open file");
            this._returnToMainMenu();
        }
    }

    _initializeFileNavigation() {
        this.menu.currMessage.edit(this.menu.pages[this.menu.index]).catch(console.error);

        this.menu.reactionHandler.removeReactionList(["⬇", "⬆", "🆗"]).catch(console.error);

        this.menu.resetReactionHandler();
        this.logMessage.edit("Utilisez la réaction 📝 pour modifier la ligne actuelle\n💾 vous permet de sauvegarder vos changements").catch(console.error);
        this.menu.reactionHandler.addReactionList(["⬅", "➡", "📝", "💾"]).catch(console.error);
        this.menu.reactionHandler.initCollector(
            (reaction) => {
                if (reaction.count === 2) {

                    //todo: Reload function

                    if (reaction.emoji.name === "📝") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.reactionHandler.removeReactionList(["⬅", "➡", "💾"]).catch(console.error);
                        this.menu.resetReactionHandler();
                        this._initializeLineEditor();
                    }
                    if (reaction.emoji.name === "💾") {
                        reaction.remove(this.translator).catch(() => true);
                        this._saveAll().catch(console.error);
                    }
                    if (reaction.emoji.name === "⬅") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.previousPage().then(() => {
                        }).catch(console.error);
                    }
                    if (reaction.emoji.name === "➡") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.nextPage().then(() => {
                        }).catch(() => true);
                    }
                    if (reaction.emoji.name === "🔙") {
                        reaction.remove(this.translator).catch(() => true);
                        this.fileChoice.reactionHandler.collector.stop();
                        this.menu.reactionHandler.removeReactionList(["💾", "📝"]).catch(console.error);
                        this.menu.reactionHandler.addReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
                        this.menu.resetPages();
                        this.menu.resetReactionHandler();
                        this._printFileChoice().then(() => {
                            this._launchFileBrowser();
                        }).catch(console.error);
                    }

                }

            },
            () => {
            }
        );

    }

    _initializeLineEditor() {

        this.channel.send("Envoyez votre texte. Vous validerez ensuite la saisie avec une réaction.").then(guideMsg => {
            this.channel.send("```" + this.menu.pages[this.menu.index].fields[0].value + "```").then((msg) => {

                this.msgBuffer = msg;
                let translationBufferReaction = new ReactionHandler(this.msgBuffer, ["✅", "❌"]);
                let messageToListen = undefined;

                translationBufferReaction.addReactions().catch(console.error);

                this.translationGetter = this.channel.createMessageCollector((m) => m.author.id !== bot_data.bot_values.bot_id);
                this.translationGetter.on("collect", m => {
                    m.delete().then(m => {

                        let content = SDSE2.formatContent(m.content);

                        this.msgBuffer.edit(`\`\`\`${content}\`\`\``).catch(console.error);
                    }).catch(() => {
                        messageToListen = m;

                        this.client.on("messageUpdate", (oldMessage, newMessage) => {

                            if (oldMessage.id === messageToListen.id) {
                                this.msgBuffer.edit(`\`\`\`${newMessage.content}\`\`\``).catch(console.error);
                            }

                        });

                        this.translationGetter.stop();
                    });
                });

                translationBufferReaction.initCollector((reaction) => {
                    if (reaction.count === 2) {
                        if (reaction.emoji.name === "✅") {
                            this.translationGetter.stop();
                            this.menu.pages[this.menu.index].fields[0].value = this.msgBuffer.content.slice(3, this.msgBuffer.content.length - 3);
                            this.menu.currMessage.edit(this.menu.pages[this.menu.index]).catch(console.error);
                            guideMsg.delete().catch(console.error);
                            this.msgBuffer.delete().catch(console.error);
                            translationBufferReaction.collector.stop();
                            this._initializeFileNavigation();
                        }
                        if (reaction.emoji.name === "❌") {
                            this.translationGetter.stop();
                            guideMsg.delete().catch(console.error);
                            this.msgBuffer.delete().catch(console.error);
                            translationBufferReaction.collector.stop();
                            this._initializeFileNavigation();
                        }
                    }
                }, () => {

                });

                this.menu.reactionHandler.initCollector((reaction) => {

                    if (reaction.count === 2) {

                        if (reaction.emoji.name === "🔙") {
                            this.translationGetter.stop();
                            reaction.remove(this.translator).catch(() => true);
                            guideMsg.delete().catch(console.error);
                            this.msgBuffer.delete().catch(console.error);
                            this.fileChoice.reactionHandler.collector.stop();
                            this.menu.reactionHandler.removeReactionList(["📝", "💾"]).catch(console.error);
                            this.menu.reactionHandler.addReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
                            this.menu.resetPages();
                            this.menu.resetReactionHandler();
                            this._printFileChoice().then(() => {
                                this._launchFileBrowser();
                            }).catch(console.error);
                        }

                    }

                }, () => {

                });

            }).catch(console.error);
        }).catch(console.error);

    }

    async _saveLine(lineObject, index) {

        let newMsgContent = this.menu.pages[index].fields[0].value;

        //todo: Handle duplicate lines

        await lineObject.updateLineAndSave(
            newMsgContent,
            this.logMessage,
            this.logChannel,
            this.translator.username
        );

    }

    async _saveAll() {

        let scenes = this.currScenes;
        let scene;

        for (let i = 0 ; i < scenes.length ; i++) {

            scene = scenes[i];

            await this._saveLine(scene.line, i);

        }

    }

    quitEditor() {
        if (this.translationGetter) {
            this.translationGetter.stop();
        }
        if (this.msgBuffer) {
            this.msgBuffer.delete().catch(console.error);
        }

        this.menu.currMessage.delete().catch(console.error);
        this.logMessage.delete().catch(console.error);
        this.channel.send(`SDSE2 de ${this.translator.username} fermé.`).catch(console.error);
    }

}

exports.run = (client, message) => {

    if (message.member && message.member.roles.find("id", "473236153315885069")) {

        let sdse = new SDSE2Editor(message, client);

        sdse.initMenuSDSE().catch(console.error);
    }

};
