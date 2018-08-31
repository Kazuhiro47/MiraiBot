const referendumChannelId = "479635710069178370";
const bot_data = require("../../bot_data.js");
const ReactionHandler = require("../reactionHandler").ReactionHandler;
const RichEmbed = require("discord.js").RichEmbed;

class Sondage {

    constructor(options, client, channel, time) {

        this.options = options;
        this.client = client;
        this.channel = channel;
        this.time = time;

        this.field_content = [];

        this.field_emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

        this.choices = {};
        this.emojis_used = [];
        this.votes = [];
        this.hasvoted = [];

    }

    post() {
        return new Promise((resolve, reject) => {
            if (this.options.length < 3) {
                return reject(false);
            }
            if (this.options.length > 11) {
                return reject(false);
            }

            let element;
            for (let i = 0; i < this.options.length; i++) {
                element = this.options[i];
                this.field_content.push({
                    name: `${this.options.indexOf(element)}. ${element}`,
                    value: 'Sondage en cours...'
                });
            }
            this.field_content.splice(0, 1);

            this.channel.send({
                embed: {
                    author: {
                        name: "Sondage",
                        icon_url: this.client.user.avatarURL
                    },
                    title: this.options[0],
                    fields: this.field_content
                }
            }).then((new_message) => {

                this.field_content.forEach((element) => {
                    this.emojis_used.push(this.field_emojis[this.field_content.indexOf(element)]);
                    this.votes.push(0);
                });

                let reactHandler = new ReactionHandler(new_message, this.field_emojis.slice(0, this.options.length - 1), [this, new_message]);

                return reactHandler.addReactions();

            }).then((reactHandler) => {

                reactHandler.initCollector((r) => {
                    if (!this.hasvoted.includes(r.users.last().id)) {
                        if (r.users.last().id !== this.client.user.id) {
                            this.choices[r.users.last().id] = this.emojis_used.indexOf(r.emoji.name);
                            this.votes[this.emojis_used.indexOf(r.emoji.name)] += 1;
                            this.hasvoted.push(r.users.last().id);
                        }
                    } else {
                        if (r.users.last().id !== this.client.user.id) {
                            this.votes[this.choices[r.users.last().id]] -= 1;
                            this.choices[r.users.last().id] = this.emojis_used.indexOf(r.emoji.name);
                            this.votes[this.emojis_used.indexOf(r.emoji.name)] += 1;
                        }
                    }
                    console.log(this.votes);
                }, () => {
                    this.field_content = [];
                    this.options.forEach((element) => {
                        let index = this.options.indexOf(element) - 1;
                        let pourcentage = ((this.votes[index]) / this.hasvoted.length) * 100;
                        this.field_content.push({
                            name: `${this.options.indexOf(element)}. ${element}`,
                            value: `${this.votes[index]} / ${this.hasvoted.length} au total. (${pourcentage.toFixed(1)}%)`
                        });
                    });
                    this.field_content.splice(0, 1);
                    this.channel.send({
                        embed: {
                            author: {
                                name: "Sondage - Résultats",
                                icon_url: this.client.user.avatarURL
                            },
                            title: this.options[0],
                            fields: this.field_content
                        }
                    }).then(() => resolve(true)).catch(err => reject(err));
                }, (reaction) => this.emojis_used.includes(reaction.emoji.name), {
                    time: this.time
                });

            }).catch(err => reject(err));
        });
    }

}

class SondageInfiniteChoice {

    constructor(question, choices, channel, time, embed, deleteIt, deleteAll, maxVotes) {

        this.question = question;
        this.channel = channel;
        this.time = time;

        this.deleteIt = deleteIt;
        this.deleteAll = deleteAll;

        if (maxVotes === 0) {
            this.maxVotes = undefined;
        } else {
            this.maxVotes = maxVotes;
        }

        this.msg = undefined;

        if (embed) {
            this.embed = embed;
        } else {
            this.embed = new RichEmbed();
        }

        this.choices = new Map();
        this.voters = new Map();

        this.timer = undefined;
        this.timerInterval = 5;

        let i = 1;
        choices.forEach(c => {

            this.choices.set(i, {choice: c, votes: 0});
            i += 1;

        });

        return this;

    }

    getChoiceList() {
        let choiceList = [];

        let i = 0;
        for (let [number, voteData] of this.choices.entries()) {
            if (i === 0) {
                choiceList.push(`**${number}**: __**${voteData.choice}**__`);
                i += 1;
            } else {
                choiceList.push(`\n**${number}**: __**${voteData.choice}**__`);
            }
        }

        return choiceList;
    }

    getVoteData() {
        let voteDataArray = [];

        let i = 0;
        for (let voteData of this.choices.values()) {
            if (i === 0) {
                voteDataArray.push(`__${voteData.choice}__: **${voteData.votes}** vote(s)`);
                i += 1;
            } else {
                voteDataArray.push(`\n__${voteData.choice}__: **${voteData.votes}** vote(s)`);
            }
        }

        return voteDataArray;
    }

    getVoters() {
        let i = 0;
        return Array.from(this.voters.keys()).map((element) => {
            if (i === 1) {
                if (element.displayName) return element.displayName;
                else return element.username;
            } else {
                if (element.displayName) return ` ${element.displayName}`;
                else return element.username;
            }
        });
    }

