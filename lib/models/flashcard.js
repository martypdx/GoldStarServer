const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    term: RequiredString,
    definition: RequiredString,
    order: Number,
    saved: Boolean
});

module.exports = mongoose.model('Flashcard', schema);