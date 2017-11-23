var db_string = 'mongodb://127.0.0.1/medline';

var mongoose = require('mongoose');

mongoose.connect(db_string, { useMongoClient: true });

var db = mongoose.connection;

var Doctor;

db.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

db.once('open', function() {
	
	var doctorSchema = mongoose.Schema({
		
		fullname: String,
		email: String,
		password: String,
		created_at: Date
	});

	exports.Doctor = mongoose.model('Doctor', doctorSchema);
});