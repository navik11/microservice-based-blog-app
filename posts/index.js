import express from "express";
import { randomBytes } from "crypto"
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts/get", (req, res) => {
    res.status(200).send(posts);
});

app.post("/posts/create", async (req, res) => {
    const id = randomBytes(4).toString('hex'); 
    const { title } = req.body;

    posts[id] = {
        id, title
    }
    console.log(posts);
    const event = {
        type: "PostCreated",
        data: posts[id]
    }

    await axios.post("http://event-bus-srv:4005/events", event);

    res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
    console.log('Event received:', req.body);
    res.send({ status: 'OK' });
});

app.listen(4000, async ()=>{
    console.log(`Server is listening on port 4000`);
    console.log('version 0.0.6');
});