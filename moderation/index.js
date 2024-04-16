import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';  
import axios from 'axios';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const handleEvent = async(type, data) => {
    if(type == 'CommentCreated') {
        const { id, content, postId } = data;
        let { status } = data;

        if(content.includes('bad')) {
            status = 'rejected';
        } else {
            status = 'approved';
        }

        try {
            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
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

app.post('/events', async (req, res) => {
    const event = req.body;

    handleEvent(event.type, event.data);

    console.log('Event received:', event);
    res.send({ status: 'OK' }); 
})

app.listen(4003, async () => {
    console.log('Moderation service is running on port 4003');

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