var mongoose = require("mongoose");

var ClinicSchema = mongoose.Schema({
  username : String,
  email : String,
  cnpj : String,
  address : String,
  password : String
});

module.exports = mongoose.model("Clinic", ClinicSchema);
