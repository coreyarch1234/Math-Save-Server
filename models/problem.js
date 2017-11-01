var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProblemSchema = new Schema({
  createdAt            : { type: Date, default: Date() },
  updatedAt            : { type: Date, default: Date() },
  title                : { type: String, unique: false, required: true },
  category             : { type: String, unique: false, required: true },
  difficulty           : { type: String, unique: false, required: true },
  latex                : { type: String, unique: false, required: true }
});

module.exports = mongoose.model('Problem', ProblemSchema);
