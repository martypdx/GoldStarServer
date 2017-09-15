const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');
const redirectHttp = require('./redirect-http')();
const checkDb = require('./check-connection')();
const ensureAuth = require('./auth/ensure-auth')();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('./public'));

if (process.env.NODE_ENV === 'production') {
    app.use(redirectHttp);
}

// ADD ROUTES HERE
const authTeacher = require('./routes/authTeacher');
const authStudent = require('./routes/authStudent');

if (process.env.NODE_ENV !== 'production') {
    app.use(checkDb);
}

app.use('/api/auth', authTeacher, authStudent);

app.use((req, res) => {
    res.sendFile('index.html', {
        root: './public/'
    });
});

app.use(errorHandler());

module.exports = app;