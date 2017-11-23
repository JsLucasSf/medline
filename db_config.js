var db_string = 'mongodb://127.0.0.1/medline';

//var bcrypt = require('bcrypt');

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

    var clinicSchema = mongoose.Schema({
        name : String,
        email : String,
        cnpj : String,
        address : String,
        password : String
      });
      
    //authenticate input against database
/*   doctorSchema.statics.authenticate = function (email, password, callback) {
    doctor.findOne({ email: email })
        .exec(function (err, doctor) {
        if (err) {
            return callback(err)
        } else if (!doctor) {
            var err = new Error('doctor not found.');
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, doctor.password, function (err, result) {
            if (result === true) {
            return callback(null, doctor);
            } else {
            return callback();
            }
        })
        });
    }

    //hashing a password before saving it to the database
    doctorSchema.pre('save', function (next) {
    var doctor = this;
    bcrypt.hash(doctor.password, 10, function (err, hash) {
        if (err) {
        return next(err);
        }
        doctor.password = hash;
        next();
    })
    });*/

    exports.Clinic = mongoose.model("Clinic", clinicSchema);

	exports.Doctor = mongoose.model('Doctor', doctorSchema);
});