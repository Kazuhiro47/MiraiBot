exports.run = (client) => {

    let date = new Date();
    console.log(`${date.getUTCDate()}/${date.getUTCMonth() + 1} ${date.getUTCHours() + 1}:${date.getUTCMinutes()}:${date.getUTCSeconds()} | J'essaye de me reconnecter...`);

};