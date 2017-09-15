const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/goldstar';

mongoose.Promise = Promise;
mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    console.log('mongoose default connection open to ' + dbURI); //eslint-disable-line
});

mongoose.connection.on('error', function(err) {
    console.log('mongoose default connection error: ' + err); //eslint-disable-line
});

mongoose.connection.on('disconnected', function() {
    console.log('mongoose default connection disconnected.'); //eslint-disable-line
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        console.log('mongoose default connection disconnected through app termination'); //eslint-disable-line
        process.exit(0);
    });
});

module.exports = mongoose.connection;