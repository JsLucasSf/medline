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
      return callback({"error": "Não foi possível criar a notificação",
                "message":  error})
    }else{
      console.log("Criou :)");
      return callback(notification);
    }
  });
}

exports.list = function(callback){
  db.Notification.find({}, function(error, notifications) {
    if(error) {
      return callback({error: 'Não foi possivel retornar as notificações',
                message: error});
    } else {
      return callback(notifications);
    }
  });
};

exports.notificationAlreadyExists = function(clinicId, doctorId, callback){
  db.Notification.find({"sourceUser" : clinicId, "targetUser": doctorId},
    function(error, notifications){
      if(error){
        return callback(false);
      }
      return callback (notifications.length > 0);
    });
}

exports.get = function(notificationId, callback){
  db.Notification.find({"_id": notificationId}, function(error, notification){
    if(error){
      return callback({error: "Não foi possível encontrar a notificação",
                      message: error});
    }else{
      return callback(notification);
    }
  })
};

exports.delete = function(notificationId, callback){
  db.Notification.remove({"_id": notificationId}, function(error){
    if(error){
      callback(error);

    }
  });
}
