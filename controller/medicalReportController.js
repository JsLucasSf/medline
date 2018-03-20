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

exports.register = function(clinicId, patientId, height, weight, symptoms, prescription,
										 callback){

	var newMedicalReport = {
		'clinicId' : clinicId,
		'patientId': patientId,
		'height': height,
		'weight': weight,
		'symptoms': symptoms,
		'prescription': prescription
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
