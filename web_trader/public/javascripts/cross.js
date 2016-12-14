var app = angular.module(
		'app',
		[ 'ngTouch', 'ngMaterial', 'ngAnimate', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection',
				'ui.grid.edit', 'ui.select' ]).controller('MainCtrl', MainCtrl)
		.directive('uiSelectWrap', uiSelectWrap);

uiSelectWrap.$inject = [ '$document', 'uiGridEditConstants' ];
function uiSelectWrap($document, uiGridEditConstants) {
	return function link($scope, $elm, $attr) {
		$document.on('click', docClick);

		function docClick(evt) {
			if ($(evt.target).closest('.ui-select-container').size() === 0) {
				$scope.$emit(uiGridEditConstants.events.END_CELL_EDIT);
				$document.off('click', docClick);
			}
		}
	};
}

MainCtrl.$inject = [ '$scope', '$http', '$log', '$timeout', '$mdDialog' ];
function MainCtrl($scope, $http, $log, $timeout, $mdDialog) {
	var month = moment(new Date()).format('MMM');
	var year = moment(new Date()).format('YYYY');


	click = function( ) {
		alert('click');
//		  ...some custom function using entity...
//		$scope.gridOptions.data.push({
//			"instr" : "HSCEI",
//			"type" : "Put",
//			"strike" : 9900,
//			"month" : month,
//			"year" : year,
//			"price" : "",
//			"qty" : "",
//			"cond" : "T2",
//			"side" : "Cross",
//			"legs" : [
//				{"side" : "Buy", "company" : "HKCEL"},
//				{"side" : "Sell", "company" : "HKCEL"}
//			]
//		});	
	};
	
	$scope.gridOptions = {
		rowEditWaitInterval: -1,
		enableColumnResizing: true,
//		expandableRowTemplate : '<div ui-grid="row.entity.subGridOptions" style="height:120px;" ui-grid-selection></div>',
		rowHeight : 35,
		columnDefs : [
				{
				    name:'add', headerCellClass : 'centered cYellow', width : 50, enableCellEdit : false,
//				    headerCellTemplate: '<button ng-click="grid.appScope.edit(row.entity)" >Add Leg</button>',
				    headerCellTemplate: '<i class="glyphicon glyphicon-plus pointer grid-tooltip" ng-click="grid.appScope.add(row.entity)"><span class="tooltiptext">Add Leg</span></i>',
//				    editableCellTemplate : '<i class="glyphicon glyphicon-trash" ng-click="grid.appScope.click(row.entity)></i>'
				    cellTemplate : '<i class="glyphicon glyphicon-trash pointer" ng-click="grid.appScope.remove(row.entity)"></i>'
				},
				{ field : 'instr', name : 'UL', width : 80, headerCellClass: 'text-center bBlue', 
					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ 'HSI', 'HSCEI' ]
				},
				{ field : 'type', name : 'Deriv', width : 80, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'Future', 'Call', 'Put']
				},
				{ field : 'strike', name : 'Strike', width : 80, type : 'number', headerCellClass: 'text-center bBlue'},
				{ field : 'month', name : 'Month', width : 80, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'Jan', 'Feb', 'Mar', 'Apr',
							'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
							'Dec' ]
				}, 
				{ field : 'year', name : 'Year', width : 80, headerCellClass: 'text-center bBlue'
//					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ '2016', '2017' ]
				}, 
				{ field : 'price', name : 'Price', width : 80, type : 'number', headerCellClass: 'text-center bBlue' },
				{ field : 'qty', name : 'Qty', width : 80, type : 'number', headerCellClass: 'text-center bBlue' }, 
				{ field : 'side', name : 'Side', width : 80, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ 'Buy', 'Sell', 'Cross' ]
				}, 
				{ field : 'cond', name : 'Cond', width : 80, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ 'T1', 'T2', 'T4' ]
