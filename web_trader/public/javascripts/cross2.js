/**
 * You must include the dependency on 'ngMaterial'
 */
angular
.module('moment-module', [/*'ngTouch', 'ui.grid'
	, 'ui.grid.edit', 
	'ui.grid.rowEdit', 'ui.grid.cellNav',
	'ui.grid.resizeColumns'*/
	])
.factory('moment', function ($window) {
    return $window.moment;
})


var app = angular.module('app', [ 
	'ngMaterial', 
	'ngMessages', 
	'ngTouch', 
	'ui.grid', 
	'ui.grid.edit', 
	'ui.grid.rowEdit', 
	'ui.grid.cellNav',
	'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'ngAnimate' ,
	]);

function DialogController($scope, $mdDialog, locals, uiGridConstants) 
{
	$scope.myExternalScope = $scope;
	
	$scope.myDelta = locals.myDelta;
	$scope.mySymbol = locals.mySymbol;
	$scope.myTrType = locals.myTrType;
	$scope.mySide = locals.mySide;
//	$scope.mySymbol = locals.mySymbol;
	$scope.myCpCompany = locals.myCpCompany;
	$scope.myUl  = locals.myInstr;
	$scope.myExpiry = locals.myExpiry;
	$scope.myStrike = locals.myStrike;
	$scope.myMultiplier = locals.myMultiplier;
	$scope.myStrat = locals.myStrat;
	$scope.myPremium = locals.myPremium;
	$scope.myRef = locals.myRef;
	
	$scope.myQty = '';
	$scope.myDelta = '';

	$scope.myFutMat = '';
	$scope.futMatTypes = [{ID: 1, type: 'DEC16' },
		{ID: 2, type: 'MAR17' },
		{ID: 3, type: 'JUN17' },
	];
	  
	$scope.myData = [];
	$scope.myParam = [
		{'UL': $scope.myUl, 'Strategy': $scope.myStrat, 'Expiry': $scope.myExpiry,
		'Strike': $scope.myStrike, 'Multiplier': $scope.myMultiplier, 'Qty': $scope.myQty, 
		'Premium': $scope.myPremium, 'Delta': $scope.myDelta, 'FutMat': '', 
		'Ref': $scope.myRef},
	];
	
	$scope.hide = function() {
		$mdDialog.hide();
	};
	
	$scope.cancel = function() {
		$mdDialog.cancel();
	};
	
	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};
	
	createLegs('', '', '');
	
	$scope.paramGridOptions = {
			enableHorizontalScrollbar: false, 
			enableVerticalScrollbar: false,
//			rowEditWaitInterval : -1,
			enableSorting : false,
			enableColumnResizing : true,
			enableFiltering : false,
			showGridFooter : false,
			showColumnFooter : false,
		    enableCellEditOnFocus: true,
			columnDefs : [ 
				{field : 'UL', headerCellClass: 'blue-header', width : '60', enableCellEdit : false}, 
				{field : 'Strategy', headerCellClass: 'blue-header',displayName:'Strat',width : '60',enableCellEdit : false}, 
				{field : 'Expiry', headerCellClass: 'blue-header',width : '80',enableCellEdit : false}, 
				{field : 'Strike', headerCellClass: 'blue-header',width : '150',enableCellEdit : false}, 
				{field : 'Multiplier', headerCellClass: 'blue-header',width : '100',enableCellEdit : false}, 
				{field : 'Qty', headerCellClass: 'blue-header',width : '60',enableCellEdit : true,
//					editableCellTemplate: '<div><input type="number" class="form-control" ng-input="row.entity.Qty" ng-model="row.entity.Qty" /></div>',
//			        cellTemplate: 'prompt.html',
			        cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="row.entity.Qty === \'\'">error_outline</i><input class="form-control" ng-input="row.entity.Qty" ng-model="row.entity.Qty" /></div>',
				}, 
				{field : 'Premium', headerCellClass: 'blue-header', displayName: 'Price', width : '60',enableCellEdit : false}, 
				{field : 'Delta', headerCellClass: 'blue-header',width : '60',enableCellEdit : true,
//					enableCellEditOnFocus: true,
//			          editableCellTemplate: $scope.cellInputEditableTemplate,
			          cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="row.entity.Delta === \'\'">error_outline</i><input class="form-control" ng-input="row.entity.Delta" ng-model="row.entity.Delta" /></div>',
				}, 
			      { 
					field: 'FutMat',
					headerCellClass: 'blue-header',
			        name: 'FutMat', 
			        displayName: 'Fut Mat', 
			        editableCellTemplate: 'ui-grid/dropdownEditor', 
			        width: '80',
//			        cellFilter: 'mapGender', 
			        cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="grid.appScope.myFutMat === \'\'">error_outline</i>{{grid.appScope.myFutMat}}</div>',
			        editDropdownValueLabel: 'type',
			        editDropdownOptionsArray: [
			        { id: 'DEC16', type: 'DEC16' },
			        { id: 'MAR17', type: 'MAR17' },
			        { id: 'JUN17', type: 'JUN17' }
			        ] 
			      },
				{field : 'Ref', width : '80',enableCellEdit: false, visible: false}
			 ],
			exporterMenuPdf : false,
	};
	
	$scope.paramGridOptions.data = $scope.myParam;
	
	$scope.paramGridOptions.onRegisterApi = function(gridApi) {
		$scope.paramGridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditParamGrid);
	}
	
	$scope.afterCellEditParamGrid = function(rowEntity, colDef, newValue, oldValue) {
		if (rowEntity.Qty !== '') {
			var tokens = rowEntity.Multiplier.split('X');
			var params = [];
			for (i=0; i<tokens.length; i++) {
				$scope.myData[i].Qty = rowEntity.Qty * Number(tokens[i]);
				params.push({side : $scope.myData[i].Side, option: $scope.myData[i].UL.split(' ')[1], qty: $scope.myData[i].Qty});
			}
//			// update future sell leg
			var side = hedgeSide(params);
			$scope.myData[$scope.myData.length - 1].Side = side;

			$scope.myQty = Number(rowEntity.Qty);
			
			if (rowEntity.Delta !== '') {
				var len = $scope.myData.length;
				$scope.myData[len - 1].Qty = Number(rowEntity.Qty) * Number(rowEntity.Delta) * 0.01;	
				$scope.myDelta = Number(rowEntity.Delta);
			}
		}
		if (rowEntity.FutMat !== '') {
			$scope.myFutMat = rowEntity.FutMat;
			$scope.myData[$scope.myData.length - 1].Expiry = rowEntity.FutMat;
			$scope.myData[$scope.myData.length - 1].Instrument = exchangeSymbol($scope.myInstr, 'F', 0, rowEntity.FutMat);
		}
//	    $scope.paramGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
		 $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
		 if (!$scope.$$phase) {
			 $scope.$apply();
		 }
	}
	
	$scope.gridOptions = {
		data : 'myData',
//		rowEditWaitInterval : -1,
		enableSorting : false,
		enableColumnResizing : true,
		enableFiltering : false,
		showGridFooter : false,
		showColumnFooter : false,
//	    enableCellEditOnFocus: true,
		columnDefs : [ 
			{field : 'Instrument', 
				headerCellClass: 'brown-header', 
				width : '120', enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val)
						return '';
					return 'missing';
				}
			}, 
			{field : 'UL', headerCellClass: 'brown-header', displayName : 'UL', width : '100', enableCellEdit : false	}, 
			{field : 'Qty', headerCellClass: 'brown-header', displayName : 'Qty', width : '60', enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (!isNaN(val) && val > 0)
						 return '';
					return 'missing';
				}
			}, 
			{field : 'Side', headerCellClass: 'brown-header', displayName : 'Side',width : '60',enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val)
						return '';
					return 'missing';
				}
			}, 
			{field : 'Strike', headerCellClass: 'brown-header',  displayName : 'Strike',width : '80',enableCellEdit : false,}, 
			{field : 'Expiry',headerCellClass: 'brown-header', displayName : 'Expiry', width : '80', enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val)
						return '';
					return 'missing';
				}
			}, 
			{field : 'Price', headerCellClass: 'brown-header', displayName : 'Price', width : '*', enableCellEdit : true, cellFilter : 'number: 2',
				cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="!row.entity.isValidate && row.entity.noPrice">error_outline</i>'
					+ '<input ng-if="row.entity.isValidate" style="background-color: red; color: white;" ng-input="row.entity.Price" ng-model="row.entity.Price" />'
					+ '<input ng-if="!row.entity.isValidate" ng-input="row.entity.Price" ng-model="row.entity.Price" />'
					+ '</div>',
			},
            {field : 'noPrice', headerCellClass: 'brown-header', displayName : 'noPrice', enableCellEdit : false, visible : false},
            {field : 'isValidate', headerCellClass: 'brown-header', displayName : 'isValidate', enableCellEdit : false, visible : false},
            {field : 'Multiplier', headerCellClass: 'brown-header', displayName : 'Multiplier',width : '*', enableCellEdit : false, visible : false},
		],
