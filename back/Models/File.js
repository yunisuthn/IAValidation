const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema({
    V1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    V2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
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
    if (this.name) {
        // Replace the file extension with .xml
        this.xml = this.name.replace(/\.[^/.]+$/, ".xml");
    }
    next();
});

module.exports = mongoose.model('File', fileSchema)