//					editableCellTemplate: 'ui-grid/dropdownEditor',
//					cellFilter: "griddropdown:this", editDropdownIdLabel:'id',
//				      editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
//				      { id: 1, gender: 'male' },
//				      { id: 2, gender: 'female' }
//				    ]
				}, 
				{ field : 'buyer', name : 'Buyer', width : 100, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ 'HKCEL' ]
				} ,
				{ field : 'seller', name : 'Seller', width : 120, headerCellClass: 'text-center bBlue',
					editableCellTemplate : 'uiSelect', editDropdownOptionsArray : [ 'HKCEL' ]
				} ],
				
		onRegisterApi : function(gridApi) {

//			gridApi.selection.on.rowSelectionChanged($scope, function(row) {
//				var selectedState = row.isSelected;
//				// if row is expanded, toggle its children as selected
//				if (row.isExpanded) {
//					// choose the right callback according to row status
//					var selectCallBack = selectedState ? "selectAllRows"
//							: "clearSelectedRows";
//					// do the selection/unselection of children
//					row.subGridApi.selection[selectCallBack]();
//					// $log.log(row);
//				}
//			});
		}
	

	};

	var data = [];
	var data1 = [ {
		"instr" : "HSI",
		"type" : "Call",
		"strike" : 23000,
		"month" : month,
		"year" : year,
		"price" : "",
		"qty" : "",
		"cond" : "T1",
		"side" : "Cross",
		"legs" : []
	}, {
		"instr" : "HSCEI",
		"type" : "Put",
		"strike" : 9900,
		"month" : month,
		"year" : year,
		"price" : "",
		"qty" : "",
		"cond" : "T2",
		"side" : "Cross",
		"legs" : [
			{"side" : "Buy", "company" : "HKCEL"},
			{"side" : "Sell", "company" : "HKCEL"}
		]
	}, {
		"instr" : "HSCEI",
		"type" : "Future",
		"strike" : 9900,
		"month" : month,
		"year" : year,
		"price" : "",
		"qty" : "",
		"cond" : "T4",
		"side" : "Buy",
		"legs" : [
			{"side" : "Buy", "company" : "HKCEL"},
			{"side" : "Sell", "company" : ""}
		]
	}, ];
	$scope.gridOptions.data = data;
	

	$scope.add = function( entity ) {
//		alert('edit');
//		  ...some custom function using entity...
		$scope.gridOptions.data.push({
			"ul" : "HSCEI",
			"type" : "Put",
			"strike" : "",
			"month" : month,
			"year" : year,
			"price" : "",
			"qty" : "",
			"cond" : "T2",
			"side" : "Cross",
			"buyer" : "HKCEL",
			"seller" : "HKCEL"
		});	
		
	};
	
	$scope.remove = function(entity) {
//		alert('remove');
		var index = $scope.gridOptions.data.indexOf(entity);
		$scope.gridOptions.data.splice(index, 1);
	};
	
	$scope.showSendEmail = function(ev) {
		var list  = $scope.gridOptions.data;
		var length = list.length;
//		alert(list.length);
		
//		for ( var i = 0; i < length; i++) {
//			var id = list[i].id;
//			if (id in $scope.editMap)
//			{
//				hasChanged = true;
//			}
////			else if ($scope.selectionMap[i].hasSent === 'true') {
//			else if (list[i].hasSent === true) {
//				hasSentBefore = true;
//			}
//			else {
//				n++;
//			}
//		}
//		
//		if (hasChanged) {
//			$mdDialog.show($mdDialog.alert()
////				.parent(angular.element(document.querySelector('#popupContainer')))
//				.clickOutsideToClose(true).title('Email invoice to client')
//				.textContent('Some invoice has been modified. Please save')
//				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
//		}
//		else if (hasSentBefore) {
//			$mdDialog.show($mdDialog.alert()
////				.parent(angular.element(document.querySelector('#popupContainer')))
//				.clickOutsideToClose(true).title('Email invoice to client')
//				.textContent('Some invoice has sent already. Please check and send manually')
//				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
//		}
//		else if (n > 0){
			// Appending dialog to document.body to cover sidenav in
			// docs app
			var confirm = $mdDialog.confirm()
				.title('Send trade report to HKEx')
				.textContent('number of trades to report : ' + length)
				.ariaLabel('Lucky day').targetEvent(ev).ok('OK')
				.cancel('Cancel');
			
			$mdDialog.show(confirm).then(function() {
				var list = $scope.gridOptions.data;
				var n = list.length;
				var trList = {tradeReports: []};
				
				for ( var i = 0; i < n; i++) {
					trList.tradeReports.push(list[i]);
				}
					
				$http.post('api/sendTradeReport', {
					'trList' : trList
				}).then(function(result) {
//		promoise.resolve();
					alert('succ');
				}).then(function(result) {
//		promoise.reject();
					alert('fail');
				});
				// clear all ?
//				$scope.gridApi.selection.clearSelectedRows();
					
			}, function() {
//				$scope.status = 'You decided to keep your debt.';
			});
//		}
//		else { 
//			$mdDialog.show($mdDialog.alert()
////				.parent(angular.element(document.querySelector('#popupContainer')))
//				.clickOutsideToClose(true).title('Email invoice to client')
//				.textContent('No client selected. Please select at least one')
//				.ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
//		}
	};
	
