// implement your API here
const express = require('express');
const db = require('./data/db')
const postRouter = require('./routers/postRouter')
const server = express();

server.use(express.json())
server.use('/api/posts', postRouter)



const port = 8000;
const host = '127.0.0.1';

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`)
})