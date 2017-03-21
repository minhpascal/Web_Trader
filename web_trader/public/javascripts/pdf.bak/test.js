var app = angular.module('testApp', [ 'ngPDFViewer' ]);

app.controller('TestController', [ '$scope', 'PDFViewerService', function($scope, pdf) {
	console.log('TestController: new instance');

	$scope.pdfURL = "pdf/test.pdf";
//	$scope.pdfURL = "pdf/data/test.pdf";

	$scope.instance = pdf.Instance("viewer");

	$scope.nextPage = function() {
		$scope.instance.nextPage();
	};

	$scope.prevPage = function() {
		$scope.instance.prevPage();
	};

	$scope.gotoPage = function(page) {
		$scope.instance.gotoPage(page);
	};

	$scope.pageLoaded = function(curPage, totalPages) {
		$scope.currentPage = curPage;
		$scope.totalPages = totalPages;
	};

	$scope.loadProgress = function(loaded, total, state) {
		console.log('loaded =', loaded, 'total =', total, 'state =', state);
	};
}]);