//	for (i = 0; i < data.length; i++) {
//		if (data[i] !== "T1") {
//			$scope.gridOptions.data[i].subGridOptions = {
//					columnDefs : [ {
//						name : "Side",
//						field : "side",
//						type : 'string',
////						editableCellTemplate : 'uiSelect',
////						editDropdownOptionsArray : [ 'Buy', 'Sell' ]
//					}, {
//						name : "Company",
//						field : "company",
////						editableCellTemplate: 'ui-grid/dropdownEditor',
////						cellFilter: "griddropdown:this", editDropdownIdLabel:'id',
////					      editDropdownValueLabel: 'gender', editDropdownOptionsArray: [
////					      { id: 1, gender: 'HKCEL' },
////					      { id: 2, gender: '2' }
////					    ]
////						editableCellTemplate : 'uiSelect',
////						editDropdownOptionsArray : [ 'HKCEL' ]
//					}, ],
//					// data: [{"side" : "Buy", "company" : "HKCEL"}],
//					data : data[i].legs,
//					onRegisterApi : subGridApiRegister
//				};
//		}
//	}

//	function subGridApiRegister(gridApi) {
//		// register the child API in the parent - can't tell why it's not in the
//		// core...
//		var parentRow = gridApi.grid.appScope.row;
//		parentRow.subGridApi = gridApi;
//
//		// TODO::run over the subGrid's rows and match them to the
//		// parentRow.isSelected property by name to toggle the row's selection
//		$timeout(function() {
//			if (angular.isUndefined(parentRow.isSelected))
//				return;
//			angular.forEach(gridApi.grid.rows, function(row) {
//				// if tagged as selected, select it
//				if (parentRow.isSelected[row.entity.name]) {
//					gridApi.selection.toggleRowSelection(row.entity);
//				}
//			});
//
//		});
//		// subGrid selection method
//		gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope,
//				function(row) {
//					if (angular.isUndefined(parentRow.isSelected)) {
//						parentRow.isSelected = {};
//					}
//
//					parentRow.isSelected[row.entity.name] = row.isSelected;
//
//					// now would probably be a good time to unselect the parent row, because
//					// not all of its children are selected...
//
//				});
//	}

}

//app.filter('griddropdown', function() {
//    return function (input, context) {
//        
//        var map = context.col.colDef.editDropdownOptionsArray;
//        var idField = context.col.colDef.editDropdownIdLabel;
//        var valueField = context.col.colDef.editDropdownValueLabel;
//        var initial = context.row.entity[context.col.field];
//        if (typeof map !== "undefined") {
//            for (var i = 0; i < map.length; i++) {
//                if (map[i][idField] == input) {
//                    return map[i][valueField];
//                }
//            }
//        } else if (initial) {
//            return initial;
//        }
//        return input;
//    };
//});


