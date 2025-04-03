let mongoose = require('mongoose');
let menuSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'menu',
        default: null
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('menu', menuSchema); 