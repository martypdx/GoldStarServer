const Router = require('express').Router;
const router = Router();
const User = require('../models/student');
const ensureAuth = require('../auth/ensure-auth')();
const tokenService = require('../auth/token-service');
const bodyParser = require('body-parser').json();

// Don't repeat files like this.
function hasEmailAndPassword(req, res, next) {
    const user = req.body;
    if (!user || !user.email || !user.password) {
        return next({
            code: 400,
            error: 'name, email, and password must be supplied'
        });
    }
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });
    })

    .post('/signup', bodyParser, hasEmailAndPassword, (req, res, next) => {
        const { name, email, password } = req.body;
        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if (exists) { throw { code: 400, error: 'email in use' }; }
                const user = new User({ name, email });
                user.generateHash(password);
                return user.save();
            })
            .then(user => Promise.all([user._id, tokenService.sign(user)]))
            .then(([id, token]) => res.send({ id, token, status: 'Student' }))
            .catch(next);
    })
    
    .post('/signin', bodyParser, hasEmailAndPassword, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.findOne({ email })
            .then(user => {
                if (!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'invalid login' };
                }
                return user;
            })
            .then(user => Promise.all([user._id, tokenService.sign(user)]))
            .then(([id, token]) => res.send({ id, token, status: 'Student' }))
            .catch(next);
    });

module.exports = router;
