var db = require('../db_config.js');

exports.list = function(callback){

	db.Doctor.find({}, function(error, doctors) {

		if(error) {

			callback({error: 'Não foi possivel retornar os medicos'});
		} else {

			callback(doctors);
		}
	});
};

exports.doctor = function(id, callback) {

	db.Doctor.findById(id, function(error, doctor) {

		if(error) {

			callback({error: 'Não foi possivel retornar o medico'});
		} else {

			callback(doctor);
		}
	});
};

exports.save = function(username, email, password, callback){

	var newDoctor = {
		'username': username,
		'email': email,
		'created_at': new Date()
	}

	db.Doctor.register(newDoctor, password, function(error, doctor){
		if(error){
			console.log(error);
			callback({error : "Não foi possível salvar o médico"});
		}else{
			callback(doctor);
		}
	});
	// new db.Doctor({
	//
	// 	'fullname': fullname,
	// 	'email': email,
	// 	'password': password,
	// 	'created_at': new Date()
	// }).save(function(error, doctor) {
	//
	// 	if(error) {
	//
	// 		callback({error: 'Não foi possivel salvar o medico'});
	// 	} else {
	//
	// 		callback(doctor);
	// 	}
	// });
};


exports.update = function(id, fullname, email, password, callback) {

	db.Doctor.findById(id, function(error, doctor) {

		if(fullname) {

			doctor.fullname = fullname;
		}

		if(email) {

			doctor.email = email;
		}

		if(password) {

			doctor.password = password;
		}

		doctor.save(function(error, doctor) {

			if(error) {

				callback({error: 'Não foi possivel salvar o medico'});
			} else {

				callback(doctor);
			}
		});
	});
};

exports.delete = function(id, callback) {

	db.Doctor.findById(id, function(error, doctor) {

		if(error) {

			callback({error: 'Não foi possivel retornar o médico'});
		} else {

			doctor.remove(function(error) {

				if(!error) {

					callback({response: 'Médico excluido com sucesso'});
				}
			});
		}
	});
};

exports.authenticate = function(email, password, callback){
	db.Doctor.find(email, function(error, doctor){

		if(error) {
			callback({error: 'Não foi possivel retornar o medico'});
		} else {
			callback(doctor);
		}
	});
};
