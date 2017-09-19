const connection = require('mongoose').connection;
const request = require('./request');
process.env.MONGODB_URI = 'mongodb://localhost/goldstar-test';
require('../../../lib/setup-mongoose');


module.exports = {
    drop() {
        return connection.dropDatabase();
    },
    getToken(user = { name: 'me', email: 'me@me.com', password: 'abc' }, status = 'Teacher') {
        return request.post(`/api/auth${status}/signup`)
            .send(user)
            .then(res => res.body.token);
    }
};