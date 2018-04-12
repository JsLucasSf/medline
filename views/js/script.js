// create the module and name it RoutingApp
var medlineApp = angular.module('medlineApp', []);

medlineApp.controller('headerController',['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/logged-user/info',
			method: "GET"
		})
		.then(function(response){
			$scope.usuarioLogado = response.data;
		});
	})();
}]);

medlineApp.controller('agendaController', ['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/logged-user/info',
			method: "GET"
		})
		.then(function(response){
			(function(){
				$http({
					url: '/agenda/appointments',
					method: "GET"
				})
				.then(function(response){
					$scope.pacientes = response.data.pacientes;
					$scope.usuarioLogado = response.data.user;
					$scope.consultas = response.data.consultas;
				});
			})();
		});
	})();

	$scope.addAppointment = function(){
		var clinicId = document.getElementsByName("clinicId")[0].value;
	  var doctorId = document.getElementsByName('doctorId')[0].value;
	  var patientId = document.getElementsByName('patientId')[0].value;
	  var date = document.getElementsByName('date')[0].value;
	  var time = document.getElementsByName('time')[0].value;

		// action="/clinic/agenda/add-appointment" method="post"

		var postData =
			{
				"clinicId": clinicId,
				"doctorId": doctorId,
				"patientId": patientId,
				"date": date,
				"time": time
			};

		$http({
			"url": '/clinic/agenda/add-appointment',
			"method": "POST",
			"data": postData
		})
		.then(function(response){
			if(response.data.error){
				var message =	document.getElementById("error-message-appointment");
				console.log(message);
				message.setAttribute("style", "display:block");
				message.innerText = response.data.message;

				setTimeout(function(){
					message.innerText = "";
					message.setAttribute("style", "display:none")
				}, 5000);
			}else{
				$window.location.href = "/agenda";
			}
		});
	}

	$scope.addMedicalReport = function(id){
		var idConsulta = document.getElementById("id-consulta").value;
		var altura = document.getElementsByName("altura")[0].value;
	  var peso = document.getElementsByName('peso')[0].value;
	  var sintoma1 = document.getElementsByName('sintoma1')[0].value;
	  var sintoma2 = document.getElementsByName('sintoma2')[0].value;
	  var sintoma3 = document.getElementsByName('sintoma3')[0].value;
		var diagnostico = document.getElementsByName('diagnostico')[0].value;
	  var prescricao = document.getElementsByName('prescricao')[0].value;

		var postData =
			{
				"idConsulta": idConsulta,
				"altura": altura,
				"peso": peso,
				"sintoma1": sintoma1,
				"sintoma2": sintoma2,
				"sintoma3": sintoma3,
				"diagnostico": diagnostico,
				"prescricao": prescricao
			};

			$http({
				"url": '/doctor/agenda/add/medicalReport',
				"method": "POST",
				"data": postData
			})
			.then(function(response){
				if(response.data.error){
					var message =	document.getElementById("error-message-medicalReport");
					console.log(message);
					message.setAttribute("style", "display:block");
					message.innerText = response.data.message;

					setTimeout(function(){
						message.innerText = "";
						message.setAttribute("style", "display:none")
					}, 5000);
				}else{
					$window.location.href = "/agenda";
					console.log(response.data);
				}
			});
	}
}])

