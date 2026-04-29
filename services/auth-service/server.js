const mongoose = require('mongoose');
const http = require('http');
const app = require('./src/handler');
const environment = require('./src/config/env');

const server = http.createServer(app);

mongoose
    .connect(environment.mongoUri)
    .then(() => {
        server.listen(environment.port || 4001, () => {
            console.log(`Auth service started on port ${environment.port || 4001}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB for auth service:', error.message);
    });
