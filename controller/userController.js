var db = require('../db_config.js');

exports.list = function(callback){
  db.User.find({}, function(error, users) {
		if(error) {
			callback({error: 'Não foi possivel retornar os usuários',
                message: error});
		} else {
			callback(users);
		}
	});
};

exports.user = function(id, callback) {

	db.User.findById(id, function(error, user) {
		if(error) {
			callback({error: 'Não foi possivel retornar o usuário',
								message: error});
		} else {
			callback(user);
		}
	});
};
