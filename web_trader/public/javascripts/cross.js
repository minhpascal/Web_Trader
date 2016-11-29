/**
 * You must include the dependency on 'ngMaterial'
 */

var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngTouch', 'ui.grid',
	'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav', 'ui.grid.resizeColumns',
	 'ui.grid.selection', 'ui.grid.exporter'
	]);

//app.controller('MenuCtrl', MenuCtrl);
//
//function MenuCtrl($scope) {
//    $scope.currentNavItem = 'page1';
//}
//
//function recalExpiry(due_date) {
//	var over3m = new Date();
//	over3m.setMonth(over3m.getMonth() - 3);
//	var over2m = new Date();
//	over2m.setMonth(over2m.getMonth() - 2);
//	var dueDateTs = new Date(due_date);
//	
////	console.log(dueDateTs + ',' + dueDateTs.getTime() + ',' +  over2m.getTime() + ',' +  over3m.getTime());
//	
//	if (dueDateTs.getTime() < over3m.getTime()) {
//		return 3;	// unpaid > three month
//	}
//	else if (dueDateTs.getTime() < over2m.getTime()) {
//		return 2;	// unpaid > two month
//	}else {
//		return 1;	// within one month
//	}
//}
//
//function pmtExpiry(priority) {
//	switch (priority) {
//	case 0: return 'Paid';
//	case 1: return 'Within 2 Month';
//	case 2: return 'Over 2 Month';
//	case 3: return 'Over 3 Month';
//	}
//}

