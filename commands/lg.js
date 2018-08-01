const lg_var = require('../lg/lg_var.js');
const send = require("../lg/message_sending");
const channel_setup = require("../lg/init/channel_setup");
const role_setup = require("../lg/init/role_setup");
const game_ending = require("../lg/game_core/game_ending");
const day = require("../lg/game_core/day");
const RichEmbed = require("discord.js").RichEmbed;
let bot_data = require("../bot_data.js");
const functions = require("../functions/find_user");
const lg_functions = require("../lg/lg_functions");

function lg_init(client, message) {
    return new Promise((resolve, reject) => {
        let gSettings = client.gSettings.get(message.guild.id);

        gSettings.LG.game_initialized = true;
        gSettings.LG.stemming_player = message.member.id;

        message.channel.send({
            embed: {
                color: 7419530,
                fields: [{
                    name: 'LG - Initialisation',
                    value: "Initialisation du jeu..."
                }]
            }
        }).then(msg => {
            role_setup.create_roles(client, message).then(() => resolve(msg)).catch(error_msg => {
                message.channel.send("Erreur lors de la création des rôles.").catch(console.error);
                reject(error_msg);
            });
        }).catch(err => reject(err));

    });
}

exports.run = (client, message, args) => {

    let gSettings = client.gSettings.get(message.guild.id);

    if (!gSettings) {
        client.gSettings.set(message.guild.id, bot_data.gSettings);
    }
    if (!gSettings.hasOwnProperty("LG")) {
        gSettings.LG = new lg_var.LGGameObject();
    } else {
        if (!gSettings.LG.lg_on) {
            gSettings.LG = new lg_var.LGGameObject();
        }
    }

    // Launching lg game
    if (!gSettings.LG.lg_on && !gSettings.LG.game_initialized && args.length === 0) {
        // initialize the lg game, creating the guide for the game which helps with the commands
        lg_init(client, message).then((msg) => {

            msg.delete().catch(console.error);
            send.message_curr_chan(message, 'LG - Préparation',
                `Tape **${gSettings.prefix}lg join** sur le chat pour participer au jeu ou ` +
                `**${gSettings.prefix}lg leave** pour le quitter pendant la préparation.` +
                `Seul celui qui a lancé le jeu peut le terminer et le lancer. Une fois que tous les ` +
                `participants ont tapé **${gSettings.prefix}lg join** sur le chat, veuillez ` +
                `taper **${gSettings.prefix}lg complete** pour lancer le jeu. Pour arrêter ` +
                `le jeu, tapez **${gSettings.prefix}lg stop**.`
            ).then(() => {

                gSettings.LG.stemming_channel = message.channel;
                gSettings.LG.lg_on = true;
                console.log(`lg_on = ${gSettings.LG.lg_on}. Game initialized`);

            }).catch(console.error);

            let guideMessage = new RichEmbed()
                .setTitle('LG - Guide').setColor(7419530)
                .addField(`${gSettings.prefix}lg join`, "Rejoindre la partie de loup garou.", true)
                .addField(`${gSettings.prefix}lg players`, "Liste les participants du jeu.", true)
                .addField(`${gSettings.prefix}lg leave`, "Quitter la partie de loup garou.", true)
                .addField(`${gSettings.prefix}lg complete`,
                    `Lancer la partie de loup garou lorsque tous les participants ont fait ${gSettings.prefix}lg join`, true)
                .addField(`${gSettings.prefix}lg stop`, "Stopper le jeu de loup garou.", true);

            message.channel.send(guideMessage).catch(console.error);

        }).catch(err => {

            console.error(err);
            game_ending.quit_game_on_error(client, err, message, "Erreur lors de l'initialisation du jeu.");

        });

    }

    // Getting players
    if (!gSettings.LG.participants_complete && gSettings.LG.lg_on && args[0] === 'join') {

        if (!Object.keys(gSettings.LG.players).includes(message.member.id)) {

            gSettings.LG.players[message.member.id] = {

                display_name: message.member.displayName,
                id: message.member.id,
                member_object: message.member,
                immunity: false,
                alive: true,
                has_voted: false,
                infected: false,
                amoureux: null
            };

            send.message_curr_chan(message, 'LG - Préparation', `*${message.member.displayName}* participe au loup-garou !`)
                .catch(console.error);

            message.member.addRole(gSettings.LG.lg_game_roles.JoueurLG.object).catch(console.error);

            if (message.member.presence.status === 'offline') {
                message.channel.send(`Mets-toi en ligne <@${message.member.id}>.`).catch(console.error);
            }

        } else {

            let msg = `Tu participes déjà au loup-garou, *${message.member.displayName}*.`;

            if (message.member.presence.status === 'offline') {
                msg += `\nD'ailleurs, mets-toi en ligne !`
            }
            send.message_curr_chan(message, 'LG - Préparation', msg).catch(console.error);
        }

    }

    if (!gSettings.LG.participants_complete && gSettings.LG.lg_on && args[0] === 'lead') {

        let members = message.guild.members.keyArray();
        let target = functions.find_user(args[1], members, message);

        if (!target) {
            let nature = 'L\'utilisateur n\'a pas été trouvé.';
            let utilisation = `${gSettings.prefix}lg leave <pseudo>`;
            message.channel.send(new RichEmbed()
                .setColor(bot_data.bot_values.bot_color)
                .setTitle(`${gSettings.prefix}lg lead <pseudo>`)
                .addField(nature, utilisation)
            );
            return;
        }

        if (Object.keys(gSettings.LG.players).includes(target.id)) {

            gSettings.LG.stemming_player = target.id;
            send.message_curr_chan(message, "LG - Préparation", `${target.displayName} est maintenant le meneur du jeu.`).catch(console.error);

        } else {
            message.channel.send(`${target.user.username} ne participe pas au loup garou.\n` +
                `Veuillez choisir parmi les participants suivants :`).then(() => {
                lg_functions.show_participants(client, message, message.member).catch(console.error);
            });
            return;
        }

    }

    if (gSettings.LG.lg_on && args[0] === 'leave') {

        if (message.member.id === gSettings.LG.stemming_player) {

            // If the stemming player wants to leave, he has to select another stemming player which will replace him,
            // giving the right of stopping the game.
            message.channel.send('Tu as lancé la partie, tu dois donc désigner un joueur qui pourra stopper la partie ' +
                `à ta place en tapant **${gSettings.prefix}lg lead <pseudo>**`).catch(message.error);
            return;
        }

        if (Object.keys(gSettings.LG.players).includes(message.member.id)) {

            //todo: handle if there is an amoureux who wants to leave game -> unset the couple
            delete gSettings.LG.players[message.member.id];

            send.message_curr_chan(message, 'LG - Préparation', `*${message.member.displayName}* quitte le loup-garou !`);

            Object.keys(gSettings.LG.lg_game_roles).forEach(role_name => {
                role_setup.remove_role_to_player(message, message.member, role_name);
            });

        } else {

            let msg = `Tu ne participes pas au loup-garou, *${message.member.displayName}*.`;

            send.message_curr_chan(message, 'LG - Préparation', msg);
        }

    }

    if (!gSettings.LG.participants_complete && gSettings.LG.lg_on && args[0] === 'players') {
        lg_functions.show_participants(client, message, message.member).catch(console.error);
        return;
    }

    // CLosing participations. Only the one who launched the lg game can stop it, as well as the admins of the bot
    if (!gSettings.LG.participants_complete && gSettings.LG.lg_on && args[0] === 'complete') {

        if (message.member.id !== gSettings.LG.stemming_player && !gSettings.guild_admins.includes(message.member.id)) {

            send.message_curr_chan(message, 'LG - Préparation',
                `Seuls ${lg_functions.get_admin_strlist(client, message)}, et <@${gSettings.LG.stemming_player}> peuvent clôturer les participations et lancer le jeu`)
                .catch(console.error);
            return;
        }

        lg_functions.show_participants(client, message, message.member).catch(console.error);

        // Minimum 5 players to launch the game
        if (Object.keys(gSettings.LG.players).length < 5) {

            send.message_curr_chan(message, 'LG - Préparation', "Il faut 5 joueurs minimum.")
                .catch(console.error);

            gSettings.LG.participants_complete = false;

        } else {

            gSettings.LG.participants_complete = true;

            let channelSetupPromise = [];

            //let chanExists = channel_exists(client, message);
            /*if (chanExists.condition) {
                channelSetupPromise.push(setup_permissions(client, message, chanExists.categoryChan));
            } else {
                channelSetupPromise.push(setup_channels(client, message));
            }*/
            channelSetupPromise.push(channel_setup.setup_channels(client, message));

            Promise.all(channelSetupPromise).then(() => {

                send.message_curr_chan(message, 'LG - Préparation', "Channels créés").catch(console.error);

                role_setup.assign_roles(client, message).then(() => {

                    gSettings.LG.role_attributed = true;
                    send.message_curr_chan(message, 'LG - Préparation', "Rôles attribué et envoyés par mp")
                        .catch(console.error);
                    day.first_day(client, message);

                }).catch(err => {
                    console.error(err);
                    send.msg(message, message.channel, "Erreur - LG", "Erreur lors de l'attribution des rôles")
                        .catch(console.error);
                });

            }).catch(err => {
                console.error(err);
                send.msg(message, message.channel, "Erreur - LG", "Erreur lors de la création/configuration des channels")
                    .catch(console.error);
            });

        }
    }

    // Stopping the LG game
    if (gSettings.LG.lg_on && args[0] === 'stop') {

        console.log(message.member.id);
        console.log(gSettings.LG.stemming_player);
        if ((message.member.id === gSettings.LG.stemming_player) || (gSettings.guild_admins.includes(message.member.id))) {
            game_ending.reset_game(client, message);
        }
        else {

            send.message_curr_chan(message, 'LG - Jeu', `Tu n'as pas la ` +
                `permission d'arrêter le jeu, <@${message.member.id}>.\nSeuls ${lg_functions.get_admin_strlist(client, message)} et ` +
                `<@${gSettings.LG.stemming_player}> peuvent stopper le jeu en tapant la commande **${gSettings.prefix}lg stop**.`);
        }


    }

    if (gSettings.LG.lg_on && !['join', 'complete', 'stop', 'players', 'leave'].includes(args[0])) {
        message.channel.send(
            new RichEmbed()
                .setTitle('LG - Guide').setColor(7419530)
                .addField(`${gSettings.prefix}lg join`, "Rejoindre la partie de loup garou.", true)
                .addField(`${gSettings.prefix}lg players`, "Liste les participants du jeu.", true)
                .addField(`${gSettings.prefix}lg leave`, "Quitter la partie de loup garou.", true)
                .addField(`${gSettings.prefix}lg complete`,
                    `Lancer la partie de loup garou lorsque tous les participants ont fait ${gSettings.prefix}lg join`, true)
                .addField(`${gSettings.prefix}lg stop`, "Stopper le jeu de loup garou.", true)
        ).catch(console.error);
    }

};