//		rowTemplate: '<div><div style="height: 100%; {\'background-color\': \'\'}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>',
//		exporterMenuPdf : false,
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEdit);
	}

	$scope.afterCellEdit = function(rowEntity, coldef, newValue, oldValue) {
		var nMissLeg = 0;
		params = [];
		var multi = 0;
		var premium = $scope.myPremium;
		var side = 0;
		rowEntity.noPrice = false;
		
		for (i = 0; i < $scope.myData.length; i++) 
		{
			if ($scope.myData[i].noPrice) {
//			if (isNaN($scope.myData[i].Price)) {
				nMissLeg++;
			}
		}
		if (nMissLeg > 1)
			return;
		
		for (i = 0; i < $scope.myData.length - 2; i++) 
		{
			if (!$scope.myData[i].noPrice) {
				params.push({
					'side' : $scope.myData[i].Side,
					'multiplier' : $scope.myData[i].Multiplier,
					'price' : $scope.myData[i].Price,
					'option' : $scope.myData[i].UL.split(' ')[1],
					'qty' : $scope.myData[i].Qty
				});
			} 
		}
		var iCal = $scope.myData.length - 2;
		side = $scope.myData[iCal].Side;
		multi = $scope.myData[iCal].Multiplier;
		var price = calRemainPrice(params, multi, side, premium);
		// calRemainPrice(params, myMultiplier, myPrice, mySide);
		$scope.myData[iCal].Price = price;
		$scope.myData[iCal].noPrice = false;
		
		if (isNaN(price) || price < 0 || (price % 1 != 0)) {	// has decimal
			$scope.myData[iCal].isValidate = true;
		}
		else {
			$scope.myData[iCal].isValidate = false;
		}
		 $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
		 if (!$scope.$$phase) {
			 $scope.$apply();
		 }
	};

