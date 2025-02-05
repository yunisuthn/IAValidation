
const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: ''
    },
    data: {
        type: String, // json data as string
        default: '[]'
    }
}, {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('ocr-template', TemplateSchema);
