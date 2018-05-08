// create the module and name it RoutingApp
var medlineApp = angular.module('medlineApp', []);

medlineApp.controller('headerController',['$scope', '$http', '$window', function($scope, $http, $window){
	(function(){
		$http({
			url: '/usuario-logado',
			method: "GET"
		})
		.then(function(response){
			$scope.usuarioLogado = response.data;
		});
	})();
}]);

medlineApp.controller('agendaController', ['$scope', '$http', '$window', function($scope, $http, $window){
	var carregaDados = function(){
		$http({
			url: '/usuario-logado',
			method: "GET"
		})
		.then(function(response){
			$scope.usuarioLogado = response.data;
			(function(){
				$http({
					url: '/agenda/acompanhamentos',
					//url: '/agenda/appointments',
					method: "GET"
				})
				.then(function(response){
					$scope.acompanhamentos = response.data;
					//$scope.usuarioLogado = response.data.user;
					//$scope.consultas = response.data.consultas;
					//$scope.pacientes = response.data.pacientes;
				});
			})();
		});
	}
	
	carregaDados();

	$scope.criarConsulta = function(){
		var idClinica = String($scope.usuarioLogado._id);
	 	var idMedico = document.getElementsByName('idMedico')[0].value;
	    var idPaciente = document.getElementsByName('idPaciente')[0].value;
	    var data = document.getElementsByName('data')[0].value;
	    var hora = document.getElementsByName('hora')[0].value;

		$http({
			"url": '/usuarios',
			"method": "GET",
		}).then(function(response){
			var nomePaciente = response.data.filter(function(usuario){return usuario._id === idPaciente})[0].fullname;
			var nomeMedico = response.data.filter(function(usuario){return usuario._id === idMedico})[0].fullname;

			var dados =
				{
					"idClinica": idClinica,
					"idMedico": idMedico,
					"nomeMedico": nomeMedico,
					"idPaciente": idPaciente,
					"nomePaciente": nomePaciente,
					"data": data,
					"hora": hora
				};

			$http({
				"url": '/clinica/agenda/consulta',
				"method": "POST",
				"data": dados
			})
			.then(function(response){
				if(response.data.erro){
					var message =	document.getElementById("mensagem-erro-acompanhamento");
					console.log(message);
					message.setAttribute("style", "display:block");
					message.innerText = response.data.mensagem;

					setTimeout(function(){
						message.innerText = "";
						message.setAttribute("style", "display:none")
					}, 5000);
				}else{
					$window.location.href = "/agenda";
				}

			});
		});



	}

	$scope.criaProntuario = function(msg){

		var dadosConsulta = JSON.parse(document.getElementById("id-consulta").value);
		var altura = document.getElementsByName("altura")[0].value;
		var peso = document.getElementsByName('peso')[0].value;
		var sintomas = document.getElementsByName('sintomas')[0].value;
		var diagnostico = document.getElementsByName('diagnostico')[0].value;
		var prescricao = document.getElementsByName('prescricao')[0].value;

		var prontuario = {
			'idAcompanhamento': dadosConsulta.acompanhamento,
			'idConsulta': dadosConsulta.consulta,
			'altura': altura,
			'peso': peso,
			'sintomas': sintomas,
			'diagnostico': diagnostico,
			'prescricao': prescricao
		}

		$http({
			'url': '/agenda/prontuario',
			'method': "POST",
			'data': prontuario
		})
		.then(function(response){
			if(response.data.erro){
				// TODO: Tratar o erro
				console.log(response.data.erro);
			}else{
				$window.location.href = "/agenda";
			}
		});
	}

	$scope.encerraAtendimento = function(acompanhamento){
		if(confirm("Deseja realmente encerrar o atendimento?")){
			var consultasFechadas = acompanhamento.consultas
				.filter(function(consulta){return consulta.prontuarioSalvo === true})

			if(consultasFechadas.length === 0){
				alert(`Este acompanhamento não possui nenhuma consulta com
				prontuário salvo. Para encerrar um acompanhamento,
				por favor providencie um prontuário para uma consulta.`);
			}else{
				$http({
					'url': '/agenda/encerraAtendimento',
					'method': "POST",
					'data': {
						"idAcompanhamento": acompanhamento._id
					}
				})
				.then(function(response){
					if(response.data.erro){
						console.log(response.data.erro);
					}else{
						var message =	document.getElementById("success-message-encerraAtendimento");
						message.setAttribute("style", "display:block");
						message.innerText = "Acompanhamento encerrado!";
						$window.location.href = "/agenda";
					}
				});
			}
		}
	}

 	$scope.atualizaHistoricoPaciente = function(consulta){
		if(confirm("Deseja realmente salvar este prontuário no histórico do paciente?")){
			var resumo = {
				"id_consulta": consulta._id,
				"data": consulta.data,
				"sintomas": consulta.prontuario.sintomas,
				"diagnostico": consulta.prontuario.diagnostico,
				"prescricao": consulta.prontuario.prescricao
			}

			$http({
				'url': '/paciente/historico',
				'method': "POST",
				'data': resumo
			})
			.then(function(response){
				if(response.data.erro){
					// TODO: Tratar erro
					console.log(response.data);
				}else{
					carregaDados();
					document.getElementById("salva-prontuario-" + consulta._id).style.visibility = "hidden";
				}
			})
		}
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

	$scope.mostraHistorico = function(paciente){
		console.log(paciente);
	}
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
			url: '/usuario-logado',
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
