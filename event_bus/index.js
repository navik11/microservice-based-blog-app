import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.json());

let events = [];

app.post('/events', async (req, res) => {
    const event = req.body;

    events.push(event);

    try {
    await axios.post('http://posts-clusterip-srv:4000/events', event); // post to post service
    } catch (error) {
        console.log(error)
    }
    try {
        await axios.post('http://comments-clusterip-srv:4001/events', event); // post to comment service
    } catch (error) {
        console.log(error)
    }
    try {
    await axios.post('http://query-clusterip-srv:4002/events', event); // post to query service
    } catch (error) {
        console.log(error)
    }
    try {
    await axios.post('http://moderation-clusterip-srv:4003/events', event); // post to moderation service
    } catch (error) {
        console.log(error)
    }

    console.log('Event received:', event);
    res.send({ status: 'OK' }); 
}) 

app.get('/events', (req, res) => {
    res.status(201).send(events);
});
 
app.listen(4005, () => {
    console.log('Event bus is running o n port 4005');
});