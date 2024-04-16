import express from "express";
import { randomBytes } from "crypto";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

const handleEvent = (event) => {
    if(event.type === 'CommentModerated') {
        const { id, content, postId, status } = event.data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        try {
            axios.post("http://event-bus-srv:4005/events", {
                type: "CommentUpdated",
                data: {
                    id,
                    content,
                    postId,
                    status
                }
            });
        } catch (error) {
        }
    }
}

app.get("/posts/:id/comments", (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    res.status(200).send(comments);
});

app.post("/posts/:id/comments", (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id, content, status:'pending ' });
    commentsByPostId[req.params.id] = comments;
    console.log(comments);

    const event = {
        type: "CommentCreated",
        data: {
            id,
            content,
            status:'pending',
            postId: req.params.id
        }
    };

    try {
        axios.post("http://event-bus-srv:4005/events", event); // post to event bus
    } catch (error) {
        
    }

    res.status(201).send(comments);
});

app.post("/events", (req, res) => {
    const event = req.body;

    handleEvent(event);
    
    res.send({ status: 'OK' });
});

app.listen(4001, async () => {
    console.log(`Comment server is live on port 4001`);

    try {
        await axios({
            method:'get',
            url: "http://event-bus-srv:4005/events"
        }).then((res) => {
            res.data.forEach((event) => {
                handleEvent(event);
            });
        })
    } catch (error) {
        
    }

});