const fs = require('graceful-fs');
const get_revisions_stats = require("./dropbox").get_revisions_stats;
const dr1_path = "../../Danganronpa traduction FR/Super_Duper_Script_Editor";
const dr2_path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";

class Read {
    constructor(path, encoding) {
        this.path = path;
        if (encoding === undefined) {
            this.encoding = "utf8";
        } else {
            this.encoding = encoding;
        }
    }

    set_path(new_path) {
        this.path = new_path;
        return this;
    }

    set_encoding(new_encoding) {
        this.encoding = new_encoding;
        return this;
    }

    directory() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.path, this.encoding, (err, directories) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(directories);
                }
            })
        });
    }

    file() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, this.encoding, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }
}

class DR1Stat {
    constructor(directories) {
        this.directories = directories;

        this.parts = {
            menuText: [],
            prologue: [],
            chapitre1: [],
            chapitre2: [],
            chapitre3: [],
            chapitre4: [],
            chapitre5: [],
            chapitre6: [],
            epilogue: [],
            FTE: [],
            autre: []
        };

        this.stats = {};
    }

    set_directories(new_directories) {
        this.directories = new_directories;
        return this;
    }

    static get_dir(directory) {
        let res = 'autre';

        if (directory[2] === '_' && directory.endsWith('.pak')) {
            res = 'menuText';
        } else if (directory.startsWith("e00_") && directory.endsWith(".lin")) {
            res = 'prologue';
        } else if (directory.startsWith("e01_") && directory.endsWith(".lin")) {
            res = 'chapitre1';
        } else if (directory.startsWith("e02_") && directory.endsWith(".lin")) {
            res = 'chapitre2';
        } else if (directory.startsWith("e03_") && directory.endsWith(".lin")) {
            res = 'chapitre3';
        } else if (directory.startsWith("e04_") && directory.endsWith(".lin")) {
            res = 'chapitre4';
        } else if (directory.startsWith("e05_") && directory.endsWith(".lin")) {
            res = 'chapitre5';
        } else if (directory.startsWith("e06_") && directory.endsWith(".lin")) {
            res = 'chapitre6';
        } else if (directory.startsWith("e07_") && directory.endsWith(".lin")) {
            res = 'epilogue';
        } else if (directory.startsWith("e08_") && directory.endsWith(".lin")) {
            res = 'FTE';
        }
        return res;
    }
}

class DanganronpaTranslation {
    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.channel = message.channel;
        this.author = message.author;
        if (message.member) {
            this.member = message.member;
        }
        this.log_msg = undefined;

