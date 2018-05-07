var db = require('../db_config.js');

exports.criar = function(idClinica,
  idMedico, nomeMedico,
  idPaciente, nomePaciente,
  data, hora, callback){

  var novoAcompanhamento = {
    'clinica': idClinica,
    'medico': idMedico,
    'nomeMedico': nomeMedico,
    'paciente': idPaciente,
    'nomePaciente': nomePaciente,
    'consultas': []
  }

  db.Acompanhamento.find({}, function(erro, acompanhamentos){
    if(erro){
      return callback({'erro': erro, 'mensagem': 'Não foi possível criar a consulta'});
    }else{
      for(var i = 0; i < acompanhamentos.length; i++){
        if(acompanhamentos[i].clinica === novoAcompanhamento.clinica &&
          acompanhamentos[i].medico === novoAcompanhamento.medico &&
          acompanhamentos[i].paciente === novoAcompanhamento.paciente){

            return callback({
             'erro': "acompanhamento já existe",
             'acompanhamento': acompanhamentos[i]
            });
          }
      }

      var novaConsulta = {
        'data': data,
        'hora': hora
      }

      novoAcompanhamento.consultas.push(novaConsulta);
      console.log(novoAcompanhamento);
      novoAcompanhamento = db.Acompanhamento(novoAcompanhamento);
      novoAcompanhamento.save(novoAcompanhamento, function(erro, acompanhamento){
        if(erro){
          return callback({'erro': erro, 'mensagem': 'Não foi possível criar a consulta'});
        }else{
          return callback(acompanhamento);
        }
      })
    }
  });
};

exports.criarConsulta = function(acompanhamentoExistente, data, hora, callback){
  var novaConsulta = {
    'data': data,
    'hora': hora
  }

  db.Acompanhamento.findOneAndUpdate({'_id': acompanhamentoExistente._id},
                                    {$push: {consultas: novaConsulta}},
        function(erro, novoAcompanhamento){
          if(erro){
            callback({'erro': erro, 'message': 'Não foi possível criar a consulta'});
          }else{
            return callback(novoAcompanhamento);
          }
        });
}

exports.criaProntuario = function(idAcompanhamento, idConsulta, altura, peso,
                                  sintomas, diagnostico, prescricao, callback){

  var novoProntuario = {
    'altura': altura,
    'peso': peso,
    'sintomas': sintomas,
    'diagnostico': diagnostico,
    'prescricao': prescricao
  }

  db.Acompanhamento.findOneAndUpdate({"_id": idAcompanhamento, "consultas._id": idConsulta},
    {$set: {"consultas.$.prontuario": novoProntuario}}, function(erro, acompanhamento){
      if(erro){
        return callback({'erro': erro, 'mensagem': 'Não foi possível modificar a consulta'});
      }else{
        return callback(acompanhamento);
      }
    });
}

exports.listar = function(callback){
  db.Acompanhamento.find({}, function(erro, acompanhamentos) {
		if(erro) {
			return callback({'erro': erro,
								'mensagem': 'Não foi possivel retornar as consultas'});
		} else {
			return callback(acompanhamentos);
		}
  });
}
  exports.encerrarAtendimento = function(idAcompanhamento, callback){
    db.Acompanhamento.remove({'_id': idAcompanhamento}, function(erro) {
      if(erro) {
        return callback({'erro': erro,
                  'mensagem': 'Não foi possivel remover acompanhamento'});
      } else {
        return callback({'mensagem': 'Acompanhamento removido com sucesso'});
      }
    });
}
