import { createClient } from "redis";

const client = createClient();

async function processSubmissions(submission:string) {
    const {problemId,code,language} = JSON.parse(submission);

    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language : ${language}`);
    // Here we would add  your actual processing logic

    // simulate processing delay
    await new Promise(resolve => setTimeout(resolve,1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);

}

// Even if all the workers are down the submission gets pilled up in the Queue
// and once I make the worker backup in working they start taking it from the queue and process it 

async function startWorker() {
    try{
        await client.connect();
        console.log(`Worker conneceted to Redis`);

        // main Loop
        while(true){
            // these workers are continously polling the Queue asking as to do they something to do and if there is they take and do it
            // so infinitely polling the Queue is while(1)
    
            try{
                const submission = await client.brPop("submissions",0); // keep waiting for response there using blocking pop
                // @ts-ignore
                await processSubmissions(submission.element);
            }
            catch(err){
                console.error("Error processing submission : ",err);
            }
        }
    }
    catch(error){
        console.error("Failed to connect to Redis",error);
    }
}

startWorker();


