angular.module(
		'app',
		[ 'ngTouch', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection',
				'ui.grid.edit', 'ui.select' ]).controller('MainCtrl', MainCtrl)
		.directive('uiSelectWrap', uiSelectWrap);

MainCtrl.$inject = [ '$scope', '$http', '$log', '$timeout' ];
function MainCtrl($scope, $http, $log, $timeout) {
	var month = moment(new Date()).format('MMM');
	var year = moment(new Date()).format('YYYY');

	$scope.gridOptions = {
		expandableRowTemplate : '<div ui-grid="row.entity.subGridOptions" style="height:150px;" ui-grid-selection></div>',
		rowHeight : 38,
		columnDefs : [
				{
					field : 'instr',
					name : 'Instrument',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'HSI', 'HSCEI' ]
				},
				{
					field : 'strike',
					name : 'Strike',
					type : 'number'
				},
				{
					field : 'month',
					name : 'Month',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'Jan', 'Feb', 'Mar', 'Apr',
							'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov',
							'Dec' ]
				}, {
					field : 'year',
					name : 'Year',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ '2016', '2017' ]
				}, {
					field : 'price',
					name : 'Price',
					type : 'number'
				}, {
					field : 'qty',
					name : 'Qty',
					type : 'number'
				}, {
					field : 'cond',
					name : 'Cond',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'T1', 'T2', 'T4' ]
				}, {
					field : 'side',
					name : 'Side',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'Cross', 'Buy', 'Sell' ]
				} ],
		onRegisterApi : function(gridApi) {

			gridApi.selection.on.rowSelectionChanged($scope, function(row) {
				var selectedState = row.isSelected;
				// if row is expanded, toggle its children as selected
				if (row.isExpanded) {
					// choose the right callback according to row status
					var selectCallBack = selectedState ? "selectAllRows"
							: "clearSelectedRows";
					// do the selection/unselection of children
					row.subGridApi.selection[selectCallBack]();
					// $log.log(row);
				}
				// mark children as selected if needed
				angular.forEach(row.entity.subGridOptions.data,
					function(value) {
						// create the "isSelected" property if not exists
						if (angular.isUndefined(row.isSelected)) {
							row.isSelected = {};
						}

						// keep the selected rows values in the parent row - idealy would be
						// a unique ID coming from the server
						row.isSelected[value.name] = selectedState;
					});
			});
		}
	};

	// $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/v3.0.7/data/500_complex.json')
	// .success(function(data) {
	// $scope.gridOptions.data = data;
	// });

	var data = [ {
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
	


	for (i = 0; i < data.length; i++) {
		$scope.gridOptions.data[i].subGridOptions = {
				columnDefs : [ {
					name : "Side",
					field : "side",
					type : 'string'
				}, {
					name : "Company",
					field : "company",
					type : 'string',
					editableCellTemplate : 'uiSelect',
					editDropdownOptionsArray : [ 'HKCEL' ]
				}, ],
				// data: [{"side" : "Buy", "company" : "HKCEL"}],
				data : data[i].legs,
				onRegisterApi : subGridApiRegister
			};
	}

	function subGridApiRegister(gridApi) {
		// register the child API in the parent - can't tell why it's not in the
		// core...
		var parentRow = gridApi.grid.appScope.row;
		parentRow.subGridApi = gridApi;

		// TODO::run over the subGrid's rows and match them to the
		// parentRow.isSelected property by name to toggle the row's selection
		$timeout(function() {
			if (angular.isUndefined(parentRow.isSelected))
				return;
			angular.forEach(gridApi.grid.rows, function(row) {
				// if tagged as selected, select it
				if (parentRow.isSelected[row.entity.name]) {
					gridApi.selection.toggleRowSelection(row.entity);
				}
			});

		});
		// subGrid selection method
		gridApi.selection.on.rowSelectionChanged(gridApi.grid.appScope,
				function(row) {
					if (angular.isUndefined(parentRow.isSelected)) {
						parentRow.isSelected = {};
					}

					parentRow.isSelected[row.entity.name] = row.isSelected;

					// now would probably be a good time to unselect the parent row, because
					// not all of its children are selected...

				});
	}

}

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
