// implement your API here
const express = require('express');
const db = require('./data/db')
const server = express();

server.use(express.json())

server.get('/api/posts', async (req, res) => {
    let posts = await db.find();
    if (posts) {
        res.json(posts);
    } else {
        res.status(500).json({error: 'The posts information could not be retrieved'})
    }
})

server.get('/api/posts/:id', async (req, res) => {
    let post = await db.findById(req.params.id)
    if (post.length === 0) {
        res.status(404).json({message: 'The post with the specified ID does not exist.'})
    } else if (post) {
        res.status(200).json(post)
    } else {
        res.status(500).json({message: 'The post information could not be retrieved.'})
    }
})

server.get('/api/posts/:id/comments', async (req, res) => {
    let comment = await db.findPostComments(req.params.id)
    if (comment.length === 0) {
        res.status(404).json({message: 'The post with the specified ID does not exist.'})
    } else if (comment) {
        res.status(200).json(comment)
    } else {
        res.status(500).json({error: 'The comments information could not be retrieved.'})
    }
})

server.post('/api/posts', async (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
    }

    let post = {
        title: req.body.title,
        contents: req.body.contents
    }

    let newPost = await db.insert(post)

    if (newPost) {
        res.status(201).json(post)
    } else {
        res.status(500).json({error: 'There was an error while saving the post to the database.'})
    }

})






const port = 8000;
const host = '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})