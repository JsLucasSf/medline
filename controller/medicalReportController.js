var db = require('../db_config.js');

exports.medicalReport = function(id, callback) {

	db.MedicalReport.findById(id, function(error, medicalReport) {

		if(error) {
			callback({error: 'Não foi possivel retornar prontuário',
								message: error});
		} else {

			callback(medicalReport);
		}
	});
};

exports.userMedicalReport = function(patientId, callback){
	db.MedicalReport.find({"patientId": patientId}, function(error, medicalReport) {
		if(error) {
			callback({error: 'Não foi possivel retornar o prontuário do paciente',
								message: error});
		} else {
			callback(medicalReport);
		}
	});
};

exports.clinicMedicalReports = function(clinicId, callback){
	db.MedicalReport.find({"clinicId": clinicId}, function(error, medicalReports) {
		if(error) {
			callback({error: 'Não foi possivel retornar os prontuários da clínica',
								message: error});
		} else {
			callback(medicalReports);
		}
	});
};

exports.register = function(idConsulta, altura, peso, sintoma1, sintoma2,
	 sintoma3, diagnostico, prescricao, callback){

	var newMedicalReport = {
		"idConsulta": idConsulta,
		"altura": altura,
		"peso": peso,
		"sintoma1": sintoma1,
		"sintoma2": sintoma2,
		"sintoma3": sintoma3,
		"diagnostico": diagnostico,
		"prescricao": prescricao
	};

	db.MedicalReport.find(newMedicalReport, function(error, medicalReport){
		if(error){
			return callback({error : "Não foi possível cadastrar prontuário",
											message : error});
		}else{

			newMedicalReport = db.MedicalReport(newMedicalReport);

			newMedicalReport.save(newMedicalReport, function(error, medicalReport){
				if(error){
					console.log(error);
					return callback({error : "Não foi possível cadastrar prontuário",
										message : error});
				}else{
					return callback(medicalReport);
				}
			});
		}
	});
};

exports.update = function(medicalReportId, height, weight, symptoms, prescription, callback) {

	db.MedicalReport.findById(medicalReportId, function(error, medicalReport) {


		if(height) {

			medicalReport.height = height;
		}

		if(weight) {

			medicalReport.weight = weight;
		}

		if(symptoms) {

			medicalReport.symptoms = symptoms;
		}


		if(prescription) {

			medicalReport.prescription = prescription;
		}

		medicalReport.save(function(error, medicalReport) {

			if(error) {

				callback({error: 'Não foi possivel atualizar prontuário',
									message: error});
			} else {

				callback(medicalReport);
			}
		});
	});
};

exports.delete = function(id, callback) {

	db.MedicalReport.findById(id, function(error, medicalReport) {

		if(error) {

			callback({error: 'Não foi possivel retornar prontuário',
								message: error});
		} else {

			medicalReport.remove(function(error) {

				if(!error) {

					callback({response: 'Prontuário excluido com sucesso'});
				}
			});
		}
	});
};
