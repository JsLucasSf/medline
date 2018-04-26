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

var acompanhamentoSchema = mongoose.Schema({
	"clinica": String,
	"medico": String,
	"nomeMedico": String,
	"paciente": String,
	"nomePaciente": String,
	"consultas": [{
		"data": Date,
		"hora": String,
		"prontuario": {
			"altura": Number,
			"peso": Number,
			"sintomas": String,
			"diagnostico": String,
			"prescricao": String
		}
	}]
})

var appointmentSchema = mongoose.Schema({
	patientId: String,
	doctorId: String,
	clinicId: String,
	date: String,
	time: String
})

var prontuarioSchema = mongoose.Schema({
	"idConsulta": String,
	"altura": Number,
	"peso": Number,
	"sintomas": String,
	"diagnostico": String,
	"prescricao": String
})

var historySchema = mongoose.Schema({
	"idPaciente": String,
	"consultas": [{
		"idConsulta": String,
		"dataConsulta": Date,
		"diagnostico": String,
		"prescricao": String
	}]
});

userSchema.plugin(passportLocalMongoose);

exports.User = mongoose.model("User", userSchema);
exports.Notification = mongoose.model("Notification", notificationSchema);
exports.Appointment = mongoose.model("Appointment", appointmentSchema);
exports.Prontuario = mongoose.model("Prontuario", prontuarioSchema);
exports.PatientHistory = mongoose.model("PatientHistory", historySchema);
exports.Acompanhamento = mongoose.model("Acompanhamento", acompanhamentoSchema);
