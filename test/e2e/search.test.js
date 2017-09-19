require('dotenv').config();
const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('search route', () => {
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    const query = 'cactus';

    it('conducts a search', () => {
        return request.get(`/api/search/query=${query}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(data => {
                assert.ok(data[0].title);
            })
    });

    const badQuery = ';aksjhdgkashdg';

    it('returns empty with bad query', () => {
        return request.get(`/api/search/query=${badQuery}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(data => {
                assert.equal(data.results, 0);
            })
    });
});