app.controller('InvoiceCtrl', ['$scope', '$http', '$q', '$interval', '$mdDialog', 'uiGridConstants', 'uiGridExporterService', 'uiGridExporterConstants',
	function ($scope, $http, $q, $interval, $mdDialog, uiGridConstants, uiGridExporterService, uiGridExporterConstants) {
	
	$scope.count = 1;
	$scope.editMap = {};
//	$scope.selectionMap = {};
	
	$scope.hkd_unpaid = 0;
	$scope.hkd_paid = 0;
	$scope.hkd_total = 0;
	$scope.usd_unpaid = 0;
	$scope.usd_paid = 0;
	$scope.usd_total = 0;
	$scope.jpy_unpaid = 0;
	$scope.jpy_paid = 0;
	$scope.jpy_total = 0;
	
	$scope.gridOptions = {
		rowEditWaitInterval: -1,			
		enableSorting : false,
		enableColumnResizing: true,
//		enableFiltering: true,
		showGridFooter: true,
		showColumnFooter: false,
		columnDefs : [ 
//			{field : 'isToSendEmail', displayName: '', width: '80', type: 'boolean', visible:false,  
//				cellTemplate: '<input type="checkbox" ng-model="row.entity.isToSendEmail" ng-click="grid.appScope.saveEmail(row.entity);">'},
			{field : 'instrument', displayName: 'Instrument', width: '200', headerCellClass: 'text-center bGreen', enableCellEdit: true},
			{field : 'strike', displayName: 'Strike', width: '200', headerCellClass: 'text-center bGreen', enableCellEdit: false},
			{field : 'month', displayName: 'Month', enableSorting : false, width: '100', headerCellClass: 'text-center bGreen', enableCellEdit: false},
			{field : 'year', displayName: 'Year', enableSorting : false, width: '60', enableCellEdit: false, headerCellClass: 'text-center bGreen'},
			{field : 'price', displayName: 'Price', width: '100', headerCellClass: 'text-center bGreen', enableCellEdit: false},
			{field : 'qty', displayName: 'Qty', enableSorting : false, width: '100', headerCellClass: 'text-center bGreen', enableCellEdit: false},
//			{field : 'isPaid', displayName: 'Paid', width: '50', type: 'boolean', headerCellClass: 'text-center bGreen',
//				cellTemplate: '<input type="checkbox" ng-checked="{{row.entity.isPaid}}" ng-model="row.entity.isPaid" ng-click="grid.appScope.clickPaid(row.entity);">'},
			{field : 'cond', displayName: 'Cond', visible:false, width: '150', headerCellClass: 'text-center bGreen', enableCellEdit: false},
			{field : 'side', displayName: 'Side', visible:true, headerCellClass: 'text-center bGreen', 
		        editableCellTemplate: 'uiSelect',
		        editDropdownOptionsArray: [
		          'Crossed',
		          'Buy',
		          'Sell'
		        ]
			},
//			{field : 'hasSent', displayName: 'Sent', width: '80', visible:false, type: 'boolean', headerCellClass: 'text-center bGreen', 
//				cellTemplate: '<input type="checkbox" ng-checked="{{row.entity.hasSent}}" ng-model="row.entity.hasSent" ng-click="grid.appScope.clickSent(row.entity);" ng-disabled="false" >'},
////			ng-checked="{{tradeConfo.hasSent}}" ng-disabled="true"
//			{field : 'sentTo', displayName: 'Email', width: '*', maxWidth: '100', visible: false},
//			{field : 'size', displayName: 'Size', width: '*', maxWidth: '80', headerCellClass: 'text-center bGreen', enableCellEdit: false}, 
//			{field : 'hedge', displayName: 'Hedge', width: '*', maxWidth: '80', headerCellClass: 'text-center bGreen', enableCellEdit: false},
		],
//	    rowTemplate: '<div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ' + 
//	    'ui-grid-one-bind-id-grid="rowRenderIndex + \'-\' + col.uid + \'-cell\'" ' + 
//	    'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader , \'row-3m\': row.entity.priority === 3, \'row-2m\': row.entity.priority === 2, \'row-paid\': row.entity.priority === 0}" ' + 
//	    'role="{{col.isRowHeader ? \'rowheader\' : \'gridcell\'}}" ui-grid-cell></div>',
		
	    enableGridMenu: false,
	    enableSelectAll: true,
	    enableRowSelection: true,
//	    exporterMenuPdf: false,
//	    exporterCsvFilename: 'invoice_summary.csv',
//	    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
//	    gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
//	    gridApi.edit.on.beginCellEdit($scope, function(rowEntity, colDef) {
//	        //This alert just shows which info about the edit is available
//	        alert('before Column: ' + colDef.name + ' ID: ' + rowEntity.id + ' Name: ' + rowEntity.name + ' Age: ' + rowEntity.age)
//	    });
	    gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEdit);
	    
		gridApi.selection.on.rowSelectionChanged($scope,function(row){
//			var amount = Number(row.entity.amount_due.substring(3).replace(',',''));
//			if (!row.isSelected) {
//				amount *= -1;
//			}
//			if (row.entity.isPaid) {
//				switch (row.entity.currency) {
//				case 'HKD': $scope.hkd_paid += amount; break;
//				case 'JPY': $scope.jpy_paid += amount; break;
//				default: $scope.usd_paid += amount; break;
//				}
//			}
//			else {
//				switch (row.entity.currency) {
//				case 'HKD': $scope.hkd_unpaid += amount; break;
//				case 'JPY': $scope.jpy_unpaid += amount; break;
//				default: $scope.usd_unpaid += amount; break;
//				}
//			}
		});
	   
		gridApi.core.on.rowsRendered($scope, function(grid, sortColumns) {
			$scope.hkd_paid = 0;
			$scope.hkd_unpaid = 0;
			$scope.usd_paid = 0;
			$scope.usd_unpaid = 0;
			$scope.jpy_paid = 0;
			$scope.jpy_unpaid = 0;
			
           //console.log(grid);
			_.reduce(gridApi.grid.renderContainers.body.visibleRowCache, function(a, b){
				var amount = Number(b.entity.amount_due.substring(3).replace(',',''));
				if (b.entity.currency === 'HKD')
				{
					if (b.entity.isPaid)
						$scope.hkd_paid += amount;
					else
						$scope.hkd_unpaid += amount;
				}
				else if (b.entity.currency === 'JPY')
				{
					if (b.entity.isPaid)
						$scope.jpy_paid += amount;
					else
						$scope.jpy_unpaid += amount;
				}
				else
				{
					if (b.entity.isPaid)
						$scope.usd_paid += amount;
					else
						$scope.usd_unpaid += amount;
				}
			}, 0);
			
			$scope.hkd_total = $scope.hkd_paid + $scope.hkd_unpaid;
			$scope.jpy_total = $scope.jpy_paid + $scope.jpy_unpaid;
			$scope.usd_total = $scope.usd_paid + $scope.usd_unpaid;
        });
		
		gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
//			for (i in rows) {
//				if (!rows[i].isSelected) {
//					$scope.hkd_paid = 0;
//					$scope.hkd_unpaid = 0;
//					$scope.usd_paid = 0;
//					$scope.usd_unpaid = 0;
//					$scope.jpy_paid = 0;
//					$scope.jpy_unpaid = 0;
//					return;
//				}
//				else {
//					var row = rows[i];
//					var amount = Number(rows[i].entity.amount_due.substring(3).replace(',',''));
//					if (row.entity.isPaid) {
//						switch (row.entity.currency) {
//						case 'HKD': $scope.hkd_paid += amount; break;
//						case 'JPY': $scope.jpy_paid += amount; break;
//						default: $scope.usd_paid += amount; break;
//						}
//					}
//					else {
//						switch (row.entity.currency) {
//						case 'HKD': $scope.hkd_unpaid += amount; break;
//						case 'JPY': $scope.jpy_unpaid += amount; break;
//						default: $scope.usd_unpaid += amount; break;
//						}
//					}
//				}
//			}
		});
	}
	
	$scope.afterCellEdit = function(rowEntity, colDef, newValue, oldValue) {
//		alert('onEdit: ' + newValue + ' ' + oldValue);
		$scope.editMap[rowEntity.id] = rowEntity;
//		if (rowEntity.isPaid) {
//			rowEntity.priority = 0;
//			rowEntity.oldPriority = rowEntity.priority;
//		}
//		else {
//			rowEntity.priority = rowEntity.oldPriority;
//			rowEntity.oldPriority = rowEntity.priority;
//		}
//		if (rowEntity.isPaid) {
//			rowEntity.isOver2m = false;
//			rowEntity.isOver3m = false;
//		}
    };

    $scope.clickSent = function(rowEntity) {
//    	alert('clickPaid: ' + rowEntity);
    	$scope.editMap[rowEntity.id] = rowEntity;
    };
    
    $scope.clickPaid = function(rowEntity) {
//    	alert('clickPaid: ' + rowEntity);
    	$scope.editMap[rowEntity.id] = rowEntity;
    	if (rowEntity.isPaid) {
    		rowEntity.oldPriority = rowEntity.priority;
    		rowEntity.priority = 0;
    		
    		rowEntity.pmtExpiry = pmtExpiry(0);
    	}
    	else {
    		var temp = rowEntity.priority; 
    		rowEntity.priority = recalExpiry(rowEntity.due_date);
    		rowEntity.oldPriority = temp;
    		
    		rowEntity.pmtExpiry = pmtExpiry(rowEntity.priority);
    	}
    	
       //console.log(grid);
		var amount = Number(rowEntity.amount_due.substring(3).replace(',',''));
		switch (rowEntity.currency) { 
		case 'HKD':
		{
			if (rowEntity.isPaid){
				$scope.hkd_paid += amount;
				$scope.hkd_unpaid -= amount;
			}
			else {
				$scope.hkd_unpaid += amount;
				$scope.hkd_paid -= amount;
			}
			$scope.hkd_total = $scope.hkd_paid + $scope.hkd_unpaid;
			break;
		}
		case 'JPY':
		{
			if (rowEntity.isPaid){
				$scope.jpy_paid += amount;
				$scope.jpy_unpaid -= amount;
			}
			else {
				$scope.jpy_unpaid += amount;
				$scope.jpy_paid -= amount;
			}
			$scope.jpy_total = $scope.jpy_paid + $scope.jpy_unpaid;
			break;
		}
		default: 
		{
			if (rowEntity.isPaid){
				$scope.usd_paid += amount;
				$scope.usd_unpaid -= amount;
			}
			else {
				$scope.usd_unpaid += amount;
				$scope.usd_paid -= amount;
			}
			$scope.usd_total = $scope.usd_paid + $scope.usd_unpaid;
		}
		}
    	
		$http.post('api/saveInvoice', {
			//		invoice: rowEntity
			id : rowEntity.id,
			isPaid : rowEntity.isPaid,
			hasSent: rowEntity.hasSent
		}).then(function(result) {
			//		promoise.resolve();
			alert('succ');
		}).then(function(result) {
			//		promoise.reject();
			alert('fail');
		});
    };
	
