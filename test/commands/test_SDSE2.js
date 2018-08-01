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

describe("format content function tests", () => {

    it('basic, under 64', function () {

        let msg = "This is a test";
        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(formatedMsg, msg);

    });

    it('basic, above 64', function () {

        let msg = "La situation qui était sur le point de se dérouler contenait deux émotions conflictuelles de la même ampleur.";

        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(
            formatedMsg,
            "La situation qui était sur le point de se dérouler contenait\n" +
            "deux émotions conflictuelles de la même ampleur."
        );

    });

    it('basic, above 64, three lines', function () {

        let msg = "La situation qui était sur le point de se dérouler contenait deux émotions conflictuelles de la même ampleur. La situation qui était sur le point de se dérouler contenait deux émotions conflictuelles de la même ampleur.";

        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(
            formatedMsg,
            "La situation qui était sur le point de se dérouler contenait\n" +
            "deux émotions conflictuelles de la même ampleur. La situation\n" +
            "qui était sur le point de se dérouler contenait deux émotions\n" +
            "conflictuelles de la même ampleur."
        );

    });

    it('with CLT, above 64', function () {

        let msg = "<CLT 04>La situation qui était sur<CLT> le point de se dérouler contenait deux émotions conflictuelles de la même ampleur.";

        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(
            formatedMsg,
            "<CLT 04>La situation qui était sur<CLT> le point de se dérouler contenait\n" +
            "deux émotions conflictuelles de la même ampleur."
        );

    });

    it('with wrong CLT, above 64', function () {

        let msg = "<CLT La situation qui était sur le point de se dérouler contenait deux émotions conflictuelles de la même ampleur.";

        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(
            formatedMsg,
            "<CLT La situation qui était sur le point de se dérouler\n" +
            "contenait deux émotions conflictuelles de la même ampleur."
        );

    });

    it('ponctuation, above 64', function () {

        let msg = "Tu vois ? Dans le mille ! Je le savais parce que je suis pareil !";

        let formatedMsg = SDSE2.formatContent(msg);

        assert.equal(
            formatedMsg,
            "Tu vois ? Dans le mille ! Je le savais parce que je suis\n" +
            "pareil !"
        );

    });

});

describe('duplicate system', () => {

    it('should open csv file correctly', function () {
        SDSE2.constructDupesDB().then((dupeDB) => {
            assert.equal(Object.keys(dupeDB.pathToNumber).length, 29486);
            assert.equal(Object.keys(dupeDB.numberToPath).length, 8747);
        }).catch(err => done(err));
    });

    it('getDupesOf function test', async function () {

        let line = new SDSE2.DR2Line(`../../Danganronpa 2 traduction FR/SDSE2_Shared_Data/data01\\jp\\script\\e00_001_180.lin\\0012.txt`);
        if (!(await line.checkFile())) {
            return;
        }
        let data = await line.openFile();
        line.data = data[0];
        line.encoding = data[1];
        line.retrieveContent();
        let dupes = await SDSE2.getDupesOf(line, await SDSE2.constructDupesDB());
        assert.equal(dupes.length, 4);
    });

});
