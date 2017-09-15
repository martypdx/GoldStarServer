const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('auth', () => {
    before(db.drop);

    const user = {
        email: 'bread@lover.com',
        name: 'Bread',
        password: 'luvmesomebread'
    };

    describe('user management', () => {
        const badRequest = (url, data, code, error) => 
            request
                .post(url)
                .send(data)
                .then(() => {
                    throw new Error('status should not be ok');
                },
                res => {
                    assert.equal(res.status, code);
                    assert.equal(res.response.body.error, error);
                }
                );
        it('signup requires email', () => 
            badRequest('/api/authTeacher/signup', { password: 'abc' }, 400, 'name, email, and password must be supplied')
        );
        it('signup requires password', () => 
            badRequest('/api/authTeacher/signup', { email: 'abc@123.com' }, 400, 'name, email, and password must be supplied')
        );

        let token = '';

        it('signup', () => 
            request
                .post('/api/authTeacher/signup')
                .send(user)
                .then(res => assert.ok(token = res.body.token))
        );

        it('cannot use save email', () =>
            badRequest('/api/authTeacher/signup', user, 400, 'email in use')
        );

        it('signin requires email', () => 
            badRequest('/api/authTeacher/signin', { password: 'abc' }, 400, 'name, email, and password must be supplied')
        );

        it('signin requires password', () => 
            badRequest('/api/authTeacher/signin', { email: 'abc@123.net' }, 400, 'name, email, and password must be supplied')
        );

        it('signin with wrong user', () =>
            badRequest('/api/authTeacher/signin', { email: 'baddd User', password: user.password }, 401, 'invalid login')
        );

        it('signin with wrong password', () => 
            badRequest('/api/authTeacher/signin', { email: user.email, password: 'bad' }, 401, 'invalid login')
        );

        it('signin', () => 
            request
                .post('/api/authTeacher/signin')
                .send(user)
                .then(res => assert.ok(res.body.token))
        );

        it('token is invalid', () =>
            request
                .get('/api/authTeacher/verify')
                .send('Authorization', 'bad token')
                .then(
                    () => { throw new Error('success response not expected'); },
                    (res) => { assert.equal(res.status, 401); }
                )
        );

        it('token is valid', () => 
            request
                .get('/api/authTeacher/verify')
                .set('Authorization', token)
                .then(res => assert.ok(res.body))
        );

    });

});