//  	$scope.createLegs = function(ev, qty, delta, myFutExp) {
	function createLegs(qty, delta, futExp) {
		var myQty = qty;
		var tokens = parseSymbol($scope.mySymbol);
		// ["HSCEI", "JUN17", "9000/7000", "1X1.5", "PS", "191", "9850", "28"]
		$scope.myData = [];
		var data = []; // clear legs
		type = tokens[4];
		var qty = [];
		var ul = [];

		var expiry = $scope.myExpiry;
		var strike = $scope.myStrike;
		var multiplier = $scope.myMultiplier;
		$scope.myPremium = Number($scope.myPremium);
		var ref = Number($scope.myRef);
		var mySide = $scope.mySide;
//		getSides(multiplier, $scope.mySide)
		var instr = tokens[0];
		$scope.myInstr = instr;
		var expiry = tokens[1];
		var thisSide = mySide;
		var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
		var strikes = tokens[2].split('/');
		
		switch (type) {
		case 'C': { // 'EC - European Call':
			$scope.myParam[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strike,
				'qty' : myQty,
				'side' : mySide,
				'multiplier' : multiplier,
				'instrument' : instrument,
				'premium' : premium,
				'ref' : ref,
				'delta' : myDelta,
				'future' : myFutExp
			};

			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strike,
				'qty' : myQty,
				'side' : mySide,
				'multiplier' : multiplier,
				'instrument' : instrument,
				'premium' : premium,
				'ref' : ref,
				'delta' : myDelta,
				'future' : myFutExp
			};
			break;
		}
		case 'CFLY':  // butterfly
		case 'CB':  // 'ECB - European Call Butterfly':
		case 'CTB': { // 'ECTB - European Call Time Butterfly':
			var multi = getMultiple(multiplier, 3, '1X2X1');
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'C', strikes[2], $scope.myExpiry);
			$scope.myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;			
		}
		case 'PFLY':  // butterfly
		case 'PB':  // 'ECB - European Call Butterfly':
		case 'PTB': { // 'ECTB - European Call Time Butterfly':
			var multi = getMultiple(multiplier, 3, '1X2X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], $scope.myExpiry);
			$scope.myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;			
		}
		case 'CDOR':  // 'ECC - European Call Condor':
		case 'CC':  // 'ECC - European Call Condor':
		case 'CTC': { // 'ECC - European Call Time Condor':
			var multi = getMultiple(multiplier, 4, '1X1X1X1');
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'C', strikes[2], $scope.myExpiry);
			ul[3] = exchangeSymbol(instr, 'C', strikes[3], $scope.myExpiry);
			$scope.myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : expiry, 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'PC': 
		case 'PDOR': //'EPC - European Put Condor':
		case 'PTC': {//'EPC - European Put Time Condor':
			var multi = getMultiple(multiplier, 4, '1X1X1X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], $scope.myExpiry);
			ul[3] = exchangeSymbol(instr, 'P', strikes[3], $scope.myExpiry);
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : expiry, 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'CS':  // 'ECDIAG - European Call Diagonal':
		case 'CDIAG':  // 'ECDIAG - European Call Diagonal':
		case 'CR':  // 'ECR - European Call Ratio':
		case 'CTR':  // 'ECTR - European Call Time Ratio':
		case 'CTS': { // 'ECTS - European Call Time Spread':
			var multi = getMultiple(multiplier, 2, '1X1');
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], $scope.myExpiry);
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'PS':  // 'EPS - European Put Spread':
		case 'PDIAG':  // 'EPS - European Put Spread':
		case 'PR':  // 'ECR - European Put Ratio':
		case 'PTR':  // 'ECTR - European Put Time Ratio':
		case 'PTS': { // 'ECTS - European Put Time Spread':
			var multi = getMultiple(multiplier, 2, '1X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], $scope.myExpiry);
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'CLDR':  // 'ECL - European Call Ladder':
		case 'CL': { // 'ECL - European Call Ladder':
			var multi = getMultiple(multiplier, 3, '1X1X1');
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'C', strikes[2], $scope.myExpiry);
			$scope.myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'PLDR': //'EPL - European Put Ladder':
		case 'PL': { //'EPL - European Put Ladder':
			var multi = getMultiple(multiplier, 3, '1X1X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], $scope.myExpiry);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], $scope.myExpiry);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], $scope.myExpiry);
			$scope.myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : thisSide, 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false
			};
			$scope.myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : expiry, 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : oppSide, 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true
			};
			$scope.myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false
			};
			break;
		}
		case 'ECTB - European Call Time Butterfly':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 3, '1X2X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry[0], 'strike' : strikes, 'qty' : Number(myQty) * Number(multi[0]), 'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry[1], 'strike' : strikes, 'qty' : Number(myQty) * Number(multi[1]), 'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry[2], 'strike' : strikes, 'qty' : Number(myQty) * Number(multi[2]), 'side' : thisSide
			};
			break;
		case 'ECTC - European Call Time Condor':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 4, '1X1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[2],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[3],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[3]),
				'side' : thisSide
			};
			break;
		case 'ECTL - European Call Time Ladder':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 3, '1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[2],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			break;
		case 'ECTR - European Call Time Ratio':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;
		case 'ECTS - European Call Time Spread':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;
		case 'EIF - European Iron Fly':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 3, '1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			break;
		case 'EIFR - European Iron Fly Ratio':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 3, '1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			break;

		// put strategy
		case 'EP - European Put':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strike = tokens[2];
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strike,
				'qty' : myQty,
				'side' : mySide
			};
			break;
		case 'EPB - European Put Butterfly':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 3, '1X2X1');
			var legs = [];
			if (tokens.length < 5) {
				var thisSide = mySide;
				var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			} else {
				var oppSide = mySide;
				var thisSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			}
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : thisSide
			};
			break;
		case 'EPDIAG - European Put Diagonal':
			var instr = tokens[0];
			var expiries = tokens[1].split('/');
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1');
			if (tokens.length > 4) {
				var thisSide = mySide;
				var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			} else {
				var oppSide = mySide;
				var thisSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			}
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiries[0],
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiries[1],
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			break;
		case 'EPR - European Put Ratio':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			break;
		case 'EPTB - European Put Time Butterfly':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 3, '1X2X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[2],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : thisSide
			};
			break;
		case 'EPTC - European Put Time Condor':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 4, '1X1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[2],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[3],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[3]),
				'side' : thisSide
			};
			break;
		case 'EPTL - European Put Time Ladder':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var multi = getMultiple(tokens[3], 3, '1X1X1');
			var strikes = tokens[2];
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[2],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			break;
		case 'EPTR - European Put Time Ratio':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var multi = tokens[3].split('X');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;
		case 'EPTS - European Put Time Spread':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;
		case 'ERR - European Risk Reversal':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			if (tokens.length > 4) {
				var oppSide = mySide;
				var thisSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			} else {
				var thisSide = mySide;
				var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			}
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			break;
		case 'ES - European Synthetic Call Over':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			break;
		case 'ESPO - European Synthetic Put Over':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			break;
		case 'ESD - European Straddle':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;
		case 'ESDTS - European Straddle Time Spread':
			var instr = tokens[0];
			var expiry = tokens[1].split('/');
			var strikes = tokens[2];
			var multi = getMultiple(tokens[3], 4, '1X1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : oppSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry[0],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : thisSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry[1],
				'strike' : strikes,
				'qty' : Number(myQty) * Number(multi[3]),
				'side' : thisSide
			};
			break;
		case 'ESG - European Strangle':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(myQty) * Number(multi[0]),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(myQty) * Number(multi[1]),
				'side' : thisSide
			};
			break;

		//		'ESGAC - European Strangle VS Call',
		//		'ESGAP - European Strangle VS Put',
		//		'ESGTS - European Strangle Time Spread',
		//		'ETRR - European Time Risk Reversal',
		//		'ECSAC - European Call Spread VS Call',
		//		'ECSAP - European Call Spread Against Put',
		//		'ECSAPR - European Call Spread VS Put (Ratio',
		//		'ECSAPPO - European Call Spread VS Put - Put Over',
		//		'ECSPS - European Call Spread VS Put Spread',
		//		'ECSTR - European Call Spread Time Ratio',
		//		'ECSTS - European Call Spread Time Spread',
		//		'ECTSAP - European Call Time Spread Against Put',
		//		'EPSAC - European Put Spread Against Call',
		//		'EPSACR - European Put Spread VS Call (Ratio',
		//		'EPSACCO - European Put Spread VS Call - Call Over',
		//		'EPSAP - European Put Spread VS Put',
		//		'EPSTUP - European Put Stupid',
		//		'EPTSAC - European Put Time Spread Against Call',
		//		'ESDAC - European Straddle VS Call',
		//		'ESDAP - European Straddle VS Put',
		//		'FWDB - Forward Butterfly',
		case 'SPRD - Spread':
			alert('SPRD - Spread');
			break;
		default:
			alert('no matching');
			break;
		}
	};
};

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', 
//	'uiGridConstants', 
	function($scope, $http
			, $mdDialog 
//		,uiGridConstants
		) {
	var date = new Date();
	$scope.myStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
	$scope.myEndDate = date;
	$scope.myEndDate.setHours(23);
	$scope.myEndDate.setMinutes(59);
	$scope.myEndDate.setSeconds(59, 999);
	
	$scope.status = '  ';
	$scope.customFullscreen = false;

	$scope.myTotal;

//    $scope.clients = {};
    $scope.sides = ['Buy', 'Sell'];
//    $scope.mySide = "Buy";

    $scope.myQty = '100';
//    $scope.mySymbol = 'HSCEI JUN17 9000/7000 1x1.5 PS 191 TRADES REF 9850 DELTA 28';
    $scope.mySymbol = 'HSI DEC17 22000/24000 1x1.25 CR 10 TRADES REF 22,825';
//    $scope.mySymbol = 'HSCEI DEC17 22000/24000/26000 1x1.25X1 CL 10 TRADES REF 22,825';
//    $scope.mySymbol = 'HSCEI JUN17 9000/7000 1x1.5 CS 191 TRADES REF 9850';
//    $scope.mySymbol = 'HSCEI JUN17 8000/9000/10000/11000 1x1.5X1.5X1 CDOR 191 TRADES REF 9850';
//    $scope.mySymbol = 'HSCEI JUN17 8000/9000/10000/11000 1x1.5X1.5X1 PDOR 191 TRADES REF 9850';
    
    
//    $scope.mySymbol = 'HSCEI MAR17/DEC17 12000/12600 CS (MAR17) 191 TRADES REF 9850';		// CDIAG (not implement)
//    $scope.mySymbol = 'HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850';		// CDIAG
//    $scope.mySymbol = 'HSI SEP17 12000/13000 1x2 CS 191 TRADES REF 9850';	// CR
//    $scope.mySymbol = 'HSI DEC17 12000/13800 CS 191 TRADES REF 9850';	// CS
//    $scope.mySymbol = 'HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850';	// CTR
//    $scope.mySymbol = 'HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850';	// CTS
//    $scope.mySymbol = 'HSCEI MAR17 9000/10000/11000 CFLY (10000) 191 TRADES REF 9850';	// CFLY (incomplete)
//    $scope.mySymbol = 'HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850';	// CFLY
//    $scope.mySymbol = 'HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850';	// CFLY
    
    
//    $scope.instruments = [
////    	'HKD', 'KRW,JPY,USD',
////    	];
//	'EC - European Call',
//	'ECB - European Call Butterfly',
//	'ECC - European Call Condor',
//	'ECDIAG - European Call Diagonal',
//	'ECL - European Call Ladder',
//	'ECR - European Call Ratio',
//	'ECS - European Call Spread',
//	'ECTB - European Call Time Butterfly',
//	'ECTC - European Call Time Condor',
//	'ECTL - European Call Time Ladder',
//	'ECTR - European Call Time Ratio',
//	'ECTS - European Call Time Spread',
//	'EIF - European Iron Fly',
//	'EIFR - European Iron Fly Ratio',
//	'EP - European Put',
//	'EPB - European Put Butterfly',
//	'EPC - European Put Condor',
//	'EPDIAG - European Put Diagonal',
//	'EPL - European Put Ladder',
//	'EPR - European Put Ratio',
//	'EPS - European Put Spread',
//	'EPTB - European Put Time Butterfly',
//	'EPTC - European Put Time Condor',
//	'EPTL - European Put Time Ladder',
//	'EPTR - European Put Time Ratio',
//	'EPTS - European Put Time Spread',
//	'ERR - European Risk Reversal',
//	'ES - European Synthetic Call Over',
//	'ESPO - European Synthetic Put Over',
//	'ESD - European Straddle',
//	'ESDTS - European Straddle Time Spread',
//	'ESG - European Strangle',
//	'ESGAC - European Strangle VS Call',
//	'ESGAP - European Strangle VS Put',
//	'ESGTS - European Strangle Time Spread',
//	'ETRR - European Time Risk Reversal',
//	'ECSAC - European Call Spread VS Call',
//	'ECSAP - European Call Spread Against Put',
//	'ECSAPR - European Call Spread VS Put (Ratio',
//	'ECSAPPO - European Call Spread VS Put - Put Over',
//	'ECSPS - European Call Spread VS Put Spread',
//	'ECSTR - European Call Spread Time Ratio',
//	'ECSTS - European Call Spread Time Spread',
//	'ECTSAP - European Call Time Spread Against Put',
//	'EPSAC - European Put Spread Against Call',
//	'EPSACR - European Put Spread VS Call (Ratio',
//	'EPSACCO - European Put Spread VS Call - Call Over',
//	'EPSAP - European Put Spread VS Put',
//	'EPSTUP - European Put Stupid',
//	'EPTSAC - European Put Time Spread Against Call',
//	'ESDAC - European Straddle VS Call',
//	'ESDAP - European Straddle VS Put',
//	'FWDB - Forward Butterfly',
//	'SPRD - Spread',
//	];
    $scope.myType = 'EC - European Call';
    
    $scope.trTypes = [
    	'T1 - Internal Trade Report',
    	'T2 - Combo Trade Report',
    	'T4 - Interbank Trade Report',
    	];
    $scope.fut_exp = [
    	'DEC16',
    	'MAR17',
    	'JUN17',
    	];
    $scope.myTrType = 'T1 - Internal Trade Report';
    
    $scope.myPrice = '439';
//    $scope.myRefPrice = "";
    $scope.myDelta = '28';
    $scope.myCpCompany = 'HKCEL';
    
    $scope.mySummary = {};
	
    $scope.utsSummary = {};
    $scope.myPremium = 0;
    
//	$scope.status = '  ';
//	$scope.customFullscreen = false;

    $scope.myFutExp = "DEC16";
    
    $scope.myData1 = [
        {
               "Instrument": "C",
               "UL": "HSI",
               "Price": "439",
               "Qty": "100",
               "Side": "Buy",
               "Strike": "10000",
               "Expiry": "DEC17",
       }];
    $scope.myData = [];
    
	$scope.showCrossDetail = function(ev, myTrType, mySide, mySymbol, myCpCompany) 
	{
		var tokens = parseSymbol($scope.mySymbol);
		var instr = tokens[0];
		var expiry = tokens[1];
		var strike = tokens[2];
		var multiplier = tokens[3];
		var strat = tokens[4];
		var premium = Number(tokens[5]);
		var ref = Number(tokens[6].replace(',', ''));
		
		if (!mySide)
			mySide = 'Buy';
		
		$mdDialog.show({
			controller : DialogController,
			templateUrl : 'dialog_auto.tmpl.html',
			parent : angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: true,
			fullscreen : false,
			locals: {
				'myTrType': myTrType,
				'mySide': mySide,
				'mySymbol': mySymbol,
				'myCpCompany': myCpCompany,
				'myInstr': instr,
				'myExpiry': expiry,
				'myStrike': strike,
				'myMultiplier': multiplier,
				'myStrat': strat,
				'myPremium': premium,
				'myRef': ref,
			}
			
		// Only for -xs, -sm breakpoints.
		})
		.then(function(answer) {	// either OK / Cancel -> succ
			if (answer === 'Cancel') {
				$scope.status = 'cancelled';	
			}
			else {
				$scope.status = 'Invoice sent to ' + answer;
			}
//			$http.post('api/emailInvoice', {
//				client : answer,
//				start : $scope.myStartDate.getTime(),
//				end : $scope.myEndDate.getTime()
//			}).then(function(result) {
////			$http.post('api/emailInvoice', answer).then(function(result) {
//				console.log(result);
//				//    	vm.myData = result.data.data;
////				$scope.myData = result.data.data;
//			});
		}, function() { // fail , press outside or close dialog box
//			$scope.status = 'You cancelled the dialog.';
		});
	};
	


	
}]);

