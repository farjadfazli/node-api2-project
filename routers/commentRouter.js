const express = require('express');
const db = require('../data/db')
const router = express.Router({
    mergeParams: true
})

// GET comments by post id
router.get('/', (req, res) => {
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

// POST a comment by post id

router.post('/', (req, res) => {
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

module.exports = router;