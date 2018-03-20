var db = require('../db_config.js');

exports.register = function(idPaciente, callback){
  var newHistory = db.PatientHistory({
    "idPaciente": idPaciente,
    "consultas": []
  });

  newHistory.save(function(error, history){
    if(error){
      return callback({error : "Não foi possível criar histórico de paciente",
											message : error});
    }else{
      return callback(history);
    }
  })
}

exports.newAppointment = function(idPaciente, idConsulta, dataConsulta,
  diagnostico, prescricao, callback){

	var novaConsulta = {
		'idConsulta': idConsulta,
    'dataConsulta': dataConsulta,
		'diagnostico': doctorId,
		'prescricao': prescricao
 	};

  db.PatientHistory.update({"idPaciente": idPaciente},
   {$push: {"consultas" : novaConsulta}}
  );
};
