const db = require('./helpers/db');
const request = require('./helpers/request');
const { assert } = require('chai');

describe('courses', () => {
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

    let course = {
        title: 'Test Course',
        date: 'September 2017'
    };

    function saveCourse(course) {
        course.teacher = teacher.id;
        return request
            .post('/api/courses')
            .set('Authorization', token)
            .send(course)
            .then(res => res.body);
    }

    it('saves a course', () => {
        return saveCourse(course)
            .then(saved => {
                assert.ok(saved._id);
                course = saved;
            })
            .then(() => {
                return request
                    .get(`/api/courses/${course._id}`)
                    .set('Authorization', token);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, course);
            });
    });

    it('updates course info', () => {
        course.date = 'October 2090';
        return request.put(`/api/courses/${course._id}`)
            .set('Authorization', token)
            .send(course)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.date, course.date);
            });
    });

    it('deletes a course', () => {
        return request.delete(`/api/courses/${course._id}`)
            .set('Authorization', token)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });
});