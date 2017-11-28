var db = require('../db_config.js');

exports.list = function(callback){

	db.User.find({"category" : 'd'}, function(error, doctors) {

		if(error) {

			callback({error: 'Não foi possivel retornar os medicos'});
		} else {

			callback(doctors);
		}
	});
};

exports.doctor = function(id, callback) {

	db.User.findById(id, function(error, doctor) {

		if(error) {

			callback({error: 'Não foi possivel retornar o medico'});
		} else {

			callback(doctor);
		}
	});
};

exports.save = function(username, age, password, phone,
											crm, specialty, callback){

	var newDoctor = {
		'username': username,
		'age': age,
		'phone': phone,
		'crm': crm,
		'specialty': specialty,
		'category': 'd'
	}

	db.User.register(newDoctor, password, function(error, doctor){
		if(error){
			console.log(error);
			callback({error : "Não foi possível salvar o médico",
								message : error});
		}else{
			callback(doctor);
		}
	});
};

exports.update = function(id, fullname, email, password, callback) {

	db.User.findById(id, function(error, doctor) {

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

	db.User.findById(id, function(error, doctor) {

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
	db.User.find(email, function(error, doctor){

		if(error) {
			callback({error: 'Não foi possivel retornar o medico'});
		} else {
			callback(doctor);
		}
	});
};
