const { assert } = require('chai');
const ensureAuth = require('../../lib/auth/ensure-auth')();
const tokenService = require('../../lib/auth/token-service');

describe('Ensure Auth Middleware', () => {
    it('Routes to error handler when no token found in Authorization header', done => {
        const req = {
            get() { return ''; }
        };

        const next = (error) => {
            assert.deepEqual(error, { code: 401, error: 'no authorization found' });
            done();
        };

        ensureAuth(req, null, next);
    });

    it('Routes to error handler with bad token', done => {
        const req = {
            get() { return 'Bad-Token'; }
        };

        const next = (error) => {
            assert.deepEqual(error, { code: 401, error: 'authorization failed' });
            done();
        };

        ensureAuth(req, null, next);
    });

    it('Calls next on valid Authorization and sets user prop on req', done => {
        const payload = {
            _id: '123'
        };

        tokenService.sign(payload)
            .then(token => {
                const req = {
                    get(header) { return header === 'Authorization' ? token : null; }
                };

                const next = (error) => {
                    assert.isNotOk(error);
                    assert.equal(req.user.id, payload._id);
                    done();
                };

                ensureAuth(req, null, next);
            })

            .catch(done);
    });
});