// .controller('AppCtrl', function($scope) {
// var date = new Date();
// $scope.myStartDate = new Date(date.getFullYear(), date
// .getMonth(), 1);
// $scope.myEndDate = new Date();
//
// });

function AutoCompleteCtrl($timeout, $q, $log) {
	var self = this;

//	AppCtrl.apply(self, arguments);
//	self.parentStartDate = $scope.pc.myStartDate;
//	self.parentEndDate = $scope.pc.myEndDate;
	
	self.simulateQuery = false;
	self.isDisabled = false;

	// list of `state` value/display objects
	self.states = loadAll();
	self.querySearch = querySearch;
	self.selectedItemChange = selectedItemChange;
	self.searchTextChange = searchTextChange;

	self.newState = newState;

	function newState(state) {
		alert("Sorry! You'll need to create a Constitution for " + state
				+ " first!");
	}

	// ******************************
	// Internal methods
	// ******************************

	/**
	 * Search for states... use $timeout to simulate remote dataservice call.
	 */
	function querySearch(query) {
		var results = query ? self.states.filter(createFilterFor(query))
				: self.states, deferred;
		if (self.simulateQuery) {
			deferred = $q.defer();
			$timeout(function() {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		} else {
			return results;
		}
	}

	function searchTextChange(text) {
		$log.info('Text changed to ' + text);
	}

	function selectedItemChange(item) {
		$log.info('Item changed to ' + JSON.stringify(item));
	}

	/**
	 * Build `states` list of key/value pairs
	 */
	function loadAll() {
		var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

		return allStates.split(/, +/g).map(function(state) {
			return {
				value : state.toLowerCase(),
				display : state
			};
		});
	}

	/**
	 * Create filter function for a query string
	 */
	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);

		return function filterFn(state) {
			return (state.value.indexOf(lowercaseQuery) === 0);
		};

	}
};