    updateDisplay() {
        this.embed.fields[2].value = this.getVoteData().toString();
        this.embed.fields[4].value = this.getVoters().toString();
        this.msg.edit(this.embed).catch(console.error);
    }

    updateTimer() {
        this.embed.setFooter(`${(this.time / 1000) - this.timerInterval} secondes avant la fin du vote`);
        this.timerInterval += 5;
        this.msg.edit(this.embed).catch(console.error);
    }

    post() {
        return new Promise((resolve, reject) => {

            this.embed = this.embed
                .setTitle(this.question)
                .setDescription("Veuillez taper le nombre correspondant à votre choix avec la commande ```vote <nombre>```")
                .addBlankField()
                .addField("Choix", this.getChoiceList().toString(), true)
                .addField("Votes", this.getVoteData().toString(), true)
                .addBlankField()
                .addField("Votants", "Zéro votants", true)
                .setFooter(`${this.time / 1000} secondes avant la fin du vote`);

            this.channel.send(this.embed).then(msg => {

                console.log(this.embed.fields[2].value.length);

                this.msg = msg;

                this.timer = setInterval(() => {
                    this.updateTimer();
                }, 5000);

                const vote = this.channel.createMessageCollector(m => m.author.id !== bot_data.bot_values.bot_id, {time: this.time});

                vote.on("collect", collectedVote => {

                    if (collectedVote.content.toLowerCase().startsWith("vote") && !isNaN(parseInt(collectedVote.content.split(/ +/g)[1]))) {

                        let content = collectedVote.content.split(/ +/g)[1];

                        let answer = parseInt(content);
                        let member = collectedVote.member;

                        if (!member) {
                            member = collectedVote.author;
                        }

                        if (collectedVote.deletable) collectedVote.delete().catch(console.error);

                        if (isNaN(answer)) {
                            member.send("Veuillez envoyer un nombre").catch(console.error);
                            return;
                        }

                        let choice = this.choices.get(answer);

                        if (!choice) {
                            member.send("Ce nombre ne correspond à personne").catch(console.error);
                            return;
                        }

                        if (this.voters.has(member)) {

                            let oldAnswer = this.voters.get(member);
                            let oldChoice = this.choices.get(oldAnswer);

                            oldChoice.votes -= 1;

                            if (this.maxVotes) {
                                this.maxVotes += 1;
                            }

                            this.choices.set(oldAnswer, oldChoice);

                        }

                        if (this.maxVotes) {
                            this.maxVotes -= 1;
                        }

                        choice.votes += 1;
                        this.choices.set(answer, choice);
                        this.voters.set(member, answer);
                        this.updateDisplay();

                        if (this.maxVotes === 0) {
                            vote.stop();
                        }

                    } else {
                        if (this.deleteAll && collectedVote.deletable) collectedVote.delete().catch(console.error);
                    }

                });

                vote.on("end", (() => {

                    clearInterval(this.timer);

                    let higherChoice = this.getHigherChoice();

                    if (this.deleteIt === true) {
                        this.msg.delete().catch(console.error);
                    } else {

                        if (higherChoice.length > 1) {

                            let array = [];

                            higherChoice.forEach(c => {
                                array.push(`**${this.choices.get(c).choice}**`);
                            });

                            this.embed.addField("**Choix du peuple**", array.toString(), true)
                        } else if (higherChoice.length === 0) {
                            this.embed.addField("**Choix du peuple**", `**Le vote est nul**`, true);
                        } else {
                            this.embed.addField("**Choix du peuple**", `**${this.choices.get(higherChoice[0]).choice}**`, true);
                        }

                        this.msg.edit(this.embed
                            .setAuthor("**Vote terminé**")
                            .setFooter("Vote terminé")
                        ).catch(console.error);
                    }

                    let responseArray = [];

                    higherChoice.forEach(c => {
                        responseArray.push([c, this.choices.get(c)]);
                    });

                    resolve(responseArray);

                }));

            }).catch(err => reject(err));

        });
    }

    getHigherChoice() {

        let highest = 1;
        let dupes = [];

        for (let [number, voteData] of this.choices.entries()) {

            if (voteData.votes > this.choices.get(highest).votes) {
                highest = number;
            }

        }

        for (let [number, voteData] of this.choices.entries()) {

            if (this.choices.get(highest).votes === voteData.votes && highest !== number) {
                dupes.push(number);
            }

        }

        if (dupes.length > 0) {
            if (this.choices.get(dupes[0]).votes === 0) {
                return [];
            }

            return dupes.concat([highest]);
        }

        return [highest];

    }

}

class Referendum {

    constructor(question, discordClient, referendumAuthor) {
        this.question = question;
        this.client = discordClient;
        this.author = referendumAuthor;
        this.referendumChannel = this.client.channels.get(referendumChannelId);
    }

    channelExists() {
        return this.referendumChannel;
    }

    post() {
        return new Promise((resolve, reject) => {
            let referendum = new Sondage(
                [this.question, "Oui", "Non"],
                this.client,
                this.referendumChannel,
                4000//60000 * 60 * 48
            );

            referendum.post().then(() => {
                resolve(true);
            }).catch(err => reject(err));
        });
    }

}

module.exports = {Referendum, Sondage, SondageInfiniteChoice};
