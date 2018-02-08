const db_string = process.env.MONGODB_URI || 'mongodb://127.0.0.1/medline';

var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect(db_string, { useMongoClient: true });

var db = mongoose.connection;

var Doctor;

db.on('error', console.error.bind(console, 'Erro ao conectar no banco'));

var userSchema = mongoose.Schema({
	username: String,
	fullname: String,
	password: String,
	phone: String,
	// Patients and Doctors only
	age: Number,
	// Doctors only
	crm: Number,
	specialty: String,
	associatedClinics: Array,
	// Clinics only
	address: String,
	associatedDoctors: Array,
	appointments: Array,
	// ALL USERS, IMPORTANT: c = clinic, p = patient, d = doctor
	category: String
}, {
  usePushEach: true
});

var notificationSchema = mongoose.Schema({
	sourceUser: String,
	targetUser: String,
	message: String,
	answered: Boolean,
	type: String
})

var appointmentSchema = mongoose.Schema({
	patientID: String,
	doctorID: String,
	clinicID: String,
	date: Date,
	time: String
})

userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User", userSchema);
exports.Notification = mongoose.model("Notification", notificationSchema);
exports.Appointment = mongoose.model("Appointment", appointmentSchema);

