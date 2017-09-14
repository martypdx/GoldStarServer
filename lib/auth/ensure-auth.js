// eslint no-console: off
const tokenService = require('./token-service');

module.exports = function getEnsureAuth(log = console.log) { //eslint-disable-line
    return function ensureAuth(req, res, next) {
        const token = req.get('Authorization') || req.get('authorization');
        if (!token) return next({ code: 401, error: 'no authorization found' });

        tokenService.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            }, () => {
                next({ code: 401, error: 'authorization failed' });
            })
            .catch(err => {
                log('unexpected next() failure', err);
            });
    };
};