function calRemainPrice(params, myMultiplier, mySide, myPremium) {
	sum = 0;
	for (i=0; i<params.length; i++) 
	{
		var sign = params[i].side === 'Sell' ? -1 : 1; 
		sum += Number(params[i].price) * sign * Number(params[i].multiplier);
	}
	var mySign = mySide === 'Sell' ? -1 : 1;
	return (myPremium - sum) / (myMultiplier * mySign);
}

function hedgeSide(params) {
	sum = 0;
	for (i=0; i<params.length; i++) 
	{
		var qty = Number(params[i].qty);
		if ((params[i].side === 'Buy' && params[i].option === 'Put') ||
			(params[i].side === 'Sell' && params[i].option === 'Call'))
			sum += -1 * qty;
		else 
			sum += qty;
	}
	if (sum > 0) {
		return 'Sell';
	}
	return 'Buy';
}

function getMonthFromString(mmmyy){

	   var d = Date.parse(mmmyy.substring(0,3) + "1, " + mmmyy.substring(3,5));
	   if(!isNaN(d)){
	      return new Date(d).getMonth();
	   }
	   return -1;
	 }

function exchangeSymbol(ul, deriv, strike, futExp) {
	var m = derivLetter(deriv, futExp);
	var y = futExp.substring(4,5);
	var symbol = '';
	if (ul === 'HSCEI') {
		symbol += 'HHI';
	}
	else if (ul === 'HSI') {
		symbol += 'HSI';
	}
	if (strike)
		symbol += strike;
	symbol += m + y;
	return symbol;
};

