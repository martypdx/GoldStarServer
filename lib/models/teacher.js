const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    email: RequiredString,
    hash: RequiredString,
    bio: String,
    photo: String,
    classes: [
        {
            title: RequiredString,
            date: RequiredString,
            roster: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Student'
                }
            ],
            flashcardSets: [
                {
                    cardSet: {
                        type: Schema.Types.ObjectId,
                        ref: 'FlashcardSet'
                    },
                    date: String
                }
            ]
        }
    ]
});

schema.static('exists', function (query) {
    return this.find(query)
        .count()
        .then(count => (count > 0));
});

schema.method('generateHash', function (password) {
    this.hash = bcrypt.hashSync(password, 8);
});

schema.method('comparePassword', function (password) {
    return bcrypt.compareSync(password, this.hash);
});

module.exports = mongoose.model('Teacher', schema);
