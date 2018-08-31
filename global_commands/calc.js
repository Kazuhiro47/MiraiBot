exports.run = (client, message, args) => {

    let result = eval(args.join(" "));

    message.channel.send(`Résultat : ${result}`).catch(console.error);

};