function derivLetter(deriv, futExp) {
//	var d = new Date(futExp);
//	var m = d.getMonth();
	var m = getMonthFromString(futExp);
	switch (deriv) {
	case 'C': {
		var chr = String.fromCharCode(65 + m); 	'A'
		return chr;
	}
	case 'P': {
		var chr = String.fromCharCode(77 + m); 	'M'
		return chr;
	}
	case 'F': {	// future
		switch (m) {
		case 0: return 'F';
		case 1: return 'G';
		case 2: return 'H';
		case 3: return 'J';
		case 4: return 'K';
		case 5: return 'M';
		case 6: return 'N';
		case 7: return 'Q';
		case 8: return 'U';
		case 9: return 'V';
		case 10: return 'X';
		case 11: return 'Z';
		}
	}
	}
	return null;
}

function mmyyyy(input) {
	var parts = input.split('-');
	var str = parts[1] + parts[2];
	return Number(str);
};

function parseDate(input) {
	var parts = input.split('-');
	return new Date(parts[2], parts[1] - 1, parts[0]);
};

function parsecompany(input) {
	var res = input.split(" - ");
	return res[0];
}

function generatekey(company, curncy, tradeDate) {
	// company_curncy_MMYY
	var key = company + '_';

	if (company.toUpperCase() === 'BARCLAYS BANK PLC'
			&& moment(tradeDate).format('MMYY') === '0916' && curncy !== 'HKD') {
		key = key + 'JPY';
	} else {
		key = (curncy === 'HKD') ? key + 'HKD' : key + 'USD';
	}
	key = key + '_' + moment(tradeDate).format('MMYY');

	return key = key.toUpperCase();
}

