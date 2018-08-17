const assert = require("chai").assert;
const Discord = require("discord.js");
const client = new Discord.Client();
const bot_data = require("../../bot_data.js");

let testChannel;
let testMsg;
const KazuhiroId = "140033402681163776";

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
