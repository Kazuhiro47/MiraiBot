/*
** Created by sam44 for Js_Mirai_Bot
** 31/12/2017
*/

exports.run = (client, message) => {

    console.log('Launching patch command');
    message.channel.send({
        embed: {
            color: message.guild.me.displayColor,
            author: {
                name: `Patch Danganronpa 6.2`,
                icon_url: message.guild.me.user.avatarURL
            },
            fields: [
                {
                    name: "**Installateur automatique**",
                    value: `http://www.mediafire.com/file/48kq6mmn59ipt7m/Patch_6.2%20Auto%20Installer.rar`,
                },
                {
                    name: '**Bonne vielle méthode**',
                    value: 'http://www.mediafire.com/file/qyyp5ok8iyyb7bt/Patch_6.2.rar'
                }
            ]
        }
    });
    message.channel.send('https://youtu.be/RIgCLig9sA8');

};