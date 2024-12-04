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
    dynamicKey: {
        type: String,
        default: '{}'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/**
 * duration = 11
 * paye = 10
 * permission= 1
 * 
 * parti = 6
 * 
 * paye - parti = 5
 * permission = 1
 * 
 * parti = 5
 * 5
 * 
 */

module.exports = mongoose.model('customer', customerSchema)