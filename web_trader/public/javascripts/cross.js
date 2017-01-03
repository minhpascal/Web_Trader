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
//	'ngMaterial', 'ngMessages', 'ngAnimate', 'ngTouch'
//app.config(function($momentProvider){
//    $momentProvider
//    .asyncLoading(false)
//    .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');

//app.controller('AppCtrl', AppCtrl, moment).controller('AutoCompleteCtrl', AutoCompleteCtrl);
//		.controller('DatepickerCtrl', DatepickerCtrl)
//		.controller('TradeconfoCtrl', TradeconfoCtrl)

function DialogController($scope, $mdDialog, locals) {
	$scope.myPrice = locals.myPrice;
	// $scope.myRefPrice = "";
	$scope.myDelta = locals.myDelta;
	$scope.myCpCompany = locals.myCpCompany;
	$scope.myPremium = 0;
	$scope.mySide = locals.mySide;
	$scope.myQty = locals.myQty;
	$scope.mySymbol = locals.mySymbol;

	// $scope.status = ' ';
	// $scope.customFullscreen = false;

	$scope.myFutExp = "DEC16";
	$scope.fut_exp = [ 'DEC16', 'MAR17', 'JUN17', ];

	$scope.myData = [];

	$scope.gridOptions = {
		data : 'myData',
		rowEditWaitInterval : -1,
		enableSorting : false,
		enableColumnResizing : true,
		enableFiltering : false,
		showGridFooter : false,
		showColumnFooter : false,
		columnDefs : [ {
			field : 'Instrument',
			width : '120',
			enableCellEdit : false
		}, {
			field : 'UL',
			displayName : 'UL',
			width : '100',
			enableCellEdit : false
		}, {
			field : 'Qty',
			displayName : 'Qty',
			width : '60'
		}, {
			field : 'Side',
			displayName : 'Side',
			width : '60'
		}, {
			field : 'Strike',
			displayName : 'Strike',
			width : '80'
		}, {
			field : 'Expiry',
			displayName : 'Expiry',
			width : '80'
		}, {
			field : 'Price',
			displayName : 'Price',
			width : '*',
			enableCellEdit : true,
			cellFilter : 'number: 2'
		}, {
			field : 'Multiplier',
			displayName : 'Multiplier',
			width : '*',
			enableCellEdit : true,
			visible : false
		}, ],

		// enableGridMenu: true,
		// enableSelectAll: true,
		// enableRowSelection: true,
		exporterMenuPdf : false,
	// exporterCsvFilename: 'invoice_summary.csv',
	// exporterCsvLinkElement:
	// angular.element(document.querySelectorAll(".custom-csv-link-location")),
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEdit);
	}
	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		// $scope.myData = [];
		$mdDialog.cancel();
	};

	$scope.answer = function(answer) {
		$mdDialog.hide(answer);
	};

	$scope.gridOptions.onRegisterApi = function(gridApi) {
		$scope.gridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEdit);
	}

	$scope.afterCellEdit = function(rowEntity, coldef, newValue, oldValue) {
		var nMissLeg = 0;
		params = [];
		var myMultiplier = 0;
		var myPremium = $scope.myPremium;
		var mySide = 0;
		var myId = -1;
		for (i = 0; i < $scope.myData.length; i++) {
			// if ($scope.myData[i].UL.indexOf('Future') > 0)
			// continue;

			if ($scope.myData[i].Price) {
				params.push({
					'side' : $scope.myData[i].Side,
					'multiplier' : $scope.myData[i].Multiplier,
					'price' : $scope.myData[i].Price
				});
			} else {
				nMissLeg++;
				mySide = $scope.myData[i].Side;
				myMultiplier = $scope.myData[i].Multiplier;
				myId = i;
			}
		}
		if (nMissLeg === 1) {
			var price = calRemainPrice(params, myMultiplier, mySide, myPremium);
			// calRemainPrice(params, myMultiplier, myPrice, mySide);
			$scope.myData[myId].Price = price;
		}
	}

	$scope.createLegs = function(ev, myDelta, myFutExp) {
		var mySide = $scope.mySide;
		var mySymbol = $scope.mySymbol;
		var myDelta = $scope.myDelta;
		var myQty = $scope.myQty;
		var myCpCompany = $scope.myCpCompany;
		var tokens = parseSymbol($scope.mySymbol);
		// ["HSCEI", "JUN17", "9000/7000", "1X1.5", "PS", "191", "9850", "28"]
		$scope.myParam = [];
		var data = []; // clear legs
		type = tokens[4];
		var qty = [];
		var ul = [];

		var instr = tokens[0];
		var expiry = tokens[1];
		var strike = tokens[2];
		var multiplier = tokens[3];
		var instrument = tokens[4];
		$scope.myPremium = Number(tokens[5]);
		var ref = Number(tokens[6].replace(',', ''));

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
		case 'CB': { // 'ECB - European Call Butterfly':
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
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(multi[0]) * Number(myQty),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(multi[1]) * Number(myQty),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(multi[2]) * Number(myQty),
				'side' : thisSide
			};

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
				'fut_expiry' : myFutExp
			};
			break;
		}
		case 'CC': { // 'ECC - European Call Condor':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 4, '1X1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(multi[0]) * Number(myQty),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(multi[1]) * Number(myQty),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(multi[2]) * Number(myQty),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[3],
				'qty' : Number(multi[3]) * Number(myQty),
				'side' : thisSide
			};

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
				'fut_expiry' : myFutExp
			};
			break;
		}
		case 'CS': { // 'ECDIAG - European Call Diagonal':
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
				'type' : 'Call',
				'expiry' : expiries[0],
				'strike' : strikes[0],
				'qty' : Number(multi[0]) * Number(myQty),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiries[1],
				'strike' : strikes[1],
				'qty' : Number(multi[1]) * Number(myQty),
				'side' : oppSide
			};

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
				'future' : myFuture
			};
			break;
		}
		case 'CL': { // 'ECL - European Call Ladder':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[0],
				'qty' : Number(multi[0]) * Number(myQty),
				'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[1],
				'qty' : Number(multi[1]) * Number(myQty),
				'side' : oppSide
			};
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Call',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(multi[2]) * Number(myQty),
				'side' : oppSide
			};
			break;
		}
		case 'CR': { // 'ECR - European Call Ratio':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry, 'strike' : strikes[0], 'qty' : Number(myQty) * Number(multi[0]), 'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry, 'strike' : strikes[1], 'qty' : Number(myQty) * Number(multi[1]), 'side' : oppSide
			};

			var strikes = tokens[2].split('/');
			var multi = getMultiple(multiplier, 2, '1X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], myFutExp);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], myFutExp);
			ul[2] = exchangeSymbol(instr, 'F', '', myFutExp);
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			qty[0] = Number(myQty) * Number(multi[0]);
			qty[1] = Number(myQty) * Number(multi[1]);
			var list = [ {
				'side' : thisSide, option : 'Call', qty : qty[0]
			}, {'side' : oppSide, option : 'Call', qty : qty[1]
			} ];
			var futSide = hedgeSide(list);
			$scope.myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : expiry, 'Strike' : strikes[0], 'Qty' : qty[0], 'Side' : thisSide, 'Multiplier' : Number(multi[0])
			};
			$scope.myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : expiry, 'Strike' : strikes[1], 'Qty' : qty[1], 'Side' : oppSide, 'Multiplier' : Number(multi[1])
			};
			$scope.myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : ul[2], 'Expiry' : myFutExp, 'Strike' : '', 'Qty' : Number(myQty) * Number(myDelta) * 0.01,
				'Side' : futSide, 'Price' : ref, 'Multiplier' : 0
			};
			$scope.myParam[0] = {
				'ul' : instr, 'strategy' : 'European Put Spread', 'expiry' : expiry, 'strike' : strike, 'qty' : myQty, 'side' : mySide,
				'multiplier' : multiplier, 'instrument' : instrument, 'premium' : $scope.myPremium, 'ref' : ref, 'delta' : myDelta, 'fut_expiry' : myFutExp
			};
			break;
		}
		case 'ECS - European Call Spread':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 2, '1X1');
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			$scope.myData[0] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry, 'strike' : strikes[0], 'qty' : Number(myQty) * Number(multi[0]), 'side' : thisSide
			};
			$scope.myData[1] = {
				'ul' : instr, 'type' : 'Call', 'expiry' : expiry, 'strike' : strikes[1], 'qty' : Number(myQty) * Number(multi[1]), 'side' : oppSide
			};
			break;
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
		case 'EPC - European Put Condor':
			var instr = tokens[0];
			var expiry = tokens[1];
			var strikes = tokens[2].split('/');
			var multi = getMultiple(tokens[3], 4, '1X1X1X1');
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
			$scope.myData[2] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[2],
				'qty' : Number(myQty) * Number(multi[2]),
				'side' : oppSide
			};
			$scope.myData[3] = {
				'ul' : instr,
				'type' : 'Put',
				'expiry' : expiry,
				'strike' : strikes[3],
				'qty' : Number(myQty) * Number(multi[3]),
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
		case 'EPL - European Put Ladder':
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
		case 'PS': { // 'EPS - European Put Spread':
			var strikes = tokens[2].split('/');
			var multi = getMultiple(multiplier, 2, '1X1');
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], myFutExp);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], myFutExp);
			ul[2] = exchangeSymbol(instr, 'F', '', myFutExp);
			var thisSide = mySide;
			var oppSide = mySide === 'Buy' ? 'Sell' : 'Buy';
			qty[0] = Number(myQty) * Number(multi[0]);
			qty[1] = Number(myQty) * Number(multi[1]);
			var list = [ {
				'side' : thisSide, option : 'Put', qty : qty[0]
			}, {
				'side' : oppSide, option : 'Put', qty : qty[1]
			} ];
			var futSide = hedgeSide(list);
			$scope.myData[0] = {
				'UL' : instr + ' Put',
				'Instrument' : ul[0],
				'Expiry' : expiry,
				'Strike' : strikes[0],
				'Qty' : qty[0],
				'Side' : thisSide,
				'Multiplier' : Number(multi[0])
			};
			$scope.myData[1] = {
				'UL' : instr + ' Put',
				'Instrument' : ul[1],
				'Expiry' : expiry,
				'Strike' : strikes[1],
				'Qty' : qty[1],
				'Side' : oppSide,
				'Multiplier' : Number(multi[1])
			};
			$scope.myData[2] = {
				'UL' : instr + ' Future',
				'Instrument' : ul[2],
				'Expiry' : myFutExp,
				'Strike' : '',
				'Qty' : Number(myQty) * Number(myDelta) * 0.01,
				'Side' : futSide,
				'Price' : ref,
				'Multiplier' : 0
			};
			// $scope.gridOptions.data = $scope.myData;
			// gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
			// if (!$scope.$$phase) {
			// $scope.$apply();
			// }
			$scope.myParam[0] = {
				'ul' : instr,
				'strategy' : 'European Put Spread',
				'expiry' : expiry,
				'strike' : strike,
				'qty' : myQty,
				'side' : mySide,
				'multiplier' : multiplier,
				'instrument' : instrument,
				'premium' : $scope.myPremium,
				'ref' : ref,
				'delta' : myDelta,
				'fut_expiry' : myFutExp
			};
			break;
		}
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
			var multi = tokens[3].split('x');
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
    $scope.mySide = "Buy";

    $scope.myQty = '100';
    $scope.mySymbol = 'HSCEI JUN17 9000/7000 1x1.5 PS 191 TRADES REF 9850 DELTA 28';
    $scope.mySymbol = 'HSI DEC17 22000/24000 1x1.25 CR 10 TRADES REF 22,825';
    
    $scope.instruments = [
//    	'HKD', 'KRW,JPY,USD',
//    	];
	'EC - European Call',
	'ECB - European Call Butterfly',
	'ECC - European Call Condor',
	'ECDIAG - European Call Diagonal',
	'ECL - European Call Ladder',
	'ECR - European Call Ratio',
	'ECS - European Call Spread',
	'ECTB - European Call Time Butterfly',
	'ECTC - European Call Time Condor',
	'ECTL - European Call Time Ladder',
	'ECTR - European Call Time Ratio',
	'ECTS - European Call Time Spread',
	'EIF - European Iron Fly',
	'EIFR - European Iron Fly Ratio',
	'EP - European Put',
	'EPB - European Put Butterfly',
	'EPC - European Put Condor',
	'EPDIAG - European Put Diagonal',
	'EPL - European Put Ladder',
	'EPR - European Put Ratio',
	'EPS - European Put Spread',
	'EPTB - European Put Time Butterfly',
	'EPTC - European Put Time Condor',
	'EPTL - European Put Time Ladder',
	'EPTR - European Put Time Ratio',
	'EPTS - European Put Time Spread',
	'ERR - European Risk Reversal',
	'ES - European Synthetic Call Over',
	'ESPO - European Synthetic Put Over',
	'ESD - European Straddle',
	'ESDTS - European Straddle Time Spread',
	'ESG - European Strangle',
	'ESGAC - European Strangle VS Call',
	'ESGAP - European Strangle VS Put',
	'ESGTS - European Strangle Time Spread',
	'ETRR - European Time Risk Reversal',
	'ECSAC - European Call Spread VS Call',
	'ECSAP - European Call Spread Against Put',
	'ECSAPR - European Call Spread VS Put (Ratio',
	'ECSAPPO - European Call Spread VS Put - Put Over',
	'ECSPS - European Call Spread VS Put Spread',
	'ECSTR - European Call Spread Time Ratio',
	'ECSTS - European Call Spread Time Spread',
	'ECTSAP - European Call Time Spread Against Put',
	'EPSAC - European Put Spread Against Call',
	'EPSACR - European Put Spread VS Call (Ratio',
	'EPSACCO - European Put Spread VS Call - Call Over',
	'EPSAP - European Put Spread VS Put',
	'EPSTUP - European Put Stupid',
	'EPTSAC - European Put Time Spread Against Call',
	'ESDAC - European Straddle VS Call',
	'ESDAP - European Straddle VS Put',
	'FWDB - Forward Butterfly',
	'SPRD - Spread',
	];
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
    
	$scope.gridOptions = {
			data: 'myData',
			rowEditWaitInterval: -1,			
			enableSorting : false,
			enableColumnResizing: true,
			enableFiltering: false,
			showGridFooter: false,
			showColumnFooter: false,
			columnDefs : [
				{field : 'Instrument', width: '150', enableCellEdit: false },
				{field : 'UL', displayName: 'UL', width: '100', enableCellEdit: false},  
				{field : 'Qty', displayName: 'Qty', width: '80'},  
				{field : 'Side', displayName: 'Side', width: '80'},  
				{field : 'Strike', displayName: 'Strike', width: '80'},  
				{field : 'Expiry', displayName: 'Expiry', width: '80'},
				{field : 'Price', displayName: 'Price', width: '*', enableCellEdit: true, cellFilter: 'number: 2'},  
				{field : 'Multiplier', displayName: 'Price', width: '*', enableCellEdit: true, visible:false},  
			],
			
//		    enableGridMenu: true,
//		    enableSelectAll: true,
//		    enableRowSelection: true,
		    exporterMenuPdf: false,
//		    exporterCsvFilename: 'invoice_summary.csv',
//		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		};
    

	
	$scope.showCrossDetail = function(ev, myTrType, mySide, myQty, mySymbol, myCpCompany) 
	{
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
				'myQty': myQty,
				'mySymbol': mySymbol,
				'myCpCompany': myCpCompany,
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
	
    // delta -> future leg qty
    // symbol -> 
//    $scope.createLegs = function(ev, myType, mySide, myQty, mySymbol, myDelta, myCpCompany, myFutExp) 
//    {
//    	var tokens = parseSymbol(mySymbol);
//    	// ["HSCEI", "JUN17", "9000/7000", "1X1.5", "PS", "191", "9850", "28"]
//    	$scope.myParam = [];
//    	var data = [];	// clear legs
//    	type = tokens[4];
//    	var qty = [];
//		var ul = [];
//		
//		var instr = tokens[0];
//		var expiry = tokens[1];
//		var strike = tokens[2];
//		var multiplier = tokens[3];
//		var instrument = tokens[4];
//		$scope.myPremium = Number(tokens[5]);
//		var ref = Number(tokens[6].replace(',',''));
//    	
//    	switch (type)
//    	{
//    	case 'C': { //'EC - European Call':
//    		$scope.myParam[0] = {'ul' : instr, 'type':'Call', 'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : premium, 'ref' : ref, 
//					'delta' : myDelta, 'future' : myFutExp };
//    		
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : premium, 'ref' : ref, 
//					'delta' : myDelta, 'future' : myFutExp };
//    		break;
//    	}
//    	case 'CB': { //'ECB - European Call Butterfly':
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X2X1');
//    		var legs = [];
//    		if (tokens.length < 5) {
//    			var thisSide = mySide;
//    			var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		else {
//    			var oppSide = mySide;
//    			var thisSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(multi[0]) * Number(myQty), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(multi[1]) * Number(myQty), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(multi[2]) * Number(myQty), 'side': thisSide};
//    		
//    		$scope.myParam[0] = {'ul' : instr, 'type':'Call', 'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : premium, 'ref' : ref, 
//					'delta' : myDelta, 'fut_expiry' : myFutExp };
//    		break;
//    	}
//    	case 'CC': { // 'ECC - European Call Condor':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 4, '1X1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(multi[0]) * Number(myQty), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(multi[1]) * Number(myQty), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(multi[2]) * Number(myQty), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[3], 'qty': Number(multi[3]) * Number(myQty), 'side': thisSide};
//    		
//    		$scope.myParam[0] = {'ul' : instr, 'type':'Call', 'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : premium, 'ref' : ref, 
//					'delta' : myDelta, 'fut_expiry' : myFutExp };
//    		break;
//    	}
//    	case 'CS': { //'ECDIAG - European Call Diagonal':
//    		var instr = tokens[0];
//    		var expiries = tokens[1].split('/');
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		if (tokens.length > 4) {
//    			var thisSide = mySide;
//    			var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		else {
//    			var oppSide = mySide;
//    			var thisSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiries[0], 'strike':strikes[0], 'qty': Number(multi[0]) * Number(myQty), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiries[1], 'strike':strikes[1], 'qty': Number(multi[1]) * Number(myQty), 'side': oppSide};
//    		
//    		$scope.myParam[0] = {'ul' : instr, 'type':'Call', 'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : premium, 'ref' : ref, 
//					'delta' : myDelta, 'future' : myFuture };
//    		break;
//    	}
//    	case 'CL' : { // 'ECL - European Call Ladder':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(multi[0]) * Number(myQty), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(multi[1]) * Number(myQty), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(multi[2]) * Number(myQty), 'side': oppSide};
//    		break;
//    	}
//    	case 'CR': //'ECR - European Call Ratio':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		
//    		
////    		var es = exchangeSymbol(instr, 'C', strike, myFutExp);
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(multiplier, 2, '1X1');
//    		ul[0] = exchangeSymbol(instr, 'P', strikes[0], myFutExp);
//    		ul[1] = exchangeSymbol(instr, 'P', strikes[1], myFutExp);
//    		ul[2] = exchangeSymbol(instr, 'F', '', myFutExp);
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		qty[0] = Number(myQty) * Number(multi[0]);
//    		qty[1] = Number(myQty) * Number(multi[1]);
//    		var list = [
//    			{'side':thisSide, option:'Call', qty:qty[0]},
//    			{'side':oppSide, option:'Call', qty:qty[1]}
//    		];
//    		var futSide = hedgeSide(list);
//    		$scope.myData[0] = {'UL' : instr + ' Call', 'Instrument': ul[0], 'Expiry':expiry, 'Strike':strikes[0], 
//    				'Qty': qty[0], 'Side': thisSide, 'Multiplier': Number(multi[0])};
//    		$scope.myData[1] = {'UL' : instr + ' Call', 'Instrument': ul[1], 'Expiry':expiry, 'Strike':strikes[1], 
//    				'Qty': qty[1], 'Side': oppSide, 'Multiplier' : Number(multi[1])};
//    		$scope.myData[2] = {'UL' : instr + ' Future', 'Instrument': ul[2], 'Expiry':myFutExp, 'Strike':'', 
//    				'Qty': Number(myQty) * Number(myDelta) * 0.01, 'Side': futSide, 'Price' : ref, 'Multiplier': 0};
////    		$scope.gridOptions.data = $scope.myData;
////    		gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
////            if (!$scope.$$phase) {
////                $scope.$apply();
////            }
//    		$scope.myParam[0] = {'ul' : instr, 'strategy':'European Put Spread', 
//    				'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : $scope.myPremium, 'ref' : ref, 
//					'delta' : myDelta, 'fut_expiry' : myFutExp};
//    		break;
//    	case 'ECS - European Call Spread':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'ECTB - European Call Time Butterfly':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 3, '1X2X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': thisSide};
//    		break;
//    	case 'ECTC - European Call Time Condor':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 4, '1X1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Call', 'expiry':expiry[3], 'strike':strikes, 'qty': Number(myQty) * Number(multi[3]), 'side': thisSide};
//    		break;
//    	case 'ECTL - European Call Time Ladder':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 3, '1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		break;
//    	case 'ECTR - European Call Time Ratio':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    	case 'ECTS - European Call Time Spread':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    	case 'EIF - European Iron Fly':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		break;
//    	case 'EIFR - European Iron Fly Ratio':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		break;
//    		
//    		// put strategy
//    	case 'EP - European Put':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strike = tokens[2];
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strike, 'qty': myQty, 'side': mySide};
//    		break;
//    	case 'EPB - European Put Butterfly':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X2X1');
//    		var legs = [];
//    		if (tokens.length < 5) {
//    			var thisSide = mySide;
//    			var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		else {
//    			var oppSide = mySide;
//    			var thisSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(myQty) * Number(multi[2]), 'side': thisSide};
//    		break;
//    	case 'EPC - European Put Condor':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 4, '1X1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[3], 'qty': Number(myQty) * Number(multi[3]), 'side': thisSide};
//    		break;
//    	case 'EPDIAG - European Put Diagonal':
//    		var instr = tokens[0];
//    		var expiries = tokens[1].split('/');
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		if (tokens.length > 4) {
//    			var thisSide = mySide;
//    			var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		else {
//    			var oppSide = mySide;
//    			var thisSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiries[0], 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiries[1], 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'EPL - European Put Ladder':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[2], 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		break;
//    	case 'EPR - European Put Ratio':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'PS': {//'EPS - European Put Spread':
////    		var es = exchangeSymbol(instr, 'P', strike, myFutExp);
////    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(multiplier, 2, '1X1');
//    		ul[0] = exchangeSymbol(instr, 'P', strikes[0], myFutExp);
//    		ul[1] = exchangeSymbol(instr, 'P', strikes[1], myFutExp);
//    		ul[2] = exchangeSymbol(instr, 'F', '', myFutExp);
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		qty[0] = Number(myQty) * Number(multi[0]);
//    		qty[1] = Number(myQty) * Number(multi[1]);
//    		var list = [
//    			{'side':thisSide, option:'Put', qty:qty[0]},
//    			{'side':oppSide, option:'Put', qty:qty[1]}
//    		];
//    		var futSide = hedgeSide(list);
//    		$scope.myData[0] = {'UL' : instr + ' Put', 'Instrument': ul[0], 'Expiry':expiry, 'Strike':strikes[0], 'Qty': qty[0], 'Side': thisSide, 'Multiplier': Number(multi[0])};
//    		$scope.myData[1] = {'UL' : instr + ' Put', 'Instrument': ul[1], 'Expiry':expiry, 'Strike':strikes[1], 'Qty': qty[1], 'Side': oppSide, 'Multiplier' : Number(multi[1])};
//    		$scope.myData[2] = {'UL' : instr + ' Future', 'Instrument': ul[2], 'Expiry':myFutExp, 'Strike':'', 'Qty': Number(myQty) * Number(myDelta) * 0.01, 'Side': futSide, 'Price' : ref, 'Multiplier': 0};
////    		$scope.gridOptions.data = $scope.myData;
////    		gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
////            if (!$scope.$$phase) {
////                $scope.$apply();
////            }
//    		$scope.myParam[0] = {'ul' : instr, 'strategy':'European Put Spread', 
//    				'expiry': expiry, 'strike':strike, 'qty': myQty, 'side': mySide, 
//					'multiplier' : multiplier, 'instrument' : instrument, 'premium' : $scope.myPremium, 'ref' : ref, 
//					'delta' : myDelta, 'fut_expiry' : myFutExp
//					};
//    		break;
//    	}
//    	case 'EPTB - European Put Time Butterfly':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 3, '1X2X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': thisSide};
//    		break;
//    	case 'EPTC - European Put Time Condor':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 4, '1X1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		$scope.myData[3] = {'ul' : instr, 'type':'Put', 'expiry':expiry[3], 'strike':strikes, 'qty': Number(myQty) * Number(multi[3]), 'side': thisSide};
//    		break;
//    	case 'EPTL - European Put Time Ladder':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var multi = getMultiple(tokens[3], 3, '1X1X1');
//    		var strikes = tokens[2];
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Put', 'expiry':expiry[2], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': oppSide};
//    		break;
//    	case 'EPTR - European Put Time Ratio':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var multi = tokens[3].split('x');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    	case 'EPTS - European Put Time Spread':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    	case 'ERR - European Risk Reversal':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		if (tokens.length > 4) {
//    			var oppSide = mySide;
//    			var thisSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		else {
//    			var thisSide = mySide;
//    			var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		}
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'ES - European Synthetic Call Over':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'ESPO - European Synthetic Put Over':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		break;
//    	case 'ESD - European Straddle':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    	case 'ESDTS - European Straddle Time Spread':
//    		var instr = tokens[0];
//    		var expiry = tokens[1].split('/');
//    		var strikes = tokens[2];
//    		var multi = getMultiple(tokens[3], 4, '1X1X1X1');
//    		var thisSide = mySide;
//    		var oppSide = mySide === 'Buy'? 'Sell' : 'Buy';
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[0]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[1]), 'side': oppSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Put', 'expiry':expiry[0], 'strike':strikes, 'qty': Number(myQty) * Number(multi[2]), 'side': thisSide};
//    		$scope.myData[2] = {'ul' : instr, 'type':'Call', 'expiry':expiry[1], 'strike':strikes, 'qty': Number(myQty) * Number(multi[3]), 'side': thisSide};
//    		break;
//    	case 'ESG - European Strangle':
//    		var instr = tokens[0];
//    		var expiry = tokens[1];
//    		var strikes = tokens[2].split('/');
//    		var multi = getMultiple(tokens[3], 2, '1X1');
//    		var thisSide = mySide;
//    		$scope.myData[0] = {'ul' : instr, 'type':'Put', 'expiry':expiry, 'strike':strikes[0], 'qty': Number(myQty) * Number(multi[0]), 'side': thisSide};
//    		$scope.myData[1] = {'ul' : instr, 'type':'Call', 'expiry':expiry, 'strike':strikes[1], 'qty': Number(myQty) * Number(multi[1]), 'side': thisSide};
//    		break;
//    		
////		'ESGAC - European Strangle VS Call',
////		'ESGAP - European Strangle VS Put',
////		'ESGTS - European Strangle Time Spread',
////		'ETRR - European Time Risk Reversal',
////		'ECSAC - European Call Spread VS Call',
////		'ECSAP - European Call Spread Against Put',
////		'ECSAPR - European Call Spread VS Put (Ratio',
////		'ECSAPPO - European Call Spread VS Put - Put Over',
////		'ECSPS - European Call Spread VS Put Spread',
////		'ECSTR - European Call Spread Time Ratio',
////		'ECSTS - European Call Spread Time Spread',
////		'ECTSAP - European Call Time Spread Against Put',
////		'EPSAC - European Put Spread Against Call',
////		'EPSACR - European Put Spread VS Call (Ratio',
////		'EPSACCO - European Put Spread VS Call - Call Over',
////		'EPSAP - European Put Spread VS Put',
////		'EPSTUP - European Put Stupid',
////		'EPTSAC - European Put Time Spread Against Call',
////		'ESDAC - European Straddle VS Call',
////		'ESDAP - European Straddle VS Put',
////		'FWDB - Forward Butterfly',
//    	case 'SPRD - Spread':
//    		alert('SPRD - Spread');
//    		break;
//    	default:
//    		alert('no matching');
//    	break;
//    	}
//    };

    $scope.showCrossDialog = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          contentElement: '#myDialog',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
//          fullscreen: true
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
	case 'CB': // - European Call Butterfly':
	case 'PB': // - European Put Butterfly':
		return '1x-2x1';
	case 'CC': // - European Call Condor':
	case 'PC': // European Put Condor':
		return '1x-1x-1x1';
	case 'CDIAG': // ECDIAG - European Call Diagonal':
		return '1x-1';
	case 'PDIAG': // ECDIAG - European Put Diagonal':
		return '-1x1';
	case 'CL': // - European Call Ladder':
		return '1x-1x-1';
	case 'PL': // - European Put Ladder':
		return '-1x-1x1';
	case 'CR': // - European Call Ratio':
		return '1x-2';
	case 'PR': // - European Put Ratio':
		return '-2x1';
	case 'CS':
		return '1x-1';
	case 'PS':
		return '-1x1';
	case 'CTB': // - European Call Time Butterfly':
	case 'PTB': // - European Call Time Butterfly':
		return '1x-2x1';
	case 'CTC': // - European Call Time Condor':
	case 'PTC': // - European Put Time Condor':
		return '1x-1x-1x1';
	case 'CTL': // - European Call Time Ladder':
		return '1x-1x-1';
	case 'PTL': // - European Put Time Ladder':
		return '-1x-1x1';
	case 'CTR - European Call Time Ratio':
		return '1x-2';
	case 'PTR - European Put Time Ratio':
		return '-2x1';
	case 'CTS': // - European Call Time Spread':
	case 'PTS': // - European Put Time Spread':
		return '-1x1';
	case 'IF': // - European Iron Fly':
	case 'IFR': // - European Iron Fly Ratio':
		return '-1x1x1x-1';
	case 'RR': // - European Risk Reversal':
		return '1x-1';
	case 'S':// - European Synthetic Call Over':
		return '-1x1';
	case 'SPO':// - European Synthetic Put Over':
		return '1x-1';
	case 'SD': // - European Straddle':
		return '1x1';
	case 'SDTS': // - European Straddle Time Spread':
		return '-1x-1x1x1';
	case 'SG': // - European Strangle':
		return '1x1';

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
			multi[j] = tokens[j];
		}
	} else {
		var tokens = defaultTerm.split('X');
		for (j = 0; j < tokens.length; j++) {
			multi[j] = tokens[j];
		}
	}
	return multi;
}

function parseSymbol(mySymbol) {
	MAX = 7;
	POS_MULTIPLIER = 3;

	// HSCEI JUN17 9000/7000 1x1.5 PS 191 TRADES REF 9850 DELTA 28
	// HSCEI,JUN17,9000/7000,PS,191,9850,28

	// -> HSCEI,JUN17,9000/7000,1x1.5,PS,191,9850,28
	var multi = [];
	for (j = 0; j < MAX; j++) {
		multi[j] = 1;
	}
	var tokens = mySymbol.toUpperCase().split(' ');
	var i = 0;
	multi[0] = tokens[i++];
	multi[1] = tokens[i++];
	multi[2] = tokens[i++];
	// multiple specified
	if (tokens[POS_MULTIPLIER].indexOf('X') > -1
			&& tokens[POS_MULTIPLIER].match(/^[0-9]+/)) {
		multi[POS_MULTIPLIER] = tokens[i++];
	} else {
		// default
		multi[POS_MULTIPLIER] = getDefaultMultiplier(tokens[i]);
	}
	j = 4;
	while (j < MAX) {
		value = tokens[i++];
		if (value === 'TRADES' || value === 'REF' || value === 'DELTA') {
		} else {
			multi[j++] = value;
		}
	}
	return multi;
}