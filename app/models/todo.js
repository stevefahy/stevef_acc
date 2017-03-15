var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    text: {
        type: String,
        default: ''
    },
 	createdAt: {type: Date, default: Date.now},
  	updatedAt: {type: Date, default: Date.now}
});

todoSchema.pre('save', function(next){
	var currentTime = new Date().toISOString();
	if (currentTime != this.createdAt.toISOString()){
  		this.updatedAt = currentTime;
	}
  	next();
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;