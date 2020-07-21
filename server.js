const express = require('express');

const projectRouter = require('./routers/projectRouter');
const actionRouter = require('./routers/actionRouter');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/actions', actionRouter);
server.use('/api/projects', projectRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Let's write some middleware!</h2>`);
});
  
//logger function
function logger(req, res, next) {
    console.log(`Method: ${req.method} Url: ${req.originalUrl} Time: ${Date.now()}`);
    next();
}
  
module.exports = server;