const Student = require('../../lib/models/student');
const { assert } = require('chai');

describe('student model unit test', () => {
    it('Validates the student', () => {
        const student = new Student({
            name: 'Kris',
            email: 'meow@meeeow.com',
            hash: '123'
        });
        return student.validate();
    });
    it('Fails Validation if required fields are missing', () => {
        const student = new Student();
        return student.validate()
            .then(() => {
                throw new Error('Expected validation Error');
            },
            ({ errors }) => {
                assert.ok(errors.name);
                assert.ok(errors.email);
                assert.ok(errors.hash);
            });
    });

    it('New student generates hash', () => {
        const student = new Student({
            email: 'blah@blah.com'
        });

        const password = 'abc';
        student.generateHash(password);

        assert.notEqual(student.hash, password);
        assert.isOk(student.comparePassword('abc'));
        assert.isNotOk(student.comparePassword('babylawyer'));
    });
});
