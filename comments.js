// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Create web server
const app = express();
app.use(bodyParser.json());

// Create object to store comments
const commentsByPostId = {};

// Create function to handle event
const handleEvent = (type, data) => {
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        // Store comment
        const comments = commentsByPostId[postId] || [];
        comments.push({ id, content, status });
        commentsByPostId[postId] = comments;
    }
    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        // Find comment and update
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}

// Create route to handle event
app.post('/events', (req, res) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
})

// Create route to get comments
app.get('/posts/:id/comments', (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    res.send(comments);
})

// Listen to port
app.listen(4001, async () => {
    console.log('Listening on 4001');
    // Get events from event-bus
    const res = await axios.get('http://localhost:4005/events');
    // Handle each event
    for (let event of res.data) {
        console.log('Processing event:', event.type);
        handleEvent(event.type, event.data);
    }
})