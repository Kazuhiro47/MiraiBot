const referendumChannelId = "479635710069178370";

class Sondage {

    constructor(options, client, channel, time) {

        this.options = options;
        this.client = client;
        this.channel = channel;
        this.time = time;

        this.field_content = [];
        this.field_emojis = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];
        this.emojis_used = [];
        this.votes = [];
        this.hasvoted = [];

    }

    post() {
        return new Promise((resolve, reject) => {
            if (this.options.length < 3) {
                return false;
            }
            if (this.options.length > 11) {
                return false;
            }

            let element;
            for (let i = 0 ; i < this.options.length ; i++) {
                element = this.options[i];
                this.field_content.push({name: `${this.options.indexOf(element)}. ${element}`, value: 'Sondage en cours...'});
            }
            this.field_content.splice(0, 1);

            this.channel.send({
                embed: {
                    color: 7419530,
                    author: {
                        name: "Sondage",
                        icon_url: this.client.user.avatarURL
                    },
                    title: this.options[0],
                    description: `Sondage créé par ${message.author.username}.\nIl sera ouvert pendant 60 secondes\nSeul le premier vote sera enregistré.`,
                    fields: this.field_content
                }
            }).then((new_message) => {

                let i = 0;
                function add_reactions(emoji) {
                    new_message.react(`${emoji}`).then(() => {
                        i += 1;
                        if (i < this.field_content.length)
                            return add_reactions(this.field_emojis[i]);
                    });
                }

                this.field_content.forEach((element) => {
                    this.emojis_used.push(this.field_emojis[this.field_content.indexOf(element)]);
                    this.votes.push(0);
                });

                add_reactions(this.field_emojis[0]);

                const collector = new_message.createReactionCollector(
                    (reaction) => this.emojis_used.includes(reaction.emoji.name),
                    { time: this.time }
                );

                collector.on('collect', r => {
                    if (!this.hasvoted.includes(r.users.last().id)) {
                        this.votes[this.field_emojis.indexOf(r.emoji.name)] = this.votes[this.field_emojis.indexOf(r.emoji.name)] + 1;
                        if (r.users.last().id === this.client.user.id) {
                        }  else {
                            this.hasvoted.push(r.users.last().id);
                        }
                    }
                });

                collector.on('end', () => {
                    this.field_content = [];
                    options.forEach((element) => {
                        let index = options.indexOf(element) - 1;
                        let pourcentage = ((this.votes[index] - 1) / this.hasvoted.length) * 100;
                        this.field_content.push({
                            name: `${options.indexOf(element)}. ${element}`,
                            value: `${this.votes[index] - 1} / ${this.hasvoted.length} au total. (${pourcentage}%)`
                        });
                    });
                    this.field_content.splice(0, 1);
                    new_message.delete().catch(console.error);
                    this.channel.send({
                        embed: {
                            color: 7419530,
                            author: {
                                name: "Sondage - Résultats",
                                icon_url: this.client.user.avatarURL
                            },
                            title: this.options[0],
                            description: `Sondage créé par ${message.author.username}.`,
                            fields: this.field_content
                        }
                    }).then(() => resolve(true)).catch(err => reject(err));
                });
            }).catch(err => reject(err));
        });
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
                60000 * 60 * 48
            );

            referendum.post().then(() => {
                resolve(true);
            }).catch(err => reject(err));
        });
    }

}

module.exports = {Referendum};
