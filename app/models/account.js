var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
  account_obj: [{
    name: String,
    balance: Number,
    rules: [{percent: Number, rule: String, amount: Number}],
    startdate: Date,
    enddate: Date
  }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

accountSchema.pre('save', function(next){
  var currentTime = new Date().toISOString();
  if (currentTime != this.createdAt.toISOString()){
      this.updatedAt = currentTime;
  }
    next();
});

var Account = mongoose.model('Account', accountSchema);

module.exports = Account;