//    $scope.saveEmail = function( rowEntity ) {
//    	if (rowEntity.isToSendEmail === true)
//    		$scope.selectionMap[rowEntity.id] = rowEntity;
//    	else 
//    		delete $scope.selectionMap[rowEntity.id];
//    };
    
	$scope.saveRow = function( rowEntity ) {
//		$http.post('api/saveInvoice', {
////			invoice: rowEntity
//			id : rowEntity.id,
//			invoice_number : rowEntity.invoice_number,
//			invoice_date : rowEntity.invoice_date,
//			amount : rowEntity.amount,
//			size : rowEntity.size,
//			hedge : rowEntity.hedge,
//			isPaid : rowEntity.isPaid,
//			hasSent: rowEntity.hasSent
//		}).then(function(result) {
////			promoise.resolve();
//			alert('succ');
//		}).then(function(result) {
////			promoise.reject();
//			alert('fail');
//		});
		
//	    $scope.gridApi.rowEdit.setSavePromise($scope.gridApi.grid, rowEntity, promise);
//	    promise.resolve();
		
		// create a fake promise - normally you'd use the promise returned by $http or $resource
	    var promise = $q.defer();
	    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
	    // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
	    $interval( function() {
		    //$scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);
		    	
		    if (rowEntity.isPaid === true ){
		    	promise.reject();
		    } else {
		    	promise.resolve();
		    }
		 }, 1000, 1);
	};
	
	$http.get('api/getInvoice').then(function(result) {
//		console.log(result);
		$scope.gridOptions.data = result.data.data;
		
		for (i=0; i<result.data.data.length; i++) {
			var curncy = result.data.data[i].currency;
			var amount = result.data.data[i].amount_due;
			switch (curncy) {
			case 'HKD': $scope.hkd_total += Number(amount.substring(3).replace(',','')); break;
			case 'JPY': $scope.jpy_total += Number(amount.substring(3).replace(',','')); break;
			default: $scope.usd_total += Number(amount.substring(3).replace(',','')); break;
			}
		}
	});
	

	$scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
		if (col.filters[0].term) {
			return 'header-filtered';
		} else {
			return '';
		}
	};
	
	
	$scope.showSave = function(ev) {
		
		var n = 0;
		for ( var i in $scope.editMap) {
			n++;
		}
		
		if (n === 0) {
			$mdDialog.show($mdDialog.alert()
//				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('Save Invoice')
				.textContent('Nothing changed')
				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
		}
		else {
			// Appending dialog to document.body to cover sidenav in
			// docs app
			var confirm = $mdDialog.confirm()
			.title('Save Invoice')
			.textContent('Update invoice : ' + n)
			.ariaLabel('Lucky day').targetEvent(ev).ok('OK')
			.cancel('Cancel');
			
			$mdDialog.show(confirm).then(function() {
//				$scope.status = 'You decided to get rid of your debt.';
				for ( var i in $scope.editMap) {
					var rowEntity = $scope.editMap[i];
					$http.post('api/saveInvoice', {
						//		invoice: rowEntity
						id : rowEntity.id,
						invoice_number : rowEntity.invoice_number,
						invoice_date : rowEntity.invoice_date,
						amount : rowEntity.amount,
						size : rowEntity.size,
						hedge : rowEntity.hedge,
						isPaid : rowEntity.isPaid,
						hasSent: rowEntity.hasSent
					}).then(function(result) {
						//		promoise.resolve();
						alert('succ');
					}).then(function(result) {
						//		promoise.reject();
						alert('fail');
					});
					//					alert(i +":" + $scope.map[i].invoice_number)
				}
				
				$scope.gridRows = $scope.gridApi.rowEdit.getDirtyRows();
				var dataRows = $scope.gridRows.map(function (gridRow) { return gridRow.entity; });
				$scope.gridApi.rowEdit.setRowsClean(dataRows);
				
				// clear modified row
				$scope.editMap = {};
			}, function() {
//				$scope.status = 'You decided to keep your debt.';
			});
		}
	};
	
	
	$scope.showSendEmail = function(ev) {
		
		var n = 0;
		var hasChanged = false;
		var hasSentBefore = false;
		
		var list = $scope.gridApi.selection.getSelectedRows();
		var length = list.length;
		
//		for ( var i in $scope.selectionMap) {
		for ( var i = 0; i < length; i++) {
			var id = list[i].id;
			if (id in $scope.editMap)
			{
				hasChanged = true;
			}
//			else if ($scope.selectionMap[i].hasSent === 'true') {
			else if (list[i].hasSent === true) {
				hasSentBefore = true;
			}
			else {
				n++;
			}
		}
		
		if (hasChanged) {
			$mdDialog.show($mdDialog.alert()
//				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('Email invoice to client')
				.textContent('Some invoice has been modified. Please save')
				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
		}
		else if (hasSentBefore) {
			$mdDialog.show($mdDialog.alert()
//				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('Email invoice to client')
				.textContent('Some invoice has sent already. Please check and send manually')
				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
		}
		else if (n > 0){
			// Appending dialog to document.body to cover sidenav in
			// docs app
			var confirm = $mdDialog.confirm()
				.title('Email invoice to client')
				.textContent('Client selected : ' + n)
				.ariaLabel('Lucky day').targetEvent(ev).ok('OK')
				.cancel('Cancel');
			
			$mdDialog.show(confirm).then(function() {
				var id_list = [];
//				$scope.status = 'You decided to get rid of your debt.';
				
				var list = $scope.gridApi.selection.getSelectedRows();
				var n = list.length;
				
				for ( var i = 0; i < n; i++) {
					id_list.push(list[i].id);
					list[i].hasSent = true;
				}
					
				$http.post('api/emailInvoice', {
					'id_list' : id_list
				}).then(function(result) {
//		promoise.resolve();
					alert('succ');
				}).then(function(result) {
//		promoise.reject();
					alert('fail');
				});
					
				$scope.gridApi.selection.clearSelectedRows();
					
			}, function() {
//				$scope.status = 'You decided to keep your debt.';
			});
		}
		else { 
			$mdDialog.show($mdDialog.alert()
//				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('Email invoice to client')
				.textContent('No client selected. Please select at least one')
				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
		}
	};
	
	$scope.showDeleteInvoice = function(ev) {
		
		var list = $scope.gridApi.selection.getSelectedRows();
		var n = list.length;
		
		if (n > 0){
			// Appending dialog to document.body to cover sidenav in
			// docs app
			var confirm = $mdDialog.confirm()
			.title('Delete invoice')
			.textContent('delete invoices : ' + n)
			.ariaLabel('Lucky day').targetEvent(ev).ok('OK')
			.cancel('Cancel');
			
			$mdDialog.show(confirm).then(function() {
//				$scope.status = 'You decided to get rid of your debt.';
				
				var list = $scope.gridApi.selection.getSelectedRows();
				var n = list.length;
				var id_list = [];
//				for ( var i in $scope.selectionMap) {
				for ( var i = 0; i < n; i++) {
					id_list.push(list[i].id);
				}
//				for ( var i in $scope.selectionMap) {
//					var rowEntity = $scope.selectionMap[i];
				$http.post('api/deleteInvoice', {
					//		invoice: rowEntity
					'id_list' : id_list,
				}).then(function(result) {
					//		promoise.resolve();
					alert('succ');
				}).then(function(result) {
					//		promoise.reject();
					alert('fail');
				});
				rowEntity = null;
				
				// do not clean
				$scope.gridApi.selection.clearSelectedRows();
				
				// delete rows
//				angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
//				    $scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
//				  });

				// refresh data again
				$http.get('api/getInvoice').then(function(result) {
					$scope.gridOptions.data = result.data.data;
				});
				
			}, function() {
//				$scope.status = 'You decided to keep your debt.';
			});
		}
		else { 
			$mdDialog.show($mdDialog.alert()
//				.parent(angular.element(document.querySelector('#popupContainer')))
				.clickOutsideToClose(true).title('Email invoice to client')
				.textContent('No client selected. Please tick column Email')
				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
		}
	};
	
	$scope.exportPdf = function() {
	    var grid = $scope.gridApi.grid;
	    var rowTypes = uiGridExporterConstants.ALL;
	    var colTypes = uiGridExporterConstants.ALL;
	    uiGridExporterService.pdfExport(grid, rowTypes, colTypes);
	  };
}]);