        this.error = [];
        this.dr1_path = dr1_path;
        this.dr2_path = dr2_path;
        this.path = '';
        this.read = new Read();
        this.dr1Stats = new DR1Stat();
    }

    get_dr1_stat() {
        return new Promise((resolve, reject) => {
            this.path = this.dr1_path;
            this.compute_directory_tree().then(() => {
                return this.compute_directory_stats();
            }).then(() => {
                resolve(null);
            }).catch(err => reject(err));
        })
    }

    compute_directory_tree() {
        return new Promise((resolve, reject) => {
            this.read.set_path(this.dr1_path).directory().then(directories => {

                this.dr1Stats.set_directories(directories).directories.forEach(directory => {
                    this.dr1Stats.parts[DR1Stat.get_dir(directory)].push(directory);
                });

                delete this.dr1Stats.parts.autre;
                resolve(true);
            }).catch(err => reject(err));
        });
    }

    compute_directory_stats() {
        return new Promise((resolve, reject) => {

            let tab = Object.keys(this.dr1Stats.parts);
            let i = 0;

            function lol(obj, part) {
                obj.handle_directories(part, obj.dr1Stats.parts[part]).then(() => {
                    i++;

                    if (i !== tab.length) {
                        return lol(obj, tab[i]);
                    } else {
                        resolve(true);
                    }

                }).catch(err => reject(err));
            }

            lol(this, tab[i]);

        });
    }

    handle_directories(part, dirArray) {
        return new Promise((resolve, reject) => {
            const dropbox_limit_request = 142; // not exactly that in docs, actually, no explicit number is mentionned

            /*let fill_promise_array = (sample_array) => new Promise((resolve, reject) => {
                let i = 0;
                let arr = [];
                sample_array.forEach(directory_from_sample => {
                    arr.push(this.handle_dir(part, directory_from_sample));
                    i += 1;
                    if (i === dropbox_limit_request) {
                        resolve(arr);
                    }
                });
                reject(null);
            });

            let run = (sample_array_two) => new Promise((resolve, reject) => {

                if (sample_array_two === undefined) {
                    resolve(true);
                }
                fill_promise_array(sample_array_two).then(promises => {
                    return Promise.all(promises);
                }).then(() => {
                    sample_array_two.splice(0, dropbox_limit_request);
                    return run(sample_array_two).then(() => resolve(true));
                }).catch(err => reject(err));

            });

            run(dirArray).then(() => resolve(true)).catch(err => reject(err));*/

            let i = 0;

            function doit(obj, dir) {
                obj.handle_dir(part, dir).then(() => {
                    i++;
                    if (i !== dirArray.length) {
                        return doit(obj, dir);
                    } else {
                        resolve(true);
                    }

                }).catch(err => reject(err));
            }

            doit(this, dirArray[i]);
        });
    }

    handle_dir(part, dir) {
        return new Promise((resolve, reject) => {

            if (part !== 'menuText') {
                dir = dir + '/' + dir.split('.')[0] + '.pak';
            }

            dir = this.path + '/' + dir;

            this.read.set_path(dir).directory().then(files => {
                return this.handle_files(files, part, dir);
            }).then(() => {
                resolve(true);
            }).catch(() => {
                this.error.push(dir);
            });

        });
    }

    handle_files(files, part, dir) {
        return new Promise((resolve, reject) => {

            /*let filePath = dir + '/';
            let promises = [];

            files.forEach(text_file => {
                console.log("OK");
                promise.push(this.handle_file(part, filePath + text_file));
            });

            Promise.all(promises).then(() => {
                this.log();
                resolve(true);
            }).catch(err => reject(err));*/

            let i = 0;
            let filePath = dir + '/';

            function run(obj, filePath, text_file) {
                obj.handle_file(part, filePath + text_file).then(() => {
                    i++;
                    if (i !== files.length) {
                        return run(obj, filePath, files[i]);
                    } else {
                        resolve(true);
                    }
                }).catch(err => reject(err));
            }

            run(this, filePath, files[i]);

        });
    }

    handle_file(part, file_dir) {
        return new Promise((resolve, reject) => {

            get_revisions_stats(file_dir.substring(5)).then(revisions => {
                revisions.forEach(revision => {
                    if (!(revision.modifier_name.name in this.dr1Stats.stats)) {
                        this.dr1Stats.stats[revision.modifier_name.name] = {};
                        this.dr1Stats.stats[revision.modifier_name.name][part] = 1;
                    } else {
                        if (!(part in this.dr1Stats.stats[revision.modifier_name.name])) {
                            this.dr1Stats.stats[revision.modifier_name.name][part] = 1;
                        } else {
                            this.dr1Stats.stats[revision.modifier_name.name][part] += 1
                        }
                    }
                });
                this.log();
                resolve(true);
            }).catch(err => {
                console.error(err);
            });

        });
    }

    async log() {
        let msg = '';
        Object.keys(this.dr1Stats.stats).forEach(user => {
            let nb = 0;

            msg += `**${user}**\n\n`;

            Object.keys(this.dr1Stats.stats[user]).forEach(part => {
                msg += `*${part} :* ${this.dr1Stats.stats[user][part]} fichiers modifiés.\n`;
                nb += this.dr1Stats.stats[user][part];
            });
            msg += `\n\n${user} a modifié ${nb} fichiers au total.\n\n`;
            msg += '\n-----------------------------\n';

        });
        console.log(msg + '\n-----------------------------\n-----------------------------\n');
        if (this.log_msg === undefined) {
            this.log_msg = await this.channel.send(msg);
        } else {
            this.log_msg.edit(msg);
        }
    }
}

module.exports = {DanganronpaTranslation};