var db = require('../db_config.js');

exports.list = function(callback){
  db.Clinic.find({}, function(error, clinics) {
		if(error) {
			callback({error: 'Não foi possivel retornar as clínicas',
                message: error});
		} else {
			callback(clinics);
		}
	});
};

exports.save = function(name, phone, address, password, callback){
  const newClinic = {
    "username" : name,
    "phone" : phone,
    "address" : address
  }

  db.Clinic.register(newClinic, password, function(error, clinic){
    if(error){
      console.log(error);
      callback({error: "Não foi possível salvar a clínica",
                message: error});
    }else{
      callback(clinic);
    }
  });
}
