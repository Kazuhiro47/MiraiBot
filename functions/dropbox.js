require('isomorphic-fetch');
const fs = require("graceful-fs"); // or another library of choice.
let Dropbox = require('dropbox').Dropbox;
const bot_values = require('../bot_data.js');
let dbx = new Dropbox({accessToken: bot_values.bot_values.dropbox_token});

function list_folder(path = '/danganronpa 2 traduction fr/sdse2_shared_data/data01/jp') {
    dbx.filesListFolder({
        path: path,
        recursive: false,
        limit: 100
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.log(error);
    });
}

class Revision {
    constructor() {
        this.modifier_name = null;
        this.fileName = null;
        this.date = null;
        this.data = null;
    }
}

function get_file_data(path, encoding = 'utf16le', trad = true) {
    return new Promise((resolve, reject)=> {
    fs.readFile(path, encoding, (err, data) => {
        if (err)
            return reject(err);
        if (trad && !data.includes('<text lang'))
            resolve(get_file_data(path, 'utf8', trad));
        resolve(data);
    });
    })
}

/**
 * This function gets all the revisions of a dropbox file from its path in dropbox directory
 * @param path : String path from root directory of dropbox folder
 * @param callback : function function when get_revisions is done with those parameters => (err, revisions)
 */
function get_revisions(path, callback) {
    let allRevisions = [];
    let rev;
    dbx.filesListRevisions({path: path}).then(response => {
        let pending = 0;
        response.entries.forEach(revision => {
            pending += 1;
            dbx.usersGetAccount({account_id: revision.sharing_info.modified_by}).then(account => {
                pending += 1;
                let file_path = "../.." + revision.path_display.replace("sdse2_shared_data", "SDSE2_Shared_Data");

                dbx.filesDownload({
                    path: file_path.substr(5),
                    rev: revision.rev
                }).then((downloadedFile) => {
                    let data = downloadedFile.fileBinary;

                    rev = new Revision();
                    let frenchText;
                    let englishText;
                    if (data.indexOf("<text lang=\"en\">") === -1) {
                        data = Buffer.from(data, 'utf8').toString('utf16le');
                    }
                    if (data.includes("<text lang=\"en\">")) {
                        frenchText = data.substring(data.indexOf("<text lang=\"en\">") + "<text lang=\"en\">".length, data.indexOf("</text>")).replace(/&lt;CLT \d\d&gt;/g, "").replace(/&lt;CLT&gt;/g, "");
                        englishText = data.substring(data.indexOf("<text lang=\"ja\">") + "<text lang=\"ja\">".length, data.indexOf("</text>", data.indexOf("</text>") + "</text>".length)).replace(/&lt;CLT \d\d&gt;/g, "").replace(/&lt;CLT&gt;/g, "");
                    } else {
                        frenchText = "";
                        englishText = data.substring(data.indexOf("<text lang=\"ja\">") + "<text lang=\"ja\">".length, data.indexOf("</text>")).replace(/&lt;CLT \d\d&gt;/g, "").replace(/&lt;CLT&gt;/g, "");
                    }
                    let japaneseText = data.substring(data.indexOf("<comment>") + "<comment>".length, data.indexOf("</comment>")).replace(/&lt;CLT \d\d&gt;/g, "").replace(/&lt;CLT&gt;/g, "");
                    rev.data = `*Français :* **${frenchText}**\n*Anglais :* ${englishText}\n*Japonais :* ${japaneseText}`;
                    rev.modifier_name = {
                        name: account.name.display_name,
                        email: account.email
                    };
                    rev.fileName = revision.name;
                    let tab = revision.client_modified.split('-');
                    tab.splice(2, 1);
                    rev.date = `${revision.client_modified.split('-')[2].substr(0, 2)}/${tab[1]}/${tab[0]}`;
                    allRevisions.push(rev);
                    pending -= 1;
                    if (pending === 0) {
                        return callback(null, allRevisions);
                    }
                }, (err) => {
                    pending -= 1;
                    console.error(err);
                });
                pending -= 1;
            }).catch(console.error);
        });
    }).catch(console.error);
}

module.exports = {
    get_revisions, get_file_data
};