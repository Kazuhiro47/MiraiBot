const assert = require("chai").assert;
const SDSE2 = require("../../functions/sdse_utils.js");
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");
const fs = require("graceful-fs");

let testChannel;
let testMsg;
const KazuhiroId = "140033402681163776";

let readDir = (path) => new Promise((resolve, reject) => {
    fs.readdir(path, 'utf8', (err, data) => {
        if (err) {
            reject(err);
        }
        resolve(data);
    });
});

describe("open file tests", () => {

    it('should read all files correctly', async () => {
        let path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script";
        let dirs = await readDir(path);

        for (let i = 0; i < dirs.length; i++) {
            let files = await readDir(`${path}/${dirs[i]}`);

            for (let j = 0; j < files.length; j++) {
                if (!files[j].endsWith(".wrd") && !fs.lstatSync(`${path}/${dirs[i]}/${files[j]}`).isDirectory()) {
                    let data = await new SDSE2.DR2Line(`${path}/${dirs[i]}/${files[j]}`).checkFile();

                    assert.equal(data, true);
                }
            }
        }
    }).timeout(120000);

});

describe("DR2Line", () => {

    it('should retrieve a translated file', async () => {
        const path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script/00_System.pak/0000.txt";
        let dr2F = new SDSE2.DR2Line(path);
        let check = await dr2F.checkFile();

        assert.equal(check, true);
        check = dr2F.retrieveContent();
        assert.equal(check, true);
        assert.notEqual(dr2F.text.french, "");
    });

    it('should retrieve an untranslated file', async () => {
        const path = "../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01/jp/script/e04_238_000.lin/0010.txt";
        let dr2F = new SDSE2.DR2Line(path);
        let check = await dr2F.checkFile();

        assert.equal(check, true);
        check = dr2F.retrieveContent();
        assert.equal(check, true);
        assert.equal(dr2F.text.french, "");
    });

});

describe("DR2File", () => {

    it('test directory file analysis', async () => {

        let newDir = new SDSE2.DR2File("e00_001_180.lin");

        assert.equal(newDir.checkDir(), true);
        let check = await newDir.computeScenesInfo();
        assert.equal(check, true);

    }).timeout(100000);

});