medlineApp.controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$scope.submitLogin = function(){
		var username = document.getElementsByName("username")[0].value;
		var password = document.getElementsByName("password")[0].value;

		var postData = {"username": username, "password": password};

		$http({
      url: '/login',
      method: "POST",
      data: postData
    })
    .then(function(response) {
			if(response.data === "Password or username is incorrect"){
			var message =	document.getElementById("error-message");
			message.setAttribute("style", "display:block");
			message.innerText = "Usuário ou senha inválidos";
			}else{
				$window.location.href = "/home";
			}
    });

	}
	$scope.submitCadastroClinica = function(){
		var username = document.getElementsByName("username")[2].value;
		var clinicName = document.getElementsByName("clinicName")[0].value;
		var address = document.getElementsByName("address")[0].value;
		var password = document.getElementsByName("password")[2].value;
		var telephone = document.getElementsByName("telephone")[1].value;

		var postData = {"username": username, "clinicName": clinicName,
		 								"address": address, "telephone": telephone, "password": password};

		$http({
      url: '/clinic/new',
      method: "POST",
      data: postData
    })
    .then(function(response) {
			if(response.data.message && response.data.message.name === "UserExistsError"){
			var message =	document.getElementById("error-message-clinic");
			message.setAttribute("style", "display:block");
			message.innerText = "Uma clínica com o mesmo login já foi cadastrada";
			}else{
				$window.location.href = "/home";
			}
    });
	}
	$scope.submitCadastroPaciente = function(){

		var username = document.getElementsByName("username")[1].value;
		var fullname = document.getElementsByName("fullname")[0].value;
		var age = document.getElementsByName("age")[0].value;
		var password = document.getElementsByName("password")[1].value;
		var telephone = document.getElementsByName("telephone")[0].value;

		var postData = {"username": username, "fullname": fullname,
		 								"age": age, "telephone": telephone, "password": password};

		$http({
      url: '/patient/new',
      method: "POST",
      data: postData
    })
    .then(function(response) {
			if(response.data.message && response.data.message.name === "UserExistsError"){
			var message =	document.getElementById("error-message-patient");
			message.setAttribute("style", "display:block");
			message.innerText = "Um paciente com o mesmo login já foi cadastrado";
			}else{
				$window.location.href = "/home";
			}
    });
	}
	$scope.submitNewAppointment = function(){
		var clinicId = document.getElementsByName("clinicId")[0].value;
		var patientID = document.getElementsByName("patientId")[0].value;
		var doctorID = document.getElementsByName("doctorId")[0].value;
		var data = document.getElementsByName("data")[0].value;
		var time = document.getElementsByName("time")[0].value;

		var postData = {"clinicId": clinicId, "patientId": patientID, "doctorId": doctorID,
		 								"data": data, "time": time};

		$http({
			url: '/clinic/agenda/add-appointment',
			method: "POST",
			data: postData
			})
			.then(function(response) {
					if(response.data.message && response.data.message.name === "ExistsError"){
					var message =	document.getElementById("error-message-clinic");
					message.setAttribute("style", "display:block");
					message.innerText = "Não foi possível agendar consulta";
					}else{
						// ERRO!
						$window.location.href = "/clinic";
					}
			});
	}
	$scope.submitMedicalReport = function(){
		var clinicId = document.getElementsByName("clinicId")[0].value;
		var patientID = document.getElementsByName("patientId")[0].value;
		var doctorID = document.getElementsByName("doctorId")[0].value;
		var height = document.getElementsByName("height")[0].value;
		var weight = document.getElementsByName("weight")[0].value;
		var symptoms = document.getElementsByName("symptoms")[0].value;
		var prescription = document.getElementsByName("prescription")[0].value;

		var postData = {"clinicId": clinicId, "patientId": patientID, "doctorId": doctorID,
		 								"height": height, "weight": weight, "symptoms": symptoms, "prescription":prescription};

		$http({
			url: '/doctor/agenda/add/medicalReport',
			method: "POST",
			data: postData
			})
			.then(function(response) {
					if(response.data.message && response.data.message.name === "ExistsError"){
					var message =	document.getElementById("error-message-medicalReport");
					message.setAttribute("style", "display:block");
					message.innerText = "Não foi possível criar prontuário";
					}else{
						$window.location.href = "/agenda";
					}
			});
	}
}]);

medlineApp.controller('pacientesController', ['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/patients',
			method: "GET"
		})
		.then(function(response){
			$scope.pacientes = response.data;
			console.log($scope.pacientes);
		});
	})();
}]);

medlineApp.controller('prontuarioController', ['$scope', '$http', '$window', function($scope, $http, $window){
	$scope.exibirProntuario = function(idPaciente){
		$http({
			url: '/doctor/medicalReport/' + idPaciente,
			method: "GET",
			data: {"patientId": idPaciente}
		})
		.then(function(response) {
			$scope.prontuario = response.data.medicalReport;
		});
	}
}]);

medlineApp.controller('medicosController', ['$scope', '$http', '$window', function($scope, $http, $window) {
	(function(){

		$http({
			url: '/get-dados-notificacoes',
			method: "GET"
		})
		.then(function(response){
			$scope.minhasNotificacoes = response.data;

			$http({
				url: '/clinica/get-dados',
				method: "GET"
			})
			.then(function(response) {
				$scope.usuarioLogado = response.data.user;
				$scope.medicos = response.data.doctors;
				$scope.medicosAssociados = response.data.associatedDoctors;
			});
		});
	})();

	$scope.notificacaoExiste = function(idMedico){
		// TODO: No futuro, considerar tipo de notificação
		console.log($scope.minhasNotificacoes);
		for(var i = 0; i < $scope.minhasNotificacoes.length; i++){
			console.log($scope.minhasNotificacoes[i].targetUser);

			if($scope.minhasNotificacoes[i].targetUser === idMedico){
				return true;
			}
		}
		return false;
	}

	$scope.associarMedico = function(idMedico){
		if(confirm("Deseja associar o médico?")){
			$http({
				url: '/clinic/associateDoctor/' + idMedico,
				method: 'GET'
			})
			.then(function(response){
				if(response.data === "success"){
					console.log("Entrou");
					$window.location.href = "/medicos";
				}
			})
		}
	}

	$scope.cancelarAssociacao = function(idClinica, idMedico){
		$http({
			url: '/clinica/cancelarAssociacao',
			method: "PUT",
			data: {"clinica": idClinica, "medico": idMedico}
		})
		.then(function(response) {
			if(response.data === "success"){
				$window.location.href = "/medicos";
			}
		})
	}
}]);

medlineApp.controller('sidebarController',['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/logged-user/info',
			method: "GET"
		})
		.then(function(response){
			$scope.usuarioLogado = response.data;
		});
	})();
}]);

medlineApp.controller('notificacoesController',['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/minhas-notificacoes',
			method: "GET"
		})
		.then(function(response){
			$scope.notificacoes = response.data;
		});
	})();
}]);
