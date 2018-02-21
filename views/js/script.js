	// create the module and name it RoutingApp
	var medlineApp = angular.module('medlineApp', []);

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
				if(response.data.message && response.data.message.name === "UserExistsError"){
				var message =	document.getElementById("error-message-clinic");
				message.setAttribute("style", "display:block");
				message.innerText = "Não foi possível agendar consulta";
				}else{
					$window.location.href = "/clinic";
				}
	    });
		}
	}]);

  // create the controller and inject Angular's $scope
  medlineApp.controller('mainController', function($scope) {
    // create a message to display in our view
    $scope.message = 'Corpo da página principal aqui :) ';
  });

	medlineApp.controller('agendaController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Corpo da página de agenda aqui ';
	});

	medlineApp.controller('pacientesController', function($scope) {
		$scope.message = 'Corpo da página de pacientes aqui ';
	});

	medlineApp.controller('medicosController', function($scope) {
		$scope.message = 'Corpo da página de medicos aqui ';
    });

	medlineApp.controller('configController', function($scope) {
		$scope.message = 'Corpo da página de configurações aqui ';
	});

