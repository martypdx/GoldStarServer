require('dotenv').config();
const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('flashcard sets API', () => {
    before(db.drop);

    let token = null;
    before(() => db.getToken().then(t => token = t));

    let teacher = null;
    before(() => {
        return request.post('/api/authTeacher/signup')
            .set('Authorization', token)
            .send({
                name: 'Joe Teacher',
                email: 'Joe@aol.com',
                password: '123'
            })
            .then(res => res.body)
            .then(savedTeacher => {
                teacher = savedTeacher;
            });
    });

    let set = {
        name: 'test set'
    };

    function saveSet(set) {
        set.author = teacher.id;
        return request
            .post('/api/flashcardSet')
            .set('Authorization', token)
            .send(set)
            .then(res => res.body);
    }

    it('makes a set', () => {
        return saveSet(set)
            .then(saved => {
                assert.ok(saved._id);
                set = saved;
            })
            .then(() => {
                return request
                    .get(`/api/flashcardSet/${set._id}`)
                    .set('Authorization', token)
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, set);
            });
    });

    it('updates a set', () => {
        set.name = 'New Set';
        return request.put(`/api/flashcardSet/${set._id}`)
            .set('Authorization', token)
            .send(set)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.name, set.name);
            });
    });

    it('deletes a set', () => {
        return request.delete(`/api/flashcardSet/${set._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {assert.isTrue(result.removed);});
    });

});