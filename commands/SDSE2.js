const bot_data = require("../bot_data");
const RichEmbed = require("discord.js").RichEmbed;
const ALL_DIRS = require("../functions/sdse_utils.js").ALL_DIRS;
const SDSE2 = require("../functions/sdse_utils.js");
const fs = require("fs");
const ReactionHandler = require("../functions/reactionHandler.js").ReactionHandler;
const MenuChoice = require("../functions/menu.js").MenuChoice;
const Menu = require("../functions/menu.js").Menu;

Number.prototype.pad = function (size) {
    let s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

Array.prototype.unique = function () {
    return Array.from(new Set(this));
};

class Editor {

    constructor(message, client) {

        this.logChannel = client.guilds.get("168673025460273152").channels.find("id", "452118364161048576");

        this.totalFilesModified = 0;
        this.timeUsed = new Date();

        this.id = message.author.id;
        this.translator = message.author;
        this.client = client;
        this.channel = message.channel;
        this.message = message;

        this.menuChoice = null;
        this.fileChoice = null;

        this.menu = new Menu();
        this.embed = null;
        this.logMessage = null;
        this.partList = [];

        this.currScenes = [];

        this.translationBuffer = null;
        this.translationGetter = null;
        this.msgBuffer = null;

        this.dupeDB = null;

        this.currScenesToSave = [];

        this.editorName = "";
        this.SDSE_ALL_DIRS = "";

        this.totalFilesNumber = 0;

    }

    _getInitialMsg() {
        this.embed = new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setTitle(`${this.editorName}-In-Discord | 🔚 pour quitter le ${this.editorName}`)
            .setDescription(
                "*Veuillez choisir une partie à traduire*\n\n" +
                "Utilisez les réaction ⬇ et ⬆ pour choisir, puis 🆗 pour valider votre sélection"
            )
            .setFooter("Page 1/1 - Made by Kazuhiro");

        Object.keys(this.SDSE_ALL_DIRS).forEach(part => {
            if (part === "FTE") {
                let length = 0;
                Object.keys(this.SDSE_ALL_DIRS[part]).forEach(character => {
                    length += Object.keys(this.SDSE_ALL_DIRS[part][character]).length;
                });
                this.embed.addField(part, `${length} fichiers`, true);
                this.partList.push([part, true]);
            } else {
                this.embed.addField(part, `${Object.keys(this.SDSE_ALL_DIRS[part]).length} fichiers`, true);
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

        //if (this.partChoice)

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

    _jump() {
        return new Promise((resolve, reject) => {
            this.channel.send("Veuillez taper un nombre").then(jumpMsg => {
                const getJumpNb = this.channel.createMessageCollector(m => m.author.id !== bot_data.bot_values.bot_id && m.author.id && this.translator.id);
                getJumpNb.on('collect', jumpNb => {
                    if (isNaN(parseInt(jumpNb.content))) {
                        this.logMessage.edit(`${this.logMessage.content}\n\nErreur lors du jump : nombre invalide`).catch(console.error);
                        jumpMsg.delete().catch(console.error);
                        getJumpNb.stop();
                    } else {
                        this.menu.jumpToPage(parseInt(jumpNb.content) - 1).catch(console.error);
                        this.logMessage.edit(`${this.logMessage.content.replace("\n\nErreur lors du jump : nombre invalide", "")}`).catch(console.error);
                        jumpMsg.delete().catch(console.error);
                        getJumpNb.stop();
                    }
                });
                getJumpNb.on("end", collected => {
                    collected.forEach(element => {
                        element.delete().catch(console.error);
                    });
                    return resolve(true);
                });
            }).catch(console.error);
        });
    }

    _launchFileBrowser() {
        this.menu.reactionHandler.initCollector(
            (reaction) => {
                if (reaction.count === 2) {

                    if (reaction.emoji.name === "🈁") {
                        reaction.remove(this.translator).catch(() => true);
                        this.fileChoice.reactionHandler.collector.stop();
                        this._jump().then(() => {
                            this._getFileChoice().then(fileChoice => {
                                this._openFileFolder(this.menu.pages[this.menu.index].fields[fileChoice].name).catch(console.error);
                            }).catch(console.error);
                        }).catch(console.error);
                    }
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
        await this.menu.reactionHandler.addReactionList(["🔙", "⬅", "➡", "🈁"]);

    }

    _getFileWorkingEmbed() {
        let keys = Object.keys(ALL_DIRS);
        return new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setTitle(`**${this.currentFileName}** | *${keys[this.partChoice]}*`)
            .setDescription(
                "Utilisez la réaction 📝 pour modifier la ligne actuelle\n" +
                `💾 sauvegarde les lignes du fichier actuel (${this.currentFileName} en l'occurrence), **N'OUBLIEZ PAS DE LE FAIRE**\n` +
                "🈁 jump à une ligne précise\n" +
                "🈳 récupère le texte japonais\n" +
                "📘 ouvre le sous-menu des traductions récurrentes\n"
            );
    }

    async _openFileFolder(fileChoice) {
        await this.logMessage.edit("Veuillez patienter...");

        this.currentFileName = fileChoice;
        let DR2File = new SDSE2.DR2File(fileChoice);
        this.currScenes = [];

        console.log(`Working directory : ${DR2File.directory}, ${fileChoice}`);
        if (DR2File.checkDir()) {

            await DR2File.computeScenesInfo();

            console.log(`Scene number : ${DR2File.scenesInfo.length}`);

            this.menu.pages = [];
            this.menu.index = 0;

            DR2File.scenesInfo.forEach(scene => {

                if (!scene.line) {
                    return;
                }
                let embed = this._getFileWorkingEmbed();

                if (scene.flash !== -1) {
                    if (String(scene.flash.pad(3)) in SDSE2.ALL_IMG.flash) {
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

                let speaker = SDSE2.CHAR_IDS[scene.speaker];
                if (!speaker) {
                    speaker = "???";
                }

                if (scene.line.text.french === "") {
                    embed.addField(`Texte Français | Locut(rice/eur) *${speaker}*`, "__[A TRADUIRE]__");
                } else {
                    embed.addField(`Texte Français | Locut(rice/eur) *${speaker}*`, scene.line.text.french);
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

        //todo: add similarity sub menu navigator

        let initialLogMessageContent = this.logMessage.content;
        this.menu.currMessage.edit(this.menu.pages[this.menu.index]).catch(console.error);
        this.menu.reactionHandler.removeReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
        this.menu.resetReactionHandler();
        this.menu.reactionHandler.addReactionList(["⬅", "➡", "📝", "💾", "🈁", "🈳", "📘"]).catch(console.error);
        this.menu.reactionHandler.initCollector(
            (reaction) => {
                if (reaction.count === 2) {

                    //todo: Reload function

                    if (reaction.emoji.name === "📝") {
                        reaction.remove(this.translator).catch(() => true);
                        this.menu.reactionHandler.removeReactionList(["⬅", "➡", "💾", "🈁", "🈳", "📘"]).catch(console.error);
                        this.menu.resetReactionHandler();
                        this._initializeLineEditor();
                    } else if (reaction.emoji.name === "💾") {
                        this._saveAll().then(() => {
                            reaction.remove(this.translator).catch(() => true);
                        }).catch(console.error);
                    } else if (reaction.emoji.name === "🈁") {
                        reaction.remove(this.translator).catch(() => true);
                        this._jump().catch(console.error);
                    } else if (reaction.emoji.name === "🈳") {
                        reaction.remove(this.translator).catch(() => true);
                        if (this.logMessage.content.indexOf(this.menu.pages[this.menu.index].fields[2].value) === -1) {
                            this.logMessage.edit(`${this.menu.pages[this.menu.index].fields[2].value}\n${this.logMessage.content}`).catch(console.error);
                        }
                    } else if (reaction.emoji.name === "📘") {
                        reaction.remove(this.translator).catch(() => true);
                        let terminology = new SDSE2.TerminologySubMenu(this.channel, this.translator);
                        terminology.launchMenu().catch(console.error);
                    } else if (reaction.emoji.name === "⬅") {
                        reaction.remove(this.translator).catch(() => true);
                        this.logMessage.edit(initialLogMessageContent).catch(console.error);
                        this.menu.previousPage().then(() => {
                        }).catch(console.error);
                    } else if (reaction.emoji.name === "➡") {
                        reaction.remove(this.translator).catch(() => true);
                        this.logMessage.edit(initialLogMessageContent).catch(console.error);
                        this.menu.nextPage().then(() => {
                        }).catch(() => true);
                    } else if (reaction.emoji.name === "🔙") {
                        this.logMessage.edit("Rapport d'activité sdse2").catch(console.error);
                        if (this.currScenesToSave.length > 0) {
                            this.channel.send("Des changements n'ont pas été sauvegardés. Voulez vous le faire ?").then(msg => {
                                let wantToSaveChanges = new ReactionHandler(msg, ["✅", "❌"]);
                                wantToSaveChanges.addReactions().catch(console.error);
                                wantToSaveChanges.initCollector((reaction) => {
                                    if (reaction.count === 2) {
                                        if (reaction.emoji.name === "✅") {
                                            this._saveAll().catch(err => {
                                                console.error(err);
                                                this.currScenesToSave = [];
                                            });
                                            wantToSaveChanges.collector.stop();
                                        } else if (reaction.emoji.name === "❌") {
                                            this.currScenesToSave = [];
                                            wantToSaveChanges.collector.stop();
                                        }
                                    }
                                }, () => {
                                    msg.delete().catch(console.error);
                                    reaction.remove(this.translator).catch(() => true);
                                    this.fileChoice.reactionHandler.collector.stop();
                                    this.menu.reactionHandler.removeReactionList(["💾", "📝", "🈁", "🈳"]).catch(console.error);
                                    this.menu.reactionHandler.addReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
                                    this.menu.resetPages();
                                    this.menu.resetReactionHandler();
                                    this._printFileChoice().then(() => {
                                        this._launchFileBrowser();
                                    }).catch(console.error);
                                });
                            }).catch(console.error);
                        } else {
                            reaction.remove(this.translator).catch(() => true);
                            this.fileChoice.reactionHandler.collector.stop();
                            this.menu.reactionHandler.removeReactionList(["💾", "📝", "🈁", "🈳"]).catch(console.error);
                            this.menu.reactionHandler.addReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
                            this.menu.resetPages();
                            this.menu.resetReactionHandler();
                            this._printFileChoice().then(() => {
                                this._launchFileBrowser();
                            }).catch(console.error);
                        }
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
                    }).catch(console.error);
                });

                translationBufferReaction.initCollector((reaction) => {
                    if (reaction.count === 2) {
                        if (reaction.emoji.name === "✅") {
                            this.translationGetter.stop();
                            this.menu.pages[this.menu.index].fields[0].value = this.msgBuffer.content.slice(3, this.msgBuffer.content.length - 3);
                            this._updateFileDupes();

                            guideMsg.delete().catch(console.error);
                            this.msgBuffer.delete().catch(console.error);
                            this.menu.currMessage.edit(this.menu.pages[this.menu.index]).then(() => {
                                this.currScenesToSave.push({
                                        line: this.currScenes[this.menu.index].line,
                                        index: this.menu.index
                                    }
                                );
                                this.currScenesToSave = this.currScenesToSave.unique();
                                this._initializeFileNavigation();
                                translationBufferReaction.collector.stop();
                            }).catch(err => {
                                console.error(err);
                                this._initializeFileNavigation();
                                translationBufferReaction.collector.stop();
                            });
                        } else if (reaction.emoji.name === "❌") {
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
                            guideMsg.delete().catch(console.error);
                            this.msgBuffer.delete().catch(console.error);

                            if (this.currScenesToSave.length > 0) {
                                this.channel.send("Des changements n'ont pas été sauvegardés. Voulez vous le faire ?").then(msg => {
                                    let wantToSaveChanges = new ReactionHandler(msg, ["✅", "❌"]);
                                    wantToSaveChanges.addReactions().catch(console.error);
                                    wantToSaveChanges.initCollector((reaction) => {
                                        if (reaction.count === 2) {
                                            if (reaction.emoji.name === "✅") {
                                                this._saveAll().catch(err => {
                                                    console.error(err);
                                                    this.currScenesToSave = [];
                                                });
                                                wantToSaveChanges.collector.stop();
                                            } else if (reaction.emoji.name === "❌") {
                                                this.currScenesToSave = [];
                                                wantToSaveChanges.collector.stop();
                                            }
                                        }
                                    }, () => {
                                        msg.delete().catch(console.error);
                                        reaction.remove(this.translator).catch(() => true);
                                        this.fileChoice.reactionHandler.collector.stop();
                                        this.menu.reactionHandler.removeReactionList(["📝", "💾"]).catch(console.error);
                                        this.menu.reactionHandler.addReactionList(["⬇", "⬆", "🆗"]).catch(console.error);
                                        this.menu.resetPages();
                                        this.menu.resetReactionHandler();
                                        this._printFileChoice().then(() => {
                                            this._launchFileBrowser();
                                        }).catch(console.error);
                                    });
                                }).catch(console.error);
                            } else {
                                reaction.remove(this.translator).catch(() => true);
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

                    }

                }, () => {

                });

            }).catch(console.error);
        }).catch(console.error);

    }

    _updateFileDupes() {
        let thisFile = this.currScenes[this.menu.index].line.path.replace(/\\/g, "/").split("/").slice(5).join("\\");
        let number = this.dupeDB.pathToNumber[thisFile];

        if (number === undefined) {
            return;
        }
        let dupes = this.dupeDB.numberToPath[number];

        let basePath = thisFile.slice(0, thisFile.length - 8);
        dupes.forEach(dupePath => {
            if (dupePath.slice(0, dupePath.length - 8) === basePath) {

                let index = parseInt(dupePath.slice(dupePath.length - 8, dupePath.length - 4));

                this.menu.pages[index].fields[0].value = this.menu.pages[this.menu.index].fields[0].value;

                this.currScenesToSave.push({
                    line: this.currScenes[index].line,
                    index: index
                });
                this.currScenesToSave = this.currScenesToSave.unique();
            }
        })
    }

    async _saveLine(line) {

        let newMsgContent = this.menu.pages[line.index].fields[0].value;

        return await line.lineObj.updateLineAndSave(newMsgContent);

    }

    async _saveAll() {

        let fileToSavePromises = [];

        let scenes = this.currScenesToSave;
        for (let i = 0; i < scenes.length; i++) {
            fileToSavePromises.push(SDSE2.getDupesOf(scenes[i].line, this.dupeDB, scenes[i].index));
        }
        this.currScenesToSave = [];

        let fileToSaveArray = await Promise.all(fileToSavePromises);

        let fileToSave = [];
        fileToSaveArray.forEach(dupesArray => {
            fileToSave = fileToSave.concat(dupesArray);
        });

        fileToSave = fileToSave.unique();

        console.log(`Dupe collected, ${fileToSave.length} files to save`);

        let savingInfoPromises = [];

        for (let i = 0; i < fileToSave.length; i++) {
            savingInfoPromises.push(this._saveLine(fileToSave[i]));
        }

        let filesToSave = await Promise.all(savingInfoPromises);

        if (filesToSave.length === 0) {
            console.error("No files saved");
            return;
        }

        if (filesToSave.length === 1 && filesToSave[0].hasBeenSaved === false) {
            console.error(`${filesToSave[0].path} not saved`);
            return;
        }

        let fileSaved = [];
        filesToSave.forEach(fileToSave => {
            if (fileToSave.hasBeenSaved) {
                fileSaved.push(fileToSave.path);
            }
        });

        if (fileSaved.length === 1) {
            this.logChannel.send(`${this.translator.username} modified ${filesToSave[0].path}.`).catch(console.error);
        } else {
            this.logChannel.send(`${this.translator.username} modified ${filesToSave[0].path} and ${fileSaved.length - 1} other files.`).catch(console.error);
        }
        this.logMessage.edit(`${this.logMessage.content}\n\n${fileSaved.length} fichier(s) sauvegardé(s)`).catch(console.error);
        this.totalFilesModified += fileSaved.length;

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

        this.gSettings = this.client.gSettings.get(this.message.guild.id);
        this.gSettings.sdse2.splice(this.gSettings.sdse2.indexOf(this.channel.id), 1);
        this.client.gSettings.set(this.message.guild.id, this.gSettings);

        let minutes = (new Date() - this.timeUsed) / 1000 / 60;
        let hours = minutes / 60;
        let timeUsed = `${(minutes % 60).toFixed()}m`;
        if (hours >= 1) {
            timeUsed = `${hours.toFixed()}h${timeUsed}`;
        }
        this.channel.send(
            `SDSE2 de ${this.translator.username} fermé.\n` +
            `Durée d'utilisation : ${timeUsed}\n` +
            `Fichiers modifiés : ${this.totalFilesModified}, soit ${(this.totalFilesModified / this.totalFilesNumber * 100).toFixed(3)}% de la traduction totale.`
        ).catch(console.error);
    }

}

class SDSE2Editor extends Editor {

    //todo: make a direct link accessor for a specific file
    constructor(message, client) {

        super(message, client);

        this.editorName = "SDSE2";
        this.SDSE_ALL_DIRS = ALL_DIRS;

        // Updating guild settings with sdse
        this.gSettings = client.gSettings.get(message.guild.id);
        if (!this.gSettings) {
            client.gSettings.set(message.guild.id, bot_data.gSettings);
            this.gSettings = client.gSettings.get(message.guild.id);
        }
        this.gSettings.sdse2.push(message.channel.id);
        client.gSettings.set(message.guild.id, this.gSettings);

        this.totalFilesNumber = 66642;

        this.logmsginit = "Rapport d'activité sdse2\n";
        if (!message.member)
            this.logmsginit += "Le sdse est lancé en mp, les réactions seront donc à enlever manuellement.";
        this.channel.send(this.logmsginit).then(msg => {
            this.logMessage = msg;
        }).catch(this.quitEditor);

        SDSE2.constructDupesDB().then(dupeDB => {
            this.dupeDB = dupeDB;
        }).catch(console.error);

        return this;
    }

    quitEditor() {
        super.quitEditor();

        let SDSE2Data = this.client.SDSE2Data.get(this.translator.id);
        SDSE2Data.inUse = false;
        this.client.SDSE2Data.set(this.translator.id, SDSE2Data);
    }

}

exports.run = (client, message) => {

    const knownUsers = ["140033402681163776", "326699074524938242"];

    let SDSE2Data = client.SDSE2Data.get(message.author.id);
    if (!SDSE2Data) {
        client.SDSE2Data.set(message.author.id, bot_data.SDSE2Data);
        SDSE2Data = client.SDSE2Data.get(message.author.id);
    }

    if (SDSE2Data.inUse) {
        message.channel.send("Veuillez fermer le sdse2 précédent si il y en a un.").catch(console.error);
    }

    if (message.member && (message.member.roles.find("id", "473236153315885069") || knownUsers.includes(message.author.id))) {

        let sdse = new SDSE2Editor(message, client);

        sdse.initMenuSDSE().then(() => {
            SDSE2Data.inUse = true;
            client.SDSE2Data.set(message.author.id, SDSE2Data);
        }).catch(console.error);

    } else {

        message.channel.send("Demandez à <@140033402681163776> de vous attribuer le rôle Discord SDSE2").catch(console.error);

    }


};
