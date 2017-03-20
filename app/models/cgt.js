var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cgtSchema = new Schema({
  cgt_obj: [{
    rate: Number,
    startdate: Date,
    enddate: Date
  }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

cgtSchema.pre('save', function(next){
  var currentTime = new Date().toISOString();
  if (currentTime != this.createdAt.toISOString()){
      this.updatedAt = currentTime;
  }
    next();
});

var Cgt = mongoose.model('Cgt', cgtSchema);

module.exports = Cgt;