const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    xml: {
        type: String,
        default: ''
    },
    uploadAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to update xml field before saving
fileSchema.pre('save', function (next) {
    if (this.filename) {
        // Replace the file extension with .xml
        this.xml = this.filename.replace(/\.[^/.]+$/, ".xml");
    }
    next();
});

module.exports = mongoose.model('File', fileSchema)