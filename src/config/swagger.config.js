const path = require('path');
const { PORT } = require('../utils/env-var');

module.exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'auth server with jwt - API Documentation',
            version: '1.0.0',
            description: 'This is the API documentation for authentication with jwt.',
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Endpoints related to user authentication and registration',
            },
            {
                name: 'Users',
                description: 'Endpoints for managing users',
            },
        ],
        servers: [
            {
                url: `http://localhost:${PORT}`, // Update this to your server's URL
                description: 'Development server',
            },
        ],
    },
    apis: [path.join(__dirname, '../routes/*.js')], // Update the path if your routes are in a different folder
};
