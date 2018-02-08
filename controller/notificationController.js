var db = require('../db_config.js');

exports.addDoctorNotification = function(message, clinicId, doctorId, callback){
  var newNotification = db.Notification({
    "sourceUser": clinicId,
    "targetUser" : doctorId,
    "message" : message,
    "answered" : false,
    "type" : "add-doctor"
  });

  newNotification.save(newNotification, function(error, notification){
    if(error){
      console.log(error);
      callback({"error": "Não foi possível criar a notificação",
                "message":  error})
    }else{
      console.log("Criou :)");
      callback(notification);
    }
  });
}

exports.list = function(callback){
  db.Notification.find({}, function(error, notifications) {
    if(error) {
      callback({error: 'Não foi possivel retornar as notificações',
                message: error});
    } else {
      callback(notifications);
    }
  });
};
