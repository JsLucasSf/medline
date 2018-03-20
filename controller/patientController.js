var db = require('../db_config.js');

var historyController = require('./historyController.js');

exports.list = function(callback){
  db.User.find({"category": 'p'}, function(error, patients) {
		if(error) {
			callback({error: 'Não foi possivel retornar os pacientes',
                message: error});
		} else {
			callback(patients);
		}
	});
};

exports.save = function(username, fullname, age, password, phone, callback){
  const newPatient = {
    "username" : username,
    "fullname" : fullname,
    "phone" : phone,
    "age" : age,
    "category" : 'p'
  }

  db.User.register(newPatient, password, function(error, patient){
    if(error){
      console.log(error);
      callback({error: "Não foi possível salvar o paciente",
                message: error});
    }else{
      historyController.register(patient._id, function(resp){
        if(resp['error']){
          return callback(resp);
        }else{
          return callback(patient);
        }
      });
    }
  });
}