function getDefaultMultiplier(deriv) {
	switch (deriv) {
	case 'C': // European Call
	case 'P': // European Put
		return '1';
	case 'CC': // - European Call Condor':
	case 'CDOR': // - European Call Condor':
	case 'CTC': // - European Call Time Condor':
	case 'PC': // European Put Condor':
	case 'PDOR': // European Put Condor':
	case 'PTC': // - European Put Time Condor':
		return '1X1X1X1';
//		return '1X-1X-1X1';
	case 'CDIAG': // ECDIAG - European Call Diagonal':
		return '1X1';
//		return '1X-1';
	case 'PDIAG': // ECDIAG - European Put Diagonal':
		return '1X1';
//		return '-1X1';
	case 'CL': // - European Call Ladder':
	case 'CLDR': // - European Call Ladder':
	case 'PL': // - European Put Ladder':
	case 'PLDR': // - European Put Ladder':
//		return '1X-1X-1';
		return '1X1X1';
	case 'CTL': // - European Call Time Ladder':
	case 'PTL': // - European Put Time Ladder':
		return '1X1X1';
//		return '-1X-1X1';
	case 'CR': // - European Call Ratio':
//		return '1X-2';
		return '1X2';
	case 'PR': // - European Put Ratio':
		return '2X1';
//		return '-2X1';
	case 'CS':
	case 'CDIAG':
//		return '1X-1';
		return '1X1';
	case 'PS':
	case 'PDIAG':
		return '1X1';
//		return '-1X1';
	case 'CTB': // - European Call Time Butterfly':
	case 'CFLY':  // butterfly
	case 'CB':  // 'ECB - European Call Butterfly':
	case 'PB':  // 'ECB - European Call Butterfly':
	case 'PTB': // - European Call Time Butterfly':
	case 'PFLY':  // butterfly
		return '1X2X1';
//		return '1X-2X1';
	case 'CTR - European Call Time Ratio':
		return '1X2';
//		return '1X-2';
	case 'PTR - European Put Time Ratio':
//		return '-2X1';
		return '2X1';
	case 'CTS': // - European Call Time Spread':
	case 'PTS': // - European Put Time Spread':
		return '1X1';
//		return '-1X1';
	case 'IF': // - European Iron Fly':
	case 'IFR': // - European Iron Fly Ratio':
//		return '-1X1X1X-1';
		return '1X1X1X1';
	case 'RR': // - European Risk Reversal':
		return '1X1';
//		return '1X-1';
	case 'S':// - European Synthetic Call Over':
//		return '-1X1';
		return '1X1';
	case 'SPO':// - European Synthetic Put Over':
//		return '1X-1';
		return '1X1';
	case 'SD': // - European Straddle':
		return '1X1';
	case 'SDTS': // - European Straddle Time Spread':
//		return '-1X-1X1X1';
		return '1X1X1X1';
	case 'SG': // - European Strangle':
		return '1X1';

		// 'ESGAC - European Strangle VS Call',
		// 'ESGAP - European Strangle VS Put',
		// 'ESGTS - European Strangle Time Spread',
		// 'ETRR - European Time Risk Reversal',
		// 'ECSAC - European Call Spread VS Call',
		// 'ECSAP - European Call Spread Against Put',
		// 'ECSAPR - European Call Spread VS Put (Ratio',
		// 'ECSAPPO - European Call Spread VS Put - Put Over',
		// 'ECSPS - European Call Spread VS Put Spread',
		// 'ECSTR - European Call Spread Time Ratio',
		// 'ECSTS - European Call Spread Time Spread',
		// 'ECTSAP - European Call Time Spread Against Put',
		// 'EPSAC - European Put Spread Against Call',
		// 'EPSACR - European Put Spread VS Call (Ratio',
		// 'EPSACCO - European Put Spread VS Call - Call Over',
		// 'EPSAP - European Put Spread VS Put',
		// 'EPSTUP - European Put Stupid',
		// 'EPTSAC - European Put Time Spread Against Call',
		// 'ESDAC - European Straddle VS Call',
		// 'ESDAP - European Straddle VS Put',
		// 'FWDB - Forward Butterfly',
	case 'SPRD - Spread':
		alert('SPRD - Spread');
		break;
	default:
		alert('no matching deriv type: ' + deriv);
		break;
	}
}

