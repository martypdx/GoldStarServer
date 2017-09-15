const connection = require('mongoose').connection;
const request = require('./request');
process.env.MONGODB_URI = 'mongodb://localhost/goldstar-test';
require('../../../lib/setup-mongoose');


module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { email: 'me@me.com', password: 'abc' }) {
        return request.post('/api/auth/signup')
            .send(user)
            .then(res => res.body.token);
    }
};