import * as yargs from "yargs"
import { readFileForParsing } from "./parser/parser";
import * as readline from "readline"
import { handleQuery } from "./query";
import { InvalidFormat } from "./errors";

const argv = yargs
    .option("file", {
        alias: "f",
        description: "File to load containing the match details.",
        type: "string",
    })
    .demandOption(["file"], "File is required")
    .help()
    .alias("help", "h")
    .argv;

try{
    const parsedMatches = readFileForParsing(argv.file);
    const rl = readline.createInterface({
        input: process.stdin
    });

    console.log("Write end, stop, finish, quit or exit to finish queries\n");
    rl.on("line", (line) => {
        if (line.match(/^end|stop|finish|quit|exit/i)) {
            rl.close();
        } else {
            console.log(handleQuery(line, parsedMatches.stats));
            console.log("\n");
        }
    });
}catch(err){
    if(err instanceof InvalidFormat){
        console.error(`Something went wrong with the format: ${err.message}`);
    }else{
        console.error(err);
    }
}