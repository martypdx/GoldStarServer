const Teacher = require('../../lib/models/teacher');
const { assert } = require('chai');

describe('Teacher model unit test', () => {
    it('Validates the teacher', () => {
        const teacher = new Teacher({
            name: 'Caitlin',
            email: 'theworst@lame.com',
            hash: '123'
        });
        return teacher.validate();
    });
    it('Fails Validation if required fields are missing', () => {
        const teacher = new Teacher();
        return teacher.validate()
            .then(() => {
                throw new Error('Expected validation Error');
            },
            ({ errors }) => {
                assert.ok(errors.name);
                assert.ok(errors.email);
                assert.ok(errors.hash);
            });
    });
});
