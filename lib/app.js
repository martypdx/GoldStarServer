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

const authTeacher = require('./routes/authTeacher');
const authStudent = require('./routes/authStudent');
const student = require('./routes/Student');
const teacher = require('./routes/Teacher');
const course = require('./routes/Course');
const search = require('./routes/search');
const flashcardSet = require('./routes/flashcardSet');
const returnedFlashcardSet = require('./routes/returnedFlashcardSet');

if (process.env.NODE_ENV !== 'production') {
    app.use(checkDb);
}

app.use('/api/authTeacher', authTeacher);
app.use('/api/authStudent', authStudent);
app.use('/api/Student', ensureAuth, student);
app.use('/api/Teacher', ensureAuth, teacher);
app.use('/api/courses', ensureAuth, course);
app.use('/api/search', ensureAuth, search);
app.use('/api/flashcardSet', ensureAuth, flashcardSet);
app.use('/api/search/set', ensureAuth, returnedFlashcardSet);


app.use((req, res) => {
    res.sendFile('index.html', {
        root: './public/'
    });
});

app.use(errorHandler());

module.exports = app;