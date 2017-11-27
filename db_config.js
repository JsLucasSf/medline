const db_string = process.env.MONGODB_URI || 'mongodb://127.0.0.1/medline';

var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect(db_string, { useMongoClient: true });

var db = mongoose.connection;

var Doctor;

db.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

// db.once('open', function() {
//
//
// });

var doctorSchema = mongoose.Schema({

	username: String,
	email: String,
	password: String,
	created_at: Date
});

var clinicSchema = mongoose.Schema({
	username : String,
	phone : String,
	address : String,
	password : String
});

clinicSchema.plugin(passportLocalMongoose);
doctorSchema.plugin(passportLocalMongoose);

exports.Clinic = mongoose.model("Clinic", clinicSchema);
exports.Doctor = mongoose.model('Doctor', doctorSchema);
