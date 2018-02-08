var db = require('../db_config.js');
var userController = require('./userController.js');
var doctorController = require('./doctorController.js');
var notificationController = require('./notificationController.js');
var appointmentController = require('./appointmentController.js');

exports.list = function(callback){
  db.User.find({"category": 'c'}, function(error, clinics) {
		if(error) {
			callback({error: 'Não foi possivel retornar as clínicas',
                message: error});
		} else {
			callback(clinics);
		}
	});
};

exports.save = function(username, clinicName, phone, address, password, callback){
  const newClinic = {
    "username" : username,
    "clinicName" : clinicName,
    "phone" : phone,
    "address" : address,
    "category" : 'c',
    "associatedDoctors" : []
  }

  db.User.register(newClinic, password, function(error, clinic){
    if(error){
      console.log(error);
      callback({error: "Não foi possível salvar a clínica",
                message: error});
    }else{
      callback(clinic);
    }
  });
}

exports.requestDoctor = function(clinicId, doctorId, callback){
  db.User.findById(clinicId, function(error, clinic){
    var errors = false;

    if(error){
      console.log(error);
      errors = true;
      callback({error: "Não foi possível encontrar a clínica",
                message: error});
    }else{
      if(clinic.category != 'c'){
        errors = true;
        callback({error: "Não foi possível associar o médico",
                  message: "Não é possível associar um médico a um elemento que não é uma clínica"});
      }
      userController.user(doctorId, function(resp){
        if(resp['error']){
          errors = true;
          callback({error: "Não foi possível associar o médico",
                    message: resp["message"]});
        }else{
          if(resp.category != 'd'){
            errors = true;
            callback({error: "Não foi possível associar o médico",
                      message: "Não é possível associar a uma clínica, um elemento que não seja um médico"});
          }
        }
      });
      if(clinic.associatedDoctors.includes(doctorId)){
        errors = true;
        callback({error: "Não foi possível associar o médico",
                  message: "Médico já associado"});
      }
      if(!errors){
        console.log(clinic);
        const notificationMessage = "A clínica " + clinic.username +
                                    " deseja adicionar você ao quadro de médicos";
        notificationController.addDoctorNotification(notificationMessage,
                                                    clinicId, doctorId,
                                                    function(resp){
          callback(resp);
        });
      };
    }
  });
}

exports.addDoctor = function(clinicId, doctorId, callback){
  db.User.findById(clinicId, function(error, clinic){
    var errors = false;

    if(error){
      console.log(error);
      errors = true;
      callback({error: "Não foi possível encontrar a clínica",
                message: error});
    }else{
      if(clinic.category != 'c'){
        errors = true;
        callback({error: "Não foi possível associar o médico",
                  message: "Não é possível associar um médico a um elemento que não é uma clínica"});
      }
      userController.user(doctorId, function(resp){
        if(resp['error']){
          errors = true;
          callback({error: "Não foi possível associar o médico",
                    message: resp["message"]});
        }else{
          if(resp.category != 'd'){
            errors = true;
            callback({error: "Não foi possível associar o médico",
                      message: "Não é possível associar a uma clínica, um elemento que não seja um médico"});
          }
        }
      });
      if(clinic.associatedDoctors.includes(doctorId)){
        errors = true;
        callback({error: "Não foi possível associar o médico",
                  message: "Médico já associado"});
      }
      if(!errors){
        const notificationMessage = "A clínica xxx deseja adicionar você ao quadro de médicos";
        notificationController.create(notificationMessage, doctorId, function(resp){
          callback(resp);
        });
        //clinic.associatedDoctors = clinic.associatedDoctors.concat([doctorId]);
        //clinic.associatedDoctors.push(doctorId);
        /*clinic.save(function(error, updatedClinic){
          if(error){
            callback({error: "Não foi possível associar o médico",
                      message: error});
          }else{
            callback(updatedClinic);
          }
        });*/
      };
    }
  });
}

exports.listDoctors = function(clinicId, callback){
  db.User.findById(clinicId, function(error, clinic){
    if(error){
      console.log(error);
      callback({error: "Não foi possível listar os médicos",
                message: error});
    }else{
      if(clinic.category != 'c'){
        callback({error: "Não foi possível listar os médicos",
                  message: "Não há médicos associados a entidades que não são clínicas"});
      }else{
        callback(clinic.associatedDoctors);
      }
    }
  });
}


exports.addAppointment = function(clinicId, appointmentID, callback){
  db.User.findById(clinicId, function(error, clinic){
    var errors = false;

    if(error){
      console.log(error);
      errors = true;
      callback({error: "Não foi possível encontrar a clínica",
                message: error});
    }else{
      if(clinic.category != 'c'){
        errors = true;
        callback({error: "Não foi possível cadastrar consulta",
                  message: "Não é possível cadastrar consulta um elemento que não é uma clínica"});
      }
      appointmentController.user(appointmentID, function(resp){
        if(resp['error']){
          errors = true;
          callback({error: "Não foi possível associar o médico",
                    message: resp["message"]});
        }else{
          if(resp.category != 'd'){
            errors = true;
            callback({error: "Não foi possível associar o médico",
                      message: "Não é possível associar a uma clínica, um elemento que não seja um médico"});
          }
        }
      });
      if(clinic.associatedDoctors.includes(doctorId)){
        errors = true;
        callback({error: "Não foi possível associar o médico",
                  message: "Médico já associado"});
      }
      if(!errors){
        const notificationMessage = "A clínica xxx deseja adicionar você ao quadro de médicos";
        notificationController.create(notificationMessage, doctorId, function(resp){
          callback(resp);
        });
        //clinic.associatedDoctors = clinic.associatedDoctors.concat([doctorId]);
        //clinic.associatedDoctors.push(doctorId);
        /*clinic.save(function(error, updatedClinic){
          if(error){
            callback({error: "Não foi possível associar o médico",
                      message: error});
          }else{
            callback(updatedClinic);
          }
        });*/
      };
    }
  });
}

exports.listAppointments = function(clinicId, callback){
  db.User.findById(clinicId, function(error, clinic){
    if(error){
      console.log(error);
      callback({error: "Não foi possível listar consultas",
                message: error});
    }else{
      if(clinic.category != 'c'){
        callback({error: "Não foi possível listar as consultas",
                  message: "Não há consultas cadastradas em entidades que não são clínicas"});
      }else{
        callback(clinic.appointments);
      }
    }
  });
}