function getMultiple(term, n, defaultTerm) {
	var multi = [];
	for (i = 0; i < n; i++) {
		multi[i] = 1;
	}
	if (term.indexOf('X') > 0) {
		var tokens = term.split('X');
		for (j = 0; j < tokens.length; j++) {
			multi[j] = Math.abs(tokens[j]);
		}
	} else {
		var tokens = defaultTerm.split('X');
		for (j = 0; j < tokens.length; j++) {
			multi[j] = tokens[j];
		}
	}
	return multi;
}

//function getSides(term, thisSide) {
//	var multi = [];
//	var otherSide = thisSide == 'Buy' ? 'Sell' : 'Buy';
//	if (term.indexOf('X') > 0) {
//		var tokens = term.split('X');
//		for (j = 0; j < tokens.length; j++) {
//			if (Number(tokens[j]) > 0)
//				multi.push(thisSide);
//			else 
//				multi.push(otherSide);	
//		}
//	} 
//	return multi;
//}

function deduceStrat(common_strat, is_n_expiry, is_n_strike, is_n_multiplier, isReverse) {
	switch (common_strat) {
	case 'CS' : {
		if (is_n_expiry)
			if (is_n_strike)
				return 'CDIAG';
			else 
				if (is_n_multiplier)
					return 'CTR';
				else 
					return 'CTS';
		else 
			if (is_n_multiplier)
				return 'CR';
			else return 'CS';
		return 'CS';
	}
	case 'PS' : {
		if (is_n_expiry)
			if (is_n_strike)
				return 'PDIAG';
			else 
				if (is_n_multiplier)
					return 'PTR';
				else 
					return 'PTS';
		else 
			if (is_n_multiplier)
				return 'PR';
			else return 'PS';
		return 'PS';
	}
	case 'CFLY' : {
		if (is_n_expiry)
			return 'CTB';
		else 
			return 'CB';
	}
	case 'PFLY' : {
		if (is_n_expiry)
			return 'PTB';
		else 
			return 'PB';
	}
	case 'CDOR' : {
		if (is_n_expiry)
			return 'CTC';
		else 
			return 'CC';
	}
	case 'PDOR' : {
		if (is_n_expiry)
			return 'PTC';
		else 
			return 'PC';
	}
	case 'CLDR' : {
		if (is_n_expiry)
			return 'CTL';
		else 
			return 'CL';
	}
	case 'PLDR' : {
		if (is_n_expiry)
			return 'PTL';
		else 
			return 'PL';
	}
	case 'IFLY' : {
		if (is_n_multiplier)
			return 'IFR';
		else 
			return 'IF';
	}
	default:
		return common_strat;
	}
}

function parseSymbol(mySymbol) {
	MAX = 7;	// no delta
	POS_MULTIPLIER = 3;
	POS_STRATEGY = 4;

	// HSCEI JUN17 9000/7000 1x1.5 PS 191 TRADES REF 9850 DELTA 28
	// HSCEI,JUN17,9000/7000,PS,191,9850,28
	// HSCEI JUN17 8000/9000/10000/11000 1x1.5X1.5X1 CDOR 191 TRADES REF 9850
	
	// -> HSCEI,JUN17,9000/7000,1x1.5,PS,191,9850,28
	var ul;
	var expiry;
	var strike;
	var multiplier;
	var strat;
	
	var multi = [];
	for (j = 0; j < MAX; j++) {
		multi[j] = 1;
	}
	
	var tokens = mySymbol.toUpperCase().split(' ');
	var i = 0;
//	multi[0] = tokens[i++];	// UL
	ul = tokens[0];	// UL	, i = 0
	
	expiry = tokens[1];	// Expiry	, i = 1	
	var is_n_expiry = false;
	if (expiry.split('/').length > 1) {
		is_n_expiry = true;
	}
	
	strike = tokens[2];	// strike, 	 	i=2
	var is_n_strike = false;
	if (strike.split('/').length > 1) {
		is_n_strike = true;
	}
	
	// multiple specified		i = 3 
	if (tokens[3].indexOf('X') > -1
			&& tokens[3].match(/^[0-9]+/)) 
	{
		multiplier = tokens[3];	// ( multiplier )	// i = 3
		var common_strat = tokens[4];	// i = 4
		strat = deduceStrat(common_strat, is_n_expiry, is_n_strike, true);
		i = 5;
	} else {
		// default
		var common_strat = tokens[3];	// i = 3
		strat = deduceStrat(common_strat, is_n_expiry, is_n_strike, false);
		multiplier = getDefaultMultiplier(strat);
		i = 4;
	}
	
	multi[0] = ul;
	multi[1] = expiry;
	multi[2] = strike;
	multi[4] = strat;

	j = 5;
	while (j < MAX) {
		value = tokens[i++];
		if (value === 'TRADES' || value === 'REF' || value === 'DELTA') {
		} else if ((value.indexOf('(') >=0) && (value.indexOf(')') > 0)) {
			multiplier = reverse(multiplier);
		}
		else {
			multi[j++] = value;
		}
	}
	multi[3] = multiplier;
	
	return multi;
}

function reverse(multiplier) {
	var tokens = multiplier.split('X');
	var new_tokens = [];
	var str = "";
	for (i=0; i<tokens.length; i++) {
		str += (Number(tokens[i]) * -1) + "X";
	}
	s = str.substring(0, str.length-1);
	return s;
}