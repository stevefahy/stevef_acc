var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stockSchema = new Schema({
    /*
    cgt_obj: [{
        rate: Number,
        startdate: Date,
        enddate: Date
    }],
    */
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
    
});

stockSchema.pre('save', function(next) {
    var currentTime = new Date().toISOString();
    if (currentTime != this.createdAt.toISOString()) {
        this.updatedAt = currentTime;
    }
    next();
});

var Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;