const lg_var = require("../bot_data");
let RichEmbed = require("discord.js").RichEmbed;

class TranslationStat {
    constructor(id) {
        this.id = id;
        this.fileTranslated = 0;
        this.running = false;
    }
}

class SDSE2Editor {

    constructor(translator, client, channel) {
        this.id = translator.id;
        this.translator = translator;
        this.client = client;
        this.channel = channel;
        this.menuMsgCollector = null;
    }

    initMenuSDSE() {
        this.translator.createDM().then(channel => {

            channel.send(new RichEmbed().setColor(lg_var.bot_values.bot_color)
                .setTitle("SDSE2-In-Discord")
                .setDescription("*Traduire sur Discord c'est possible*")
                .addField("Guide du Mirai_SDSE2", "Ci-dessous les différentes commandes pour traduire Danganronpa 2 avec Discord.")
                .addField("//quit", "*quitter le mirai_sdse2*")).catch(console.error);

            this.menuMsgCollector = channel.createMessageCollector((m) => m.author.id === this.translator.id);
            this.setupMenuChoices();
        }).catch(console.error);
    }

    setupMenuChoices() {
        this.menuMsgCollector.on('collect', msg => {

            let SDSE2commandsList = ['quit'];
            let SDSE2commands = {
                quit: this.quitEditor
            };

            if (msg.content.startsWith('//')) {
                msg = msg.content.slice(2);
                if (SDSE2commandsList.includes(msg)) {
                    SDSE2commands[msg]();
                }
            }

        });
    }

    quitEditor() {
        this.menuMsgCollector.stop();
        this.channel.send(`SDSE2 de ${this.translator.displayName} fermé.`).catch(console.error);
    }

}

exports.run = (client, message) => {

    const command = message.content.slice('/SDSE2 '.length, message.content.length).toLowerCase().trim().split(/ +/g);

    client.SDSE2Data.set(message.author.id, new SDSE2Editor(message.author, client, message.channel));

    let UserSDSE2 = client.SDSE2Data.get(message.author.id);

    /*if (UserSDSE2Stat.running) {
        message.delete(msg => {
            msg.channel.send("Ton SDSE2 est déjà en cours d'utilisation").catch(console.error);
        });
        return;
    }*/

    UserSDSE2.initMenuSDSE();

};