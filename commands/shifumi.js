const RichEmbed = require("discord.js").RichEmbed;
let bot_data = require('../bot_data.js');

class Shifumi {

    /**
     *
     * @param id player id
     * @param channel channel to play the game
     * @param player first player
     * @param client discord js client
     */
    constructor(id, channel, player, client) {
        this.reactions = ['✊', '✋', '✌'];
        this.bulkMessages = [];
        this.id = id;

        this.playerOne = player;
        this.playerTwo = undefined;
        this.playerOneChoice = undefined;
        this.playerTwoChoice = undefined;

        this.channel = channel;
        this.client = client;
        return this;
    }

    cleanMessages() {
        this.bulkMessages.forEach(msg => {
            msg.delete().catch(console.error);
        });
    }

    /**
     * Wait for a player to play the game
     */
    async waitForPlayer() {

        let msg = await this.channel.send(new RichEmbed()
            .setColor(bot_data.bot_values.bot_color)
            .setAuthor(
                `Qui veut jouer avec ${this.playerOne.displayName} ?`,
                this.playerOne.user.avatarURL
            )
        );

        await msg.react('🆗');

        const waitPlayer = msg.createReactionCollector(() => {
            return true;
        });

        waitPlayer.on('collect', reaction => {

            let rId = reaction.users.last().id;

            if (rId === bot_data.bot_values.bot_id) {
                return;
            }

            if (rId !== this.id) {
                this.playerTwo = this.channel.guild.members.find('id', rId);
                waitPlayer.stop();
            } else {
                this.playerTwo = this.channel.guild.members.find('id', rId);
                waitPlayer.stop();
            }

        });

        waitPlayer.on('end', () => {

            if (this.playerTwo === undefined) {
                msg.delete().catch(console.error);
                return;
            }

            this.runGame().catch(err => {
                console.error(err);
                this.cleanMessages();
            });

        });

    }

    getPlayerChoice(player, index) {
        return new Promise((resolve, reject) => {

            let createMsgAndAddReactions = async () => {

                let msg = await player.send(new RichEmbed()
                    .setColor(bot_data.bot_values.bot_color)
                    .setTitle("Pierre ✊ / Feuille ✋ / Ciseaux ✌")
                    .setDescription("Veuillez réagir avec la réaction correspondante.")
                );

                for (let i = 0; i < this.reactions.length; i++) {
                    await msg.react(this.reactions[i]);
                }

                return msg;
            };

            let doIt = async () => {

                let msg = await createMsgAndAddReactions();

                const game = msg.createReactionCollector(() => {
                    return true;
                });

                game.on('collect', reaction => {

                    if (reaction.users.array().length === 1) {
                        return;
                    }

                    let i = 0;
                    this.reactions.forEach(r => {
                        if (reaction.emoji.name === r) {
                            if (index === 1) {
                                this.playerOneChoice = i;
                            } else {
                                this.playerTwoChoice = i;
                            }
                            game.stop();
                        }
                        i += 1;
                    });

                });

                game.on("end", () => {
                    resolve(true);
                });

            };

            doIt().catch(err => reject(err));

        });
    }

    async runGame() {

        Promise.all([
            this.getPlayerChoice(this.playerOne, 1),
            this.getPlayerChoice(this.playerTwo, 2)
        ]).then(() => {
            this.computeOutcome();
        }).catch(err => {
            console.error(err);
            this.cleanMessages();
        })

    }

    computeOutcome() {

        const choices = ['pierre', 'feuille', 'ciseaux'];

        let choice1 = choices[this.playerOneChoice];
        let choice2 = choices[this.playerTwoChoice];

        this.printOutcome(choice1, choice2);

    }

    printOutcome(choice1, choice2) {

        const outcomes = {
            'pierre': {'pierre': undefined, 'feuille': false, 'ciseaux': true},
            'feuille': {'pierre': true, 'feuille': undefined, 'ciseaux': false},
            'ciseaux': {'pierre': false, 'feuille': true, 'ciseaux': undefined}
        };
        let winner;
	let loser;
	let winnerChoice;
	let loserChoice;

        if (outcomes[choice1][choice2] === undefined) {
            return this.runGame().catch(console.error);
        } else if (outcomes[choice1][choice2]) {
            winner = this.playerOne;
            winnerChoice = choice1;
            loser = this.playerTwo;
           loserChoice = choice2;
        } else {
            winner = this.playerTwo;
            winnerChoice = choice2;
            loser = this.playerOne;
            loserChoice = choice1;
        }

        this.channel.send(new RichEmbed().setColor(bot_data.bot_values.bot_color)
            .setAuthor(winner.displayName, winner.user.avatarURL)
            .setTitle("Gagnant !")
            .addField(`${winner.displayName} gagne avec ${winnerChoice} !`, `Et ${loser.displayName} perd avec ${loserChoice}`)
        ).catch(console.error);

        let shifumiStat1 = this.client.userstat.get(this.playerOne.id);
        let shifumiStat2 = this.client.userstat.get(this.playerTwo.id);
        shifumiStat1.shifumi = false;
        shifumiStat2.shifumi = false;
        this.client.userstat.set(this.playerOne.id, shifumiStat1);
        this.client.userstat.set(this.playerTwo.id, shifumiStat2);

    }

}

exports.run = (client, message, args) => {

    if (!message.member) {
        message.channel.send("Personne avec qui jouer dans ce channel.").catch(console.error);
        return;
    }

    let shifumiStat = client.userstat.get(message.author.id);

    if (!shifumiStat) {
        client.userstat.set(message.author.id, bot_data.userstat);
        shifumiStat = client.userstat.get(message.author.id);
    }

    if (!("shifumi" in shifumiStat)) {
        shifumiStat.shifumi = false;
    }

    if (args[0] === 'stop') {
        shifumiStat.shifumi = false;
        this.client.userstat.set(message.author.id, shifumiStat);
    }

    if (shifumiStat.shifumi === true) {
        message.channel.send("Partie de shifumi déjà en cours, tapez **/shifumi stop** pour l'arrêter.").catch(console.error);
    }

    new Shifumi(message.author.id, message.channel, message.member, client)
        .waitForPlayer()
        .catch(console.error);

};
