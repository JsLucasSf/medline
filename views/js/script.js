	// create the module and name it RoutingApp
	var scotchApp = angular.module('medlineApp', ['ngRoute']);
    
        // configure our routes
        scotchApp.config(function($routeProvider, $locationProvider) {
            console.log("route");
            $routeProvider

                //route for the home page
                .when('/home', {
                    templateUrl : 'home.ejs',
                    controller  : 'mainController'
                })
    
                // route for the agenda page
                .when('/agenda', {
                    templateUrl : 'agenda.html',
                    controller  : 'agendaController'
                })
    
                // route for the pacientes page
                .when('/pacientes', {
                    templateUrl : 'pacientes.html',
                    controller  : 'pacientesController'
                })
    
                // route for the medicos page
                .when('/medicos', {
                    templateUrl : 'medicos.html',
                    controller  : 'medicosController'
                })

                // route for the config page
                .when('/config', {
                    templateUrl : 'config.html',
                    controller  : 'configController'
                })
                
                .otherwise({
                    redirectTo: '/home'
                  });
        });

        // create the controller and inject Angular's $scope

    scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Corpo da página principal aqui ';
    });

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