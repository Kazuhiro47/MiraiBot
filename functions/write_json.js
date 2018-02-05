module.exports = {

    write_to_file: function (obj, fileName, message, log_message=null) {
        let json_var = JSON.stringify(obj);

        let fs = require('graceful-fs');

        fs.writeFile(fileName, json_var, 'utf8', (err) => {
            if (err) {
                console.error(err);
                message.channel.send("L'ajout de l'anniversaire a échoué.").catch(err => {
                    console.error(err);
                    console.error("write_json.js Ligne 13");
                });
                return;
            }
            if (log_message) {
                message.channel.send(log_message).catch(err => {
                    console.error(err);
                    console.error("write_json.js Ligne 19");
                });
            }
        });

    }

};