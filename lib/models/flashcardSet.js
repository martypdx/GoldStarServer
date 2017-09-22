const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: RequiredString,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    cards: [{
        term: RequiredString,
        definition: RequiredString,
        quizletId: Number
    }]
});

module.exports = mongoose.model('FlashcardSet', schema);

