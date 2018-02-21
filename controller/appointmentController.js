var db = require('../db_config.js');

exports.patientAppointments = function(patientID, callback){
	db.Appointment.find({"patientID": patientID}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas do paciente',
								message: error});
		} else {
			callback(appointments);
		}
	});
};

exports.doctorAppointments = function(doctorID, callback){
	db.Appointment.find({"doctorID": doctorID}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas do médico',
								message: error});
		} else {
			callback(appointments);
		}
	});
};


exports.list = function(callback){
	db.Appointment.find({}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas',
								message: error});
		} else {
			callback(appointments);
		}
	});
};

exports.appointment = function(id, callback) {

	db.Appointment.findById(id, function(error, appointment) {

		if(error) {
			callback({error: 'Não foi possivel retornar a consulta',
								message: error});
		} else {

			callback(appointment);
		}
	});
};

exports.save = function(patientID, doctorID, clinicId, date, time,
										 callback){

	var newAppointment = {
		'patientID': patientID,
		'doctorID': doctorID,
		'clinicId': clinicId,
		'date': date,
		'time': time
	}

	db.Appointment.save(newAppointment, function(error, appointment){
		if(error){
			console.log(error);
			callback({error : "Não foi possível cadastrar consulta",
								message : error});
		}else{
			callback(appointment);
		}
	});
};

exports.update = function(apointmentID, doctorID, date, time, callback) {

	db.Appointment.findById(appointmentID, function(error, appointment) {

		if(doctorID) {

			appointment.doctorId = doctorID;
		}
		
		if(date) {
			
			appointment.date = date;
		}

		if(time) {

			appointment.time = time;
		}

		appointment.save(function(error, appointment) {

			if(error) {

				callback({error: 'Não foi possivel atualizar consulta',
									message: error});
			} else {

				callback(appointment);
			}
		});
	});
};

exports.delete = function(id, callback) {

	db.Appointment.findById(id, function(error, appointment) {

		if(error) {

			callback({error: 'Não foi possivel retornar a consulta',
								message: error});
		} else {

			appointment.remove(function(error) {

				if(!error) {

					callback({response: 'Consulta excluida com sucesso'});
				}
			});
		}
	});
};

