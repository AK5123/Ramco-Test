const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocSchema = new Schema({
    tags: {
        required: true,
        type: [String],
    },
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    }
});

const Doc = mongoose.model('Doc', DocSchema);

module.exports = Doc;