import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());

app.use(bodyParser.json());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const { id, title } = data;
        const post = posts[id] || [];
        posts[id] = { id, title };
    }

    if(type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        post.comments = post.comments || [];
        post.comments.push({ id, content, status });
    }

    if(type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];

        const comment = post.comments.find(comment => {
            return comment.id === id;
        });

        if(status === 'rejected') {
            comment.content = "This is sensored content";
        }
        
        comment.status = status;
        console.log('Comment updated:', comment);
    }
};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    console.log(posts);
    res.send({ status: 'OK' });
});

app.listen(4002, async () => {
    console.log('Query service is running on port 4002');

    try {
        await axios({
            method:'get',
            url: "http://event-bus-srv:4005/events"
        }).then((res) => {
            res.data.forEach((event) => {
                handleEvent(event.type, event.data);
            });
        })
    } catch (error) {
        
    }
});