const express = require('express');
const db = require('../data/db')
const router = express.Router()
const commentRouter = require('./commentRouter')

router.use('/:id/comments', commentRouter)

// GET all posts
router.get('/', async (req, res) => {
    try {
        let posts = await db.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({error: 'The posts information could not be retrieved'})
    }
})

// GET posts by id
router.get('/:id', (req, res) => {
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

// POST a post
router.post('/', (req, res) => {
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

// DELETE a post by id

router.delete('/:id', (req, res) => {
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

router.put('/:id', (req, res) => {
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

module.exports = router;