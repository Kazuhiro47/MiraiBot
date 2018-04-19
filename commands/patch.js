/*
** Created by sam44 for Js_Mirai_Bot
** 31/12/2017
*/

exports.run = (client, message) => {

    console.log('Launching patch command');
    message.channel.send("https://equipemirai.com/dr1-patch-fr/").catch(console.error);

};