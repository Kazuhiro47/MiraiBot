/*
** Created by sam44 for Js_Mirai_Bot
** 30/12/2017
*/

exports.run = (client, message) => {

    console.log('Launching best_op command');

    let best_openings = [
        'https://www.youtube.com/watch?v=eQDK1qhzf6o',
        'https://youtu.be/qwNrL1NSfxY',
        'https://youtu.be/xMmOwXCmdTk'
    ];

    best_openings.forEach(opening => {

        message.channel.send(opening).catch(console.error);

    });

};