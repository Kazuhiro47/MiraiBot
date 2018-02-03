module.exports = {

    write_to_file: function (obj, fileName, message, log_message) {
        let json_var = JSON.stringify(obj);

        let fs = require('fs');

        fs.writeFile(fileName, json_var, 'utf8', (err) => {
            if (err) {
                console.error(err);
                message.channel.send("L'ajout de l'anniversaire a échoué.").catch(err => {
                    console.error(err);
                    console.error("write_json.js Ligne 13");
                });
                return;
            }
            message.channel.send(log_message).catch(err => {
                console.error(err);
                console.error("write_json.js Ligne 19");
            });
        });
    }

};