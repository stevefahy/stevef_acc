var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var historySchema = new Schema({
    history_obj: [{
        date: Date,
        balance: Number,
        taxed: Number,
        total: Number,
        stocksgain: []
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

historySchema.pre('save', function(next) {
    var currentTime = new Date().toISOString();
    if (currentTime != this.createdAt.toISOString()) {
        this.updatedAt = currentTime;
    }
    next();
});

var History = mongoose.model('History', historySchema);

module.exports = History;
