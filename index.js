// implement your API here
const express = require('express');
const db = require('./data/db')
const server = express();

server.use(express.json())

// GET all posts
server.get('/api/posts', async (req, res) => {
    try {
        let posts = await db.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({error: 'The posts information could not be retrieved'})
    }
})

// GET posts by id
server.get('/api/posts/:id', (req, res) => {
    db.findById(req.params.id)
        .then(post => {
            if (post.length === 0) {
                res.status(404).json({error: 'The post with the specified ID does not exist'})
            } else {
                res.status(200).json(post)
            }
        })
        .catch(err => {
            res.status(500).json({error: 'The post information could not be retrieved'})
        })
})

// GET comments by post id
server.get('/api/posts/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
        .then(comments => {
            console.log(comments.length)
            if (comments.length) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({error: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(err => res.status(500).json({error: 'The comments information could not be retrieved.'}))
})

// POST a post
server.post('/api/posts', (req, res) => {
    const post = {
        title: req.body.title,
        contents: req.body.contents
    }
 
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
    }

    db.insert(post)
        .then(obj => {
            db.findById(obj.id)
                .then(post => res.status(201).json(post))
                .catch(err => res.status(500).json({error: 'There was an error while saving the post to the database.'}))
        })
        .catch(err => res.status(500).json({error: 'There was an error while saving the post to the database'}))
})

// POST a comment by post id

server.post('/api/posts/:id/comments', (req, res) => {
    let comment = {
        text: req.body.text,
        post_id: req.params.id
    }
    if (!req.body.text) {
        return res.status(400).json({errorMessage: 'Please provide text for the comment.'})
    }
    
    db.insertComment(comment)
        .then(obj => {
            db.findCommentById(obj.id)
                .then(addedComment => res.status(200).json(addedComment))
                .catch(err => res.status(500).json({error: 'There was an error while saving the comment to the database'}))
        })
        .catch(err => res.status(404).json({message: 'The post with the specified ID does not exist.'}))

})


// DELETE a post by id

server.delete('/api/posts/:id', (req, res) => {
    db.remove(req.params.id)
        .then(deleted => {
            if (deleted) {
                return res.status(200).json({message: 'Post was deleted!'})
            } else {
                return res.status(404).json({error: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(err => res.status(500).json({error: 'The post could not be removed.'}))
})

// PUT (update) an existing post

server.put('/api/posts/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({errorMessage: 'Please provide title and contents for the post.'})
    }

    let post = {
        title: req.body.title,
        contents: req.body.contents
    }

    db.update(req.params.id, post)
        .then(response => {
            if (response) {
                db.findById(req.params.id)
                    .then(post => res.status(200).json(post))
                    .catch(err => res.status(500).json({error: 'The post information could not be modified.'}))
            } else {
                res.status(404).json({message: 'The post with the specified ID does not exist.'})
            }
        })
        .catch(err => res.status(500).json({error: 'There was an error updating the post.'}))
})

const port = 8000;
const host = '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})