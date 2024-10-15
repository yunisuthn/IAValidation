const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    uploadAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('File', fileSchema)
 