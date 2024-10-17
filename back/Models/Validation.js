const mongoose = require("mongoose")

const validationSchema = new mongoose.Schema({
    document: {
        type: mongoose.Types.ObjectId,
        ref: 'File',
        required: true
    },
    num: {
        type: String,
        enum: ['1', '2']
    },
    returned: {
        type: Boolean,
        default: false
    },
    json_data: {
        type: String,
        default: '{}'
    }
});

module.exports = mongoose.model('Validation', validationSchema)