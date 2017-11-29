var db = require('../db_config.js');

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

exports.save = function(name, age, password, phone, callback){
  const newPatient = {
    "username" : name,
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
      callback(patient);
    }
  });
}
