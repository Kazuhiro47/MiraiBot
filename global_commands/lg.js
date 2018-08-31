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
const LoupGarou = require("../lg/lg_game");

exports.run = (client, message, args) => {

    const gSettings = client.gSettings.get(message.guild.id);

    let LG = client.LG.get(message.guild.id);

    if (LG === undefined || LG === null) {
        LG = bot_data.LG;
        client.LG.set(message.guild.id, LG);
    }

    if (!LG.running) {
        LG.running = true;
        new LoupGarou.Game(client, message).launch();
    } else {
        message.channel.send("Partie de LG déjà en cours").catch(console.error);
    }

    if (args[0] === "stat") {
        message.channel.send(JSON.stringify(LG)).catch(console.error);
    }


    /*// Getting players
    if (!LG.participants_complete && LG.lg_on && args[0] === 'join') {

        if (!Object.keys(LG.players).includes(message.member.id)) {

            LG.players[message.member.id] = {
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

            message.member.addRole(LG.lg_game_roles.JoueurLG.object).catch(console.error);

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

    if (!LG.participants_complete && LG.lg_on && args[0] === 'lead') {

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

        if (Object.keys(LG.players).includes(target.id)) {

            LG.stemming_player = target.id;
            send.message_curr_chan(message, "LG - Préparation", `${target.displayName} est maintenant le meneur du jeu.`).catch(console.error);

        } else {
            message.channel.send(`${target.user.username} ne participe pas au loup garou.\n` +
                `Veuillez choisir parmi les participants suivants :`).then(() => {
                lg_functions.show_participants(client, message, message.member).catch(console.error);
            });
            return;
        }

    }

    if (LG.lg_on && args[0] === 'leave') {

        if (message.member.id === LG.stemming_player) {

            // If the stemming player wants to leave, he has to select another stemming player which will replace him,
            // giving the right of stopping the game.
            message.channel.send('Tu as lancé la partie, tu dois donc désigner un joueur qui pourra stopper la partie ' +
                `à ta place en tapant **${gSettings.prefix}lg lead <pseudo>**`).catch(message.error);
            return;
        }

        if (Object.keys(LG.players).includes(message.member.id)) {

            //todo: handle if there is an amoureux who wants to leave game -> unset the couple
            delete LG.players[message.member.id];

            send.message_curr_chan(message, 'LG - Préparation', `*${message.member.displayName}* quitte le loup-garou !`);

            Object.keys(LG.lg_game_roles).forEach(role_name => {
                role_setup.remove_role_to_player(message, message.member, role_name);
            });

        } else {

            let msg = `Tu ne participes pas au loup-garou, *${message.member.displayName}*.`;

            send.message_curr_chan(message, 'LG - Préparation', msg);
        }

    }

    if (!LG.participants_complete && LG.lg_on && args[0] === 'players') {
        lg_functions.show_participants(client, message, message.member).catch(console.error);
        return;
    }

    // CLosing participations. Only the one who launched the lg game can stop it, as well as the admins of the bot
    if (!LG.participants_complete && LG.lg_on && args[0] === 'complete') {

        if (message.member.id !== LG.stemming_player && !gSettings.guild_admins.includes(message.member.id)) {

            send.message_curr_chan(message, 'LG - Préparation',
                `Seuls ${lg_functions.get_admin_strlist(client, message)}, et <@${LG.stemming_player}> peuvent clôturer les participations et lancer le jeu`)
                .catch(console.error);
            return;
        }

        lg_functions.show_participants(client, message, message.member).catch(console.error);

        // Minimum 5 players to launch the game
        if (Object.keys(LG.players).length < 5) {

            send.message_curr_chan(message, 'LG - Préparation', "Il faut 5 joueurs minimum.")
                .catch(console.error);

            LG.participants_complete = false;

        } else {

            LG.participants_complete = true;

            let channelSetupPromise = [];

            //let chanExists = channel_exists(client, message);
            /!*if (chanExists.condition) {
                channelSetupPromise.push(setup_permissions(client, message, chanExists.categoryChan));
            } else {
                channelSetupPromise.push(setup_channels(client, message));
            }*!/
            channelSetupPromise.push(channel_setup.setup_channels(client, message));

            Promise.all(channelSetupPromise).then(() => {

                send.message_curr_chan(message, 'LG - Préparation', "Channels créés").catch(console.error);

                role_setup.assign_roles(client, message).then(() => {

                    LG.role_attributed = true;
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
                send.msg(message, message.channel, "Erreur - LG", "Erreur lors de la création/GameConfiguration des channels")
                    .catch(console.error);
            });

        }
    }

    // Stopping the LG game
    if (LG.lg_on && args[0] === 'stop') {

        console.log(message.member.id);
        console.log(LG.stemming_player);
        if ((message.member.id === LG.stemming_player) || (gSettings.guild_admins.includes(message.member.id))) {
            game_ending.reset_game(client, message);
        }
        else {

            send.message_curr_chan(message, 'LG - Jeu', `Tu n'as pas la ` +
                `permission d'arrêter le jeu, <@${message.member.id}>.\nSeuls ${lg_functions.get_admin_strlist(client, message)} et ` +
                `<@${LG.stemming_player}> peuvent stopper le jeu en tapant la commande **${gSettings.prefix}lg stop**.`);
        }


    }

    if (LG.lg_on && !['join', 'complete', 'stop', 'players', 'leave'].includes(args[0])) {
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
    }*/

};
