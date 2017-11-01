var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProblemSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  title                : { type: String, unique: false, required: false },
  category             : { type: String, unique: false, required: false },
  difficulty           : { type: String, unique: false, required: false }
});

module.exports = mongoose.model('Problem', ProblemSchema);
