var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taxSchema = new Schema({
    tax_obj: [{
        tax_type: String,
        rate: Number,
        startdate: Date,
        enddate: Date
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'taxs' });

taxSchema.pre('save', function(next) {
    var currentTime = new Date().toISOString();
    if (currentTime != this.createdAt.toISOString()) {
        this.updatedAt = currentTime;
    }
    next();
});

var Tax = mongoose.model('Tax', taxSchema);

module.exports = Tax;
