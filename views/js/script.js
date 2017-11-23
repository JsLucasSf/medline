	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute']);
    
        // configure our routes
        scotchApp.config(function($routeProvider) {
            $routeProvider
    
                // route for the agenda page
                .when('/agenda', {
                    templateUrl : '/home.html#agenda',
                    controller  : 'agendaController'
                })
    
                // route for the pacientes page
                .when('/pacientes', {
                    templateUrl : '/pacientes.html',
                    controller  : 'pacientesController'
                })
    
                // route for the medicos page
                .when('/medicos', {
                    templateUrl : '/medicos.html',
                    controller  : 'medicosController'
                });
        });

        // create the controller and inject Angular's $scope
	scotchApp.controller('agendaController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Corpo da página de agenda aqui ';
	});

	scotchApp.controller('pacientesController', function($scope) {
		$scope.message = 'Corpo da página de pacientes aqui ';
	});

	scotchApp.controller('medicosController', function($scope) {
		$scope.message = 'Corpo da página de medicos aqui ';
    });
    

	scotchApp.controller('configController', function($scope) {
		$scope.message = 'Corpo da página de configurações aqui ';
	});