"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function processSubmissions(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        const { problemId, code, language } = JSON.parse(submission);
        console.log(`Processing submission for problemId ${problemId}...`);
        console.log(`Code: ${code}`);
        console.log(`Language : ${language}`);
        // Here we would add  your actual processing logic
        // simulate processing delay
        yield new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Finished processing submission for problemId ${problemId}.`);
    });
}
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            console.log(`Worker conneceted to Redis`);
            // main Loop
            while (true) {
                // these workers are continously polling the Queue asking as to do they something to do and if there is they take and do it
                // so infinitely polling the Queue is while(1)
                try {
                    const submission = yield client.brPop("submissions", 0); // keep waiting for response there using blocking pop
                    // @ts-ignore
                    yield processSubmissions(submission.element);
                }
                catch (err) {
                    console.error("Error processing submission : ", err);
                }
            }
        }
        catch (error) {
            console.error("Failed to connect to Redis", error);
        }
    });
}
startWorker();
// async function main() {
//     await client.connect();
//     while(1){
//         // these workers are continously polling the Queue asking as to do they something to do and if there is they take and do it
//         // so infinitely polling the Queue is while(1)
//         const response = await client.rPop("submissions");
//         // actually run the users code in docker exec
//         // But we are not doing it (big task) we are tryuing to mimic a task a exppencise operation which will talke more than 1sec
//         await new Promise( (resole)=> setTimeout(resole,1000));
//         // This line tells awaits a new promise which will be resolved after 1 sec
//         //send it to pup sub
//         console.log() 
//     }
// }
