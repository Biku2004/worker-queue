import express from 'express';
import { createClient } from 'redis';

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => {
    console.log("Redis Cliennt Error",err);
});

app.post("/submit",async(req,res)=>{
    // const problemId = req.body.problemId;
    // const code = req.body.code;
    // const language = req.body.language;
    
    const {problemId,userId,code,language} = req.body;
    // ideally store thi s in a database prisma.submission.create()

    try {
        await client.lPush("submissions",JSON.stringify({
            problemId,userId,code,language
        }));
        
        res.status(200).send("Submission received and stored");
    }
    catch (error) {
        console.log("Redis Error",error);
        res.status(500).send("Failed to store submission");
    }
});


async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, ()=>{
            console.log("Sercer is running on port 3000");
        });
    }
    catch (error) {
        console.log("Failed to connect to redis",error)
    }
}

startServer();