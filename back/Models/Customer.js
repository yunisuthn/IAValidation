const mongoose = require("mongoose")
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    dynamicKeys: [{
        key: { type: String, required: true, unique: true },
        value: { type: Array, default: [] },
        order: { type: Number, default: 0 } // Added for ordering
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

module.exports = mongoose.model('customer', customerSchema)