
var app = angular.module('app', [ 
	'ngMaterial', 
	'ngMessages', 
//	'ngTouch', 
	'ui.grid', 
	'ui.grid.edit', 
	'ui.grid.rowEdit', 
	'ui.grid.cellNav',
	'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'ui.grid.expandable',
	'ui.grid.pinning',
	'ngAnimate' ,
	'btford.socket-io',
	'isteven-multi-select',
	'pdf',
	]);

app.factory('socket', function (socketFactory) {
	 return socketFactory();
	}).
	value('version', '0.1');

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', 
	'uiGridConstants', 
//	'$templateCache', 
	function($scope, $http, $mdDialog 
		,uiGridConstants
//		,	$templateCache
		) {
	
//	$http.get('api/getInfo').then(function(result) {
//		var tokens = result.data.data.split(':');
//		$scope.myIp = tokens[3];
//		$scope.myRevision = result.data.revision;
//		$scope.myEnv = result.data.env;
//	}, function(e) {
//		alert("error get info");
//	});
    
	$scope.preview = function(ev) {
//    	alert('buyerClick');
    
		$mdDialog.show({
			controller : PdfViewerDialogController,
			templateUrl : 'pdf.tmpl.html',
			parent : angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			fullscreen : false,
			locals: {
//				'myFile': response.data
				'myFile': 'CELERAEQ-2017-11222 KS200 APR17_MAY17 270 1x1 CTS 100 REF 269.5 (MAR17) SAMSUNG.pdf',
			},
// scope : $scope,
// preserveScope: true,
		// Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {	// either OK / Cancel -> succ
			if (answer === 'Cancel') {
				$scope.status = 'cancelled';	
			}
			else {
				$scope.status = 'generate pdf ' + answer;
			}
		}, function() { // fail , press outside or close dialog box
			$scope.status = 'close ';
// $mdDialog.destroy();
		});
	
    // ======================== otGridOptions start ================================
	
	// ====================== PdfViewerDialogController start ===========================
	function PdfViewerDialogController($scope, $mdDialog, $http, locals/*, uiGridConstants, $templateCache*/) { 
//		$scope.pdfName = 'Relativity: The Special and General Theory by Albert Einstein';
		$scope.pdfUrl = 'pdf/' + locals.myFile;
//		$scope.pdfUrl = 'api/pdf/' + locals.myFile;
//		$scope.pdfUrl = 'pdf/CELERAEQ-2017-11222 KS200 APR17_MAY17 270 1x1 CTS 100 REF 269.5 (MAR17) SAMSUNG.pdf';
//		$scope.pdfUrl = 'pdf/CELERAEQ-2017-12952_HSI24000L7_HKCEL.pdf';
		$scope.pdfPassword = 'test';
		$scope.scroll = 0;
		$scope.loading = 'loading';
		$scope.getNavStyle = function(scroll) {
			if (scroll > 100)
				return 'pdf-controls fixed';
			else
				return 'pdf-controls';
		}
		$scope.onError = function(error) {
			console.log(error);
		}
		$scope.onLoad = function() {
			$scope.loading = '';
		}
		$scope.onProgress = function(progressData) {
			console.log(progressData);
		};
		$scope.onPassword = function(updatePasswordFn,
				passwordResponse) {
			if (passwordResponse === PDFJS.PasswordResponses.NEED_PASSWORD) {
				updatePasswordFn($scope.pdfPassword);
			} else if (passwordResponse === PDFJS.PasswordResponses.INCORRECT_PASSWORD) {
				console.log('Incorrect password')
			}
		};
	}
	
	// ====================== TdDialogController start ===========================
	function TdDialogController($scope, $mdDialog, $http, locals, uiGridConstants, $templateCache) 
	{
		}
		
		$scope.hide = function() {
			$mdDialog.hide();
		};

		$scope.cancel = function() {
			$mdDialog.cancel();
		};

		$scope.answer = function(answer) {
			$mdDialog.hide(answer);
		};
	};
	// ====================== TdDialogController end ===========================
	
}]);
