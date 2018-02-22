var db = require('../db_config.js');

exports.patientAppointments = function(patientId, callback){
	db.Appointment.find({"patientId": patientId}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas do paciente',
								message: error});
		} else {
			callback(appointments);
		}
	});
};

exports.doctorAppointments = function(doctorId, callback){
	db.Appointment.find({"doctorId": doctorId}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas do médico',
								message: error});
		} else {
			callback(appointments);
		}
	});
};

exports.clinicAppointments = function(clinicId, callback){
	db.Appointment.find({"clinicId": clinicId}, function(error, appointments) {
		if(error) {
			callback({error: 'Não foi possivel retornar as consultas da clinica',
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

exports.register = function(patientId, doctorId, clinicId, date, time,
										 callback){

	var newAppointment = {
		'patientId': patientId,
		'doctorId': doctorId,
		'clinicId': clinicId,
		'date': date,
		'time': time
 	};

	db.Appointment.find(newAppointment, function(error, appointments){
		if(error){
			return callback({error : "Não foi possível cadastrar consulta",
											message : error});
		}else{
			console.log(appointments.length);
			if(appointments.length === 0){
				newAppointment = db.Appointment(newAppointment);

				newAppointment.save(newAppointment, function(error, appointment){
					if(error){
						console.log("entrou aqui!!")
						console.log(error);
						return callback({error : "Não foi possível cadastrar consulta",
											message : error});
					}else{
						return callback(appointment);
					}
				});
			}else{
				return callback({error: "Não foi possível cadastrar consulta",
											message : "Uma consulta semelhante já está cadastrada"});
			}
		}
	});
};

exports.update = function(apointmentId, doctorId, date, time, callback) {

	db.Appointment.findById(appointmentId, function(error, appointment) {

		if(doctorId) {

			appointment.doctorId = doctorId;
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
