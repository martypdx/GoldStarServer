const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    title: RequiredString,
    teacher: RequiredString,
    // WILL WE NEED THE TEACHER ID LATER?
    // teacher: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Teacher',
    //     required: true
    // },
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
});

module.exports = mongoose.model('Course', schema);