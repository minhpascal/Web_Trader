/**
 * You must include the dependency on 'ngMaterial'
 */
angular
.module('moment-module', [/*
							 * 'ngTouch', 'ui.grid' , 'ui.grid.edit',
							 * 'ui.grid.rowEdit', 'ui.grid.cellNav',
							 * 'ui.grid.resizeColumns'
							 */
	])
.factory('moment', function ($window) {
    return $window.moment;
})

var SIDE = {BUY : 'BUY', SELL : 'SELL'};

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
	'ui.grid.expandable',
	'ui.grid.pinning',
	'ngAnimate' ,
	'btford.socket-io',
	'isteven-multi-select',
	]);
//	  .config(function ($stateProvider) {
//
//      $stateProvider.state('home1', {
//        url:'/home1',
//        templateUrl: 'views/modals/test.html'
//      })
//      .state('secondState',{
//        url:'/secondState',
//        templateUrl: 'views/modals/secondStateTest.html'
//      });
//  });

app.factory('socket', function (socketFactory) {
	 return socketFactory();
	}).
	value('version', '0.1');

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', 
	'uiGridConstants', 'socket',
//	'$templateCache', 
	function($scope, $http, $mdDialog 
		,uiGridConstants, socket
//		,	$templateCache
		) {
	
// $scope.clients = {};

// $scope.mySide = "Buy";

// $scope.myType = 'EC - European Call';
    
// // RESET when enter controller
// $scope.param_isShowSendBtn = false; // display send button
// $scope.param_isQtyValid = false;
// $scope.param_isDeltaValid = false;
// $scope.param_isFutMatValid = false;
// $scope.param_isLastLegPriceValid = false;
// $scope.param_myData = [];
// $scope.myQty = '';
// $scope.myDelta = '';
// $scope.myFutMat = '';
    
//    $state.go('home1');
    socket.on('send:message', function (res) {
    	try {
//    		console.log(res.message.RefId);
// $scope.message = data.id + ',' + data.refId + ',' + data.status;
	    	var refId = Number(res.message.RefId);
	    	var id = Number(res.message.Id);
	    	var isExist = false;
	    	for (var i=0; i<$scope.myOtData.length; i++) {
	    		if ($scope.myOtData[i].RefId === refId) {
	    			$scope.myOtData[i].Id = id;
	    			$scope.myOtData[i].Status = res.message.Status;
	    			isExist = true;
	    			break;
	    		}
	    	}
	    	if (!isExist) {
//				var legs = $scope.param_myData;
				data = 
					{
						'RefId' : res.message.RefId,
						'Status': res.message.Status,
						'TrType': res.message.TrType, 
						'Symbol': res.message.Symbol,
						'Qty': res.message.Qty,
						'Delta' : res.message.Delta,
						'FutMat':res.message.FutMat,
						'Buyer' : res.message.Buyer,  
						'Seller' : res.message.Seller,
//						'Premium': res.message.Premium,
//						'Strategy': res.message.Strategy,
//						'UL': '', 
//						'Expiry': $scope.myExpiry,
//						'Strike': $scope.myStrike,
//						'Multiplier' : res.message.Multiplier,   
						'Legs': res.message.Legs,
					};
				data.subGridOptions = {
						enableSorting : false,
						enableColumnResizing : true,
						appScopeProvider: {
							showRow: function(row) {
								return true;
							}
						},
		                columnDefs: [ 
		                	{name:"Instrument", field:"Instrument", width: '120'}, 
		                	{name:"Expiry", field:"Expiry", width: '80'},
		                	{name:"Strike", field:"Strike", width: '80'},
		                	{name:"Qty", field:"Qty", width: '80'},
		                	{name:"Price", field:"Price", width: '80'},
		                	{field:"Buyer", width: '60'},
		                	{field:"Seller", width: '60'},
		                ],
		                data: data.Legs
		        }
	    		$scope.myOtData.unshift(data);
	    		}
	        $scope.otGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    	}
		catch (err) {
			alert(err.message);
		}

    });
    
	$scope.otGridOptions = {
		data : 'myOtData',
//			enableHorizontalScrollbar: false, 
//			enableVerticalScrollbar: false,
//				rowEditWaitInterval : -1,
		enableSorting : true,
		enableColumnResizing : true,
		enableFiltering : false,
		showGridFooter : false,
		showColumnFooter : false,
	    enableCellEditOnFocus: false,
	    expandableRowTemplate: 'expandableRowTemplate.html',
//	    expandableRowHeight: 150,
	    //subGridVariable will be available in subGrid scope
	    expandableRowScope: {
	      subGridVariable: 'subGridScopeVariable',
	    },
		appScopeProvider: {
			showRow: function(row) {
				return true;
			}
		},
		columnDefs : [ 
			{field : 'Id', headerCellClass: 'green-header', width: '*', enableCellEdit : false, enableHiding: false}, 
			{field : 'Status', headerCellClass: 'green-header', width: '*', enableCellEdit: false, enableHiding: false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val === 'SENT')
						return 'order_in_progress';
					if (val === 'REJECT')
						return 'order_reject';
					return 'order_ok';
				}
			},
			{field : 'TrType', displayName: 'Cross Type', headerCellClass: 'green-header', width: '*', enableCellEdit: false, enableHiding: false}, 
			{field : 'Symbol', headerCellClass: 'green-header',width : '*',enableCellEdit : false, enableHiding: false},
			{field : 'Qty', headerCellClass: 'green-header', width : '*',enableCellEdit : false, enableHiding: false},
			{field : 'Delta', headerCellClass: 'green-header', displayName: 'Delta', width : '*',enableCellEdit : false, enableHiding: false},
			{field : 'FutMat', displayName: 'Fut Mat', headerCellClass: 'green-header', width : '*',enableCellEdit : false, enableHiding: false},
			{field : 'Buyer', headerCellClass: 'green-header', width : '*', enableCellEdit : false, enableHiding: false},
			{field : 'Seller', headerCellClass: 'green-header', width : '*', enableCellEdit : false, enableHiding: false},
		 ],
//			exporterMenuPdf : false,
	};
	
//	$scope.otGridOptions.data = $scope.myOtData;
	$scope.otGridOptions.onRegisterApi = function(gridApi) {
		$scope.otGridApi = gridApi;
	}
    $scope.expandAllRows = function() {
        $scope.otGridApi.expandable.expandAllRows();
    }
    $scope.collapseAllRows = function() {
        $scope.otGridApi.expandable.collapseAllRows();
    }
    
//	if (!$scope.isInit) {
	    // cross detail scope data
	    $scope.trTypes = [
	    	'T1 - Single',
	    	'T2 - Combo',
	    	'T4 - Interbank',
	    	];
	    $scope.myTrType = 'T2 - Combo',
	    $scope.mySymbol = 'HSI DEC17 22000/24000 1x1.25 CR 10 TRADES REF 22,825';
	    
	    $scope.myOtData = [];
	    $scope.sides = [SIDE.BUY, SIDE.SELL];
	    
//	    // RESET when enter controller
//		$scope.param_isShowSendBtn = false;	// display send button
//		$scope.param_isQtyValid = false;
//		$scope.param_isDeltaValid = false;
//		$scope.param_isFutMatValid = false;
//		$scope.param_isLastLegPriceValid = false;
//		$scope.param_myData = [];
		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
		
		$scope.status = '  ';
		$scope.myCompany = 'HKCEL';
		$scope.myCpCompany = 'HKTOM';

		$scope.myEnv = "TESTING";
		
		$http.get('api/getTradeReport').then(function(result) {
			v = result.data.data;
			for (var i=0; i<v.length; i++) {
				data = {
					'Id' : v[i].Id,
					'RefId' : v[i].RefId,
					'TrType': v[i].TrType, 
					'Qty': v[i].Qty,
					'Delta' : v[i].Delta,
					'Buyer': v[i].Buyer,
					'Seller' : v[i].Seller,  
					'FutMat': v[i].FutMat,   
					'Symbol': v[i].Symbol,   
					'Status': v[i].Status,   
					'Legs': v[i].Legs,
				};
				data.subGridOptions = {
					enableSorting : false,
					enableColumnResizing : true,
					appScopeProvider: {
						showRow: function(row) {
							return true;
						}
					},
	                columnDefs: [ 
	                	{name:"Instrument", field:"Instrument", width: '120'}, 
	                	{name:"Expiry", field:"Expiry", width: '80'},
	                	{name:"Strike", field:"Strike", width: '80'},
	                	{name:"Qty", field:"Qty", width: '80'},
	                	{name:"Price", field:"Price", width: '80'},
	                	{field:"Buyer", width: '80'},
	                	{field:"Seller", width: '80'},
	                ],
	                'data': data.Legs
		        }
				$scope.myOtData.unshift(data);
			}
		});
//	}
	
	$scope.showCrossDetail = function(ev, trType, symbol, company, cpCompany) 
	{
		try {
			var str = symbol.replace(/ +(?= )/g,'');
			var tokens = parseSymbol(str);
			var myStrat = tokens[4];
			if (trType.indexOf('T2') < 0) {
				switch (myStrat) {
				case 'P':
				case 'C':
				case 'F':
					break;
				default:
					alert(trType + ' accepts only Call, Put or Future');
					return false;
				}
			}
			
			$mdDialog.show({
				controller : DialogController,
				templateUrl : 'dialog_auto.tmpl.html',
				parent : angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen : false,
				locals: {
					'myTrType': $scope.myTrType,
					'myBuyer': $scope.myCompany,
					'mySeller': $scope.myCpCompany,
					'mySymbol': $scope.mySymbol,
					'myInstr': $scope.myInstr,
					'myExpiry': $scope.Expiry,
					'myStrike': $scope.Strike,
					'myMultiplier': $scope.myMultiplier,
					'myStrat': $scope.myStrat,
					'myPremium': $scope.myPremium,
					'myRef': $scope.myRef,
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
					$scope.status = 'Trade Report sent ' + answer;
				}
			}, function() { // fail , press outside or close dialog box
				$scope.status = 'close ';
// $mdDialog.destroy();
			});
		}
		catch (err) {
			alert('parse symbol error: ' + err.essage);
		}
	};
	
	function DialogController($scope, $mdDialog, $http, locals, uiGridConstants, $templateCache) 
	{
		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
$scope.myDelta = 0;
$scope.myQty = 100;
$scope.myFutMat = 'MAR17';
		
		$templateCache.put('ui-grid/uiGridViewport',
		"<div class=\"ui-grid-viewport\" ng-style=\"colContainer.getViewportStyle()\"><div class=\"ui-grid-canvas\"><div ng-repeat=\"(rowRenderIndex, row) in rowContainer.renderedRows track by $index\" ng-if=\"grid.appScope.showRow(row.entity)\" class=\"ui-grid-row\" ng-style=\"Viewport.rowStyle(rowRenderIndex)\"><div ui-grid-row=\"row\" row-render-index=\"rowRenderIndex\"></div></div></div></div>"
		);
		$scope.iconTemplate = '<i class="material-icons" style="color:red">error_outline</i>';
		
		str = locals.mySymbol.replace(/ +(?= )/g,'');
		
		var tokens = parseSymbol(str);
		$scope.myInstr = tokens[0];
		$scope.myExpiry = tokens[1];
		$scope.myStrike = tokens[2];
		$scope.myMultiplier = tokens[3];
		$scope.myStrat = tokens[4];
		$scope.myPremium = Number(tokens[5]);
		$scope.myRef = Number(tokens[6].replace(',', ''));
		$scope.myCompany = locals.myBuyer;
		$scope.myCpCompany = locals.mySeller;
		$scope.mySymbol = str;
		$scope.myTrType = locals.myTrType.substring(0,2);
		$scope.isSingle = true;
		if ($scope.myTrType === 'T2') {
			$scope.isSingle = false;
		}
	//$scope.mySide = !side ? SIDE.BUY : side;
		$scope.myUl  = $scope.myInstr;
		
		$scope.param_isShowSendBtn = false;	// display send button
		$scope.param_isQtyValid = false;
		$scope.param_isDeltaValid = false;
		$scope.param_isFutMatValid = false;
		$scope.param_isLastLegPriceValid = false;
		
		var myQty = qty;
		$scope.param_myData = [];
		$scope.myLegData = [];
		var strat = $scope.myStrat;
		var qty = [];
		var ul = [];

		var strike = $scope.myStrike;
		var multiplier = $scope.myMultiplier;
		var ref = Number($scope.myRef);
		var sides = getSidesByParty($scope.myMultiplier, $scope.myCompany, $scope.myCpCompany);
		var instr = tokens[0];
		var futExp = '';

		var multi = getMultiple(multiplier, strat);
		var strikes = getStrikes(multiplier, tokens[2], strat);
		
	//var expiry = tokens[1];
		var maturities = getMaturities(multiplier, tokens[1], strat);
		
		$scope.myParam = [
			{'UL': $scope.myUl, 'Strategy': $scope.myStrat, 'Expiry': $scope.myExpiry,
			'Strike': $scope.myStrike, 'Multiplier': $scope.myMultiplier, 'Premium': $scope.myPremium, 
			// TODO : remove from testing
			'Qty': $scope.myQty, 'Delta': $scope.myDelta, 'FutMat': $scope.myFutMat, 
			'Buyer': $scope.myCompany, 'Seller': $scope.myCpCompany,
			'Ref': $scope.myRef, 'isQtyValid' : false, 'isDeltaValid' : false,
			'modernBrowsers' : [
			    { icon: '', name: "JAN17", ticked: false  },
			    { icon: '', name: "FEB17", ticked: false  },
			    { icon: '', name: "MAR17", ticked: false  },
			    { icon: '', name: "APR17", ticked: false  },
			    { icon: '', name: "MAY17", ticked: false  },
			    { icon: '', name: "JUN17", ticked: false  },
			    { icon: '', name: "JUL17", ticked: false  },
			    { icon: '', name: "AUG17", ticked: false  },
			    { icon: '', name: "SEP17", ticked: false  },
			    { icon: '', name: "OCT17", ticked: false  },
			    { icon: '', name: "NOV17", ticked: false  },
			    { icon: '', name: "DEC17", ticked: false  },
				{ icon: $scope.iconTemplate, name: '', ticked: true , disabled: true },
			], 
			'outputBrowsers' : [],
			},
		];
		
		/* 
		 * =============== Do not remove =================
		 * 'displayTag' 
		 * 1 - not editable (future leg and splits)input
		 * 2 - not editable (invalid price of last leg)
		 * 3 - input legs (price valid)
		 * 4 - input legs (price invalid -> quotation mark) 
		 */ 
		
		switch (strat) {
		case 'C': { // 'EC - European Call':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 
				'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 
				'Strike' : '', 'Qty' : '', 
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
				'isHide' : true, 'isSingle': $scope.isSingle
			};
			$scope.param_isLastLegPriceValid = true;
			break;
		}
		// put strategy
		case 'P' : { // - European Put': {
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
				'isHide' : true, 'isSingle': $scope.isSingleLeg,
			};
			$scope.param_isLastLegPriceValid = true;
			break;
		}
		case 'CL':  // 'ECL - European Call Ladder':
		case 'CTL' : // - European Call Time Ladder':
		case 'CFLY':  // butterfly
		case 'CB':  // 'ECB - European Call Butterfly':
		case 'CTB': { // 'ECTB - European Call Time Butterfly':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'C', strikes[2], maturities[2]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]), 
				'displayTag' : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable': true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable': true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable': false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false,  'isEditable': false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;			
		}
		case 'PL':  // 'EPL - European Put Ladder':
		case 'PTL' : // - European Put Time Ladder':
		case 'PFLY':  // butterfly
		case 'PB':  // 'EPB - European Put Butterfly':
		case 'PTB': { // 'EPTB - European Put Time Butterfly':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;			
		}
		case 'CDOR':  // 'ECC - European Call Condor':
		case 'CC':  // 'ECC - European Call Condor':
		case 'CTC': { // 'ECC - European Call Time Condor':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'C', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'C', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]),
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 'Multiplier' : Number(multi[3]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'PC': 
		case 'PDOR': // 'EPC - European Put Condor':
		case 'PTC': {// 'EPC - European Put Time Condor':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'P', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 'Multiplier' : Number(multi[3]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'CS':  // 'ECDIAG - European Call Diagonal':
		case 'CDIAG':  // 'ECDIAG - European Call Diagonal':
		case 'CR':  // 'ECR - European Call Ratio':
		case 'CTR':  // 'ECTR - European Call Time Ratio':
		case 'CTS': { // 'ECTS - European Call Time Spread':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]), 
				displayTag: CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, isEditable: true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag: CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, isEditable: false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : '', 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Multiplier' : 0, 'Price' : ref,  
				displayTag: CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'PS':  // 'EPS - European Put Spread':
		case 'PDIAG':  // 'EPS - European Put Spread':
		case 'PR':  // 'ECR - European Put Ratio':
		case 'PTR':  // 'ECTR - European Put Time Ratio':
		case 'PTS': { // 'ECTS - European Put Time Spread':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Multiplier' : 0, 'Price' : ref, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'IF':  // - European Iron Fly':
		case 'IFR' :  // - European Iron Fly Ratio':
		case 'SDTS' : {// - European Straddle Time Spread'
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'C', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 'Multiplier' : Number(multi[3]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Multiplier' : 0, 'Price' : ref, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'SG' :  // } - European Strangle':
		case 'RR' :  {// - European Risk Reversal':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'SD':  // } - European Straddle':
		case 'SYNTH': { // - European Synthetic Put Over':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0,
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
		case 'SPRD' : { // - Spread'
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'C', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]),	
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 'Multiplier' : Number(multi[1]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 'Multiplier' : Number(multi[2]), 
				displayTag : CFG.DISPLAY_PRICE_EDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : true,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 'Multiplier' : Number(multi[3]), 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_INVALID, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : true, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'displayTag' : CFG.DISPLAY_PRICE_NOEDIT_OK, displayQty: CFG.DISPLAY_QTY_INVALID, 
				'isLastLeg' : false, 'isEditable' : false,
				'Group': 1, 'TrType': $scope.myTrType, 
			};
			break;
		}
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

		default:
			alert('no matching');
			break;
		}
		
		$scope.myLegData = $scope.param_myData;
		
		$scope.hide = function() {
			$mdDialog.hide();
		};
		
		$scope.sendTradeReport = function(ev) {
			
			refId = new Date().getTime();
			
			var legs = $scope.myLegData;
			for (var i=0; i<$scope.myLegData.length; i++) {
				if ($scope.myLegData[i].isHide 
					|| $scope.myLegData[i].isSingle) {
					legs.splice(i, 1);
				}
			}
			
			$http.post('api/sendTradeReport', {
				'refId'  : refId,
				'trType' : $scope.myTrType,
				'symbol': $scope.mySymbol,
				'qty': $scope.myQty,
				'delta': $scope.myDelta,
				'price': $scope.myPremium,
				'strat' : $scope.myStrat,
				'futMat': $scope.myFutMat,
				'buyer': $scope.myCompany,
				'seller': $scope.myCpCompany,
				'legs' : legs,
			}).then(function(result) {
			});
			
			$mdDialog.cancel();
		};

		$scope.paramGridOptions = {
			    data : 'myParam',
				appScopeProvider: {
					showRow: function(row) {
						return true;
					},
					fClick: function( rowEntity ) {           
						mb = rowEntity.modernBrowsers;
						if (!rowEntity.isFutMatValid) {	// first set FutMat
							last = mb.length - 1;
							mb.splice(last, 1);	// last one is dummy 'Choose...'
						}
						
						for (var i=0; i<mb.length; i++) {
							if (mb[i].ticked) {
								rowEntity.FutMat = mb[i].name;
							}
							mb[i].icon = '';
						}
					    $scope.afterCellEditParamGrid(rowEntity);
					}
				},
				enableHorizontalScrollbar: false, 
				enableVerticalScrollbar: false,
				rowEditWaitInterval : -1,
				enableSorting : false,
				enableColumnResizing : true,
				enableFiltering : false,
				showGridFooter : false,
				showColumnFooter : false,
			    enableCellEditOnFocus: false,
				columnDefs : [ 
					{field : 'UL', headerCellClass: 'blue-header', width : '*', enableCellEdit: false, enableHiding: false}, 
					{field : 'Strategy', headerCellClass: 'blue-header',displayName:'Strat',width : '*',enableCellEdit: false, enableHiding: false}, 
					{field : 'Expiry', headerCellClass: 'blue-header',width : '*',enableCellEdit: false, enableHiding: false}, 
					{field : 'Strike', headerCellClass: 'blue-header',width : '*',enableCellEdit: false, enableHiding: false}, 
					{field : 'Multiplier', headerCellClass: 'blue-header',width : '*',enableCellEdit: false, enableHiding: false}, 
					{field : 'Qty', headerCellClass: 'blue-header',width : '*',enableCellEdit: true, enableHiding: false,
						cellTemplate: '<div class="ui-grid-cell-contents"><i class="material-icons" style="color:red" ng-if="!row.entity.isQtyValid">error_outline</i>' 
							+ '{{row.entity.Qty}}</div>',
// cellTemplate: '<div><i class="material-icons" style="color:red" ng-if="grid.appScope.param_isQtyValid === false">error_outline</i>'
// + '{{grid.appScope.myQty}}</div>',
					}, 
					{field : 'isQtyValid', visible: false},
					{field : 'Premium', headerCellClass: 'blue-header', displayName: 'Price', width: '*',enableCellEdit: false, enableHiding: false}, 
					{field : 'Delta', headerCellClass: 'blue-header',width : '*',enableCellEdit : true, enableHiding: false,
// enableCellEditOnFocus: true,
// editableCellTemplate: $scope.cellInputEditableTemplate,
// cellTemplate: '<div><i class="material-icons" style="color:red"
// ng-show="grid.appScope.param_isDeltaValid ===
// false">error_outline</i>{{grid.appScope.myDelta}}</div>',
				          cellTemplate: '<div class="ui-grid-cell-contents"><i class="material-icons" style="color:red" ng-show="row.entity.isDeltaValid === false">error_outline</i>{{row.entity.Delta}}</div>',
					},
	// {field : 'isDeltaValid', visible: false},
	// {
	// field: 'FutMat',
	// headerCellClass: 'blue-header',
	// name: 'FutMat',
	// displayName: 'Fut Mat',
	// editableCellTemplate: 'ui-grid/dropdownEditor',
	// width: '80',
	// // cellFilter: 'mapGender',
	// // cellTemplate: '<div class="ui-grid-cell-contents"><i
	// class="material-icons" style="color:red"
	// ng-show="!row.entity.isFutMatValid">error_outline</i>{{row.entity.FutMat}}</div>',
	// editDropdownValueLabel: 'type',
	// editDropdownOptionsArray: $scope.futMatTypes
	// // [
	// // { id: 'DEC16', type: 'DEC16' },
	// // { id: 'MAR17', type: 'MAR17' },
	// // { id: 'JUN17', type: 'JUN17' }
	// // ]
	// },
					{field : 'Ref', width : '80',enableCellEdit: false, visible: false},
				    {field : 'FutMat', headerCellClass: 'blue-header', width : '*', enableHiding: false,
				    	cellTemplate: '<div><isteven-multi-select input-model="row.entity.modernBrowsers"' 
	// cellTemplate: '<div isteven-multi-select
	// input-model="row.entity.modernBrowsers"'
				    		+ ' output-model="row.entity.outputBrowsers" button-label="icon name" item-label="name" '
				    		+ ' tick-property="ticked" disable-property="disabled"'
	// + ' on-item-click="grid.appScope.fClick( row.entity )"
	// selection-mode="single"></div>'
				    		+ ' on-item-click="grid.appScope.fClick( row.entity )" selection-mode="single"></div>'
				    },
				    {field : 'Buyer', headerCellClass: 'blue-header', width : '*', enableCellEdit: false, enableHiding: false}, 
				    {field : 'Seller', headerCellClass: 'blue-header', width : '*', enableCellEdit: false, enableHiding: false},
				 ],
				exporterMenuPdf : false,
		};
		
	// $scope.myExternalScope = $scope;
		
		$scope.paramGridOptions.onRegisterApi = function(gridApi) {
			$scope.paramGridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditParamGrid);
		};
		
		$scope.afterCellEditParamGrid = function(rowEntity, colDef, newValue, oldValue) {
			var tokens = rowEntity.Multiplier.split('X');
			if (!isNaN(rowEntity.Qty)) {
				var params = [];
				
				// update legs qty
				var isInvalid = false;
				for (var i=0; i<tokens.length; i++) {
					var legQty = rowEntity.Qty * Math.abs(Number(tokens[i]));
					$scope.param_myData[i].Qty = legQty;
					if (CFG.rule_check_qty(rowEntity.UL, legQty)) {
						isInvalid = true;
						$scope.param_myData[i].isQtyValid = false;
					}
				}
				// parameter qty 
				rowEntity.isQtyValid = !isInvalid;
				$scope.param_isQtyValid = !isInvalid;
				$scope.myQty = Number(rowEntity.Qty);
			}
			else {
				$scope.param_isQtyValid = false;
				$scope.myQty = rowEntity.Qty;
				for (var i=0; i<tokens.length; i++) {
					$scope.param_myData[i].Qty = undefined;
				}
			}
			
			if (!isNaN(rowEntity.Delta)/* && rowEntity.Delta !== ''*/) {
				var len = $scope.param_myData.length;
				var delta = Number(rowEntity.Delta);
				var futQty = Number(rowEntity.Qty) * Math.abs(delta) * 0.01;
				$scope.param_myData[len - 1].Qty = futQty;
				$scope.myDelta = Number(rowEntity.Delta);
				
//				var isDigit = (futQty % 1 === 0);
				var isDigit = CFG.rule_check_qty(rowEntity.UL, futQty);
				rowEntity.isDeltaValid = isDigit;
				$scope.param_isDeltaValid = isDigit;
				rowEntity.isQtyValid = isDigit;
				$scope.param_isQtyValid = isDigit;
				
				var isHide = false;
				// update future leg
				if (delta < 0) {
					$scope.param_myData[$scope.param_myData.length - 1].Buyer = $scope.myCompany;
					$scope.param_myData[$scope.param_myData.length - 1].Seller = $scope.myCpCompany;
				}
				else if (delta === 0){
					isHide = true;
				}
				else {
					$scope.param_myData[$scope.param_myData.length - 1].Buyer = $scope.myCpCompany;
					$scope.param_myData[$scope.param_myData.length - 1].Seller = $scope.myCompany;
				}
				$scope.param_myData[$scope.param_myData.length - 1].isHide = 
					isHide || $scope.param_myData[$scope.param_myData.length - 1].isSingle ;
			}
			else {
				$scope.param_isDeltaValid = false;
				rowEntity.isDeltaValid = false;
				$scope.myDelta = undefined;
				$scope.param_myData[$scope.param_myData.length - 1].isHide = false;
			}
			
			if (rowEntity.FutMat && rowEntity.FutMat !== '') {
				$scope.param_myData[$scope.param_myData.length - 1].Expiry = rowEntity.FutMat;
				$scope.param_myData[$scope.param_myData.length - 1].Instrument = exchangeSymbol($scope.myInstr, 'F', 0, rowEntity.FutMat);
				$scope.param_isFutMatValid = true;
				rowEntity.isFutMatValid = true;
				$scope.myFutMat = rowEntity.FutMat;
			}
			else {
				$scope.param_isFutMatValid = false;
				rowEntity.isFutMatValid = false;
			}
			
//			var accumQty = 0;
			var maxQty = 0;
			var maxQtyIdx = 0;
			// split leg over 1000 qty
			var newLegData = rebuildSplit($scope.param_myData);
			
			// validate splited legs
			$scope.myLegData = newLegData;
			
			$scope.param_isShowSendBtn = ($scope.param_isQtyValid && $scope.param_isDeltaValid 
					&& $scope.param_isFutMatValid && $scope.param_isLastLegPriceValid);
			
			 $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
			 if (!$scope.$$phase) {
				 $scope.$apply();
			 }
		};
		
//		$templateCache.put('ui-grid/uiGridViewport',
//				"<div class=\"ui-grid-viewport\" ng-style=\"colContainer.getViewportStyle()\"><div class=\"ui-grid-canvas\"><div ng-repeat=\"(rowRenderIndex, row) in rowContainer.renderedRows track by $index\" ng-if=\"grid.appScope.showRow(row.entity)\" class=\"ui-grid-row\" ng-style=\"Viewport.rowStyle(rowRenderIndex)\"><div ui-grid-row=\"row\" row-render-index=\"rowRenderIndex\"></div></div></div></div>"
//		);
		
		var siteNameLink = '<div class="ui-grid-cell-contents" title="{{COL_FIELD}}"><a	ui-sref="sites.site_card({siteid: row.entity._id})">{{COL_FIELD}}</a></div>';
		
		// ========================== gridOptions ================================
		$scope.gridOptions = {
			appScopeProvider: {
				showRow: function(row) {
					if (row.isHide && row.isHide === true)
						return false;
					return true;
				}
			},
	// rowEditWaitInterval : -1,
			data : 'myLegData',
			enableSorting : true,
			enableColumnResizing : true,
			enableFiltering : false,
			showGridFooter : false,
			showColumnFooter : false,
			enableCellEditOnFocus: false,
			columnDefs : [ 
				{field : 'Instrument', 
					headerCellClass: 'brown-header', 
					width : '120', enableCellEdit : false, enableHiding: false,
					cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
						var val = grid.getCellValue(row, col);
						if (val)
							return '';
						return 'missing';
					}
				}, 
				{field : 'UL', headerCellClass: 'brown-header', width: '*', enableCellEdit: false, enableHiding: false }, 
				{field : 'Qty', headerCellClass: 'brown-header', width: '*', enableCellEdit: false, /*enableHiding: false,*/
//				    cellFilter: 'number: 2', 
					cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
						if (row.entity.displayQty === CFG.DISPLAY_QTY_ROUND_TO_MAX)
							return 'insufficient';
						if (row.entity.displayQty === CFG.DISPLAY_QTY_INVALID)
							return 'missing';
						return '';
						
//						var val = grid.getCellValue(row, col);
//						if (!isNaN(val) && val > 0 && (val % 1 === 0) && val < 1001)	// decimal
//							 return '';
//						if (row.entity.displayQty === 1)
//							return '';
//						return 'missing';
					},
					cellTooltip : function(row, col) {
						if (row.entity.displayQty === CFG.DISPLAY_QTY_ROUND_TO_MAX)
							return 'Max Qty < 100. Use this leg as Qty[100] to cross';
						return '';
					},
//					cellTemplate:
//						siteNameLink
//						templateWithTooltip
//						'<div class="ui-grid-cell-contents" ng-if="row.entity.displayQty === 2">{{row.entity.Qty}}</div>'
//						'<div class="ui-grid-cell-contents" ng-if="row.entity.displayQty === 1">{{row.entity.Qty}}</div>'
//						+ '<div class="ui-grid-cell-contents" ng-if="row.entity.displayQty === 2">'
//						+ '<input style="background-color: red; color: white;" ng-input="row.entity.Qty" ng-model="row.entity.Qty" /></div>'
//						+ '<div class="ui-grid-cell-contents" ng-if="row.entity.displayQty === 3">{{row.entity.Qty}}'
//						'<div><span class="formInfo"><a href="ajax.htm?width=375" class="jTip" id="one" name="Cross as 100">?</a></span></div>'
//						'<div><span class="formInfo"><a ui-sref="ajax.htm?width=375" class="jTip" id="one" name="Cross as 100">?</a></span></div>'
//						'<div class="ui-grid-cell-contents" ><a href="#" data-toggle="tooltip" title="Hooray!">{{row.entity.Qty}}</a></div>'
				}, 
				{field : 'Strike', headerCellClass: 'brown-header', width : '*',enableCellEdit : false, enableHiding: false}, 
				{field : 'Expiry',headerCellClass: 'brown-header', width : '*', enableCellEdit : false, enableHiding: false,
					cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
						var val = grid.getCellValue(row, col);
						if (val)
							return '';
						return 'missing';
					}
				}, 
				{field : 'Price', headerCellClass: 'brown-header', width : '*', enableHiding: false,
//enableCellEdit : true,
 cellFilter : 'number: 2',
				    cellEditableCondition: function ($scope) {
				    	if ($scope.row.entity.isEditable)
				    		return true;
				    	return false;
	// 'row.entity.isEditable',
				    },
					cellTemplate: 
						'<div class="ui-grid-cell-contents" style="color:red" ng-if="row.entity.displayTag === 4">'
						+ '<i class="material-icons">error_outline</i>{{row.entity.Price}}</div>'
						+ '<div class="ui-grid-cell-contents" ng-if="row.entity.displayTag === 2">'
						+ '<input style="background-color: red; color: white;" ng-input="row.entity.Price" ng-model="row.entity.Price" /></div>'
						+ '<div class="ui-grid-cell-contents" ng-if="row.entity.displayTag === 3 || row.entity.displayTag === 1">{{row.entity.Price}}</div>'
						
// cellTemplate: '<div><i class="material-icons" style="color:red"
// ng-show="!row.entity.isValidate && row.entity.noPrice">error_outline</i>'
// + '<input ng-if="row.entity.isValidate" style="background-color: red; color:
// white;" ng-input="row.entity.Price" ng-model="row.entity.Price" />'
// + '<input ng-if="!row.entity.isValidate"ng-model="row.entity.Price" />'
// + '</div>',
				},
	            {field : 'displayTag', headerCellClass: 'brown-header', enableCellEdit : false, visible : false},
	            {field : 'displayQty', headerCellClass: 'brown-header', enableCellEdit : false, visible : false},
	            {field : 'isEditable', headerCellClass: 'brown-header', enableCellEdit : false, visible : false},
	            {field : 'Multiplier', headerCellClass: 'brown-header', width : '*', enableCellEdit : false, visible : false},
				{field : 'Buyer', headerCellClass: 'brown-header', width : '*',enableCellEdit : false, enableHiding: false,
					cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
						var val = grid.getCellValue(row, col);
						if (val)
							return '';
						return 'missing';
					}
				}, 
				{field : 'Seller', headerCellClass: 'brown-header', width : '*', enableCellEdit : false, enableHiding: false,
					cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
						var val = grid.getCellValue(row, col);
						if (val)
							return '';
						return 'missing';
					}
				},
				{field : 'Group', headerCellClass: 'brown-header', width : '*'	},
			],
	// rowTemplate: '<div><div style="height: 100%; {\'background-color\': \'\'}"
	// ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by
	// col.colDef.name" class="ui-grid-cell" ng-class="{
	// \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>',
	// exporterMenuPdf : false,
		};

		$scope.gridOptions.onRegisterApi = function(gridApi) {
			$scope.gridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEdit);
		};

		$scope.afterCellEdit = function(rowEntity, coldef, newValue, oldValue) {
			var nMissLeg = 0;
			params = [];
			var multi = 0;
			var premium = $scope.myPremium;
			var side = 0;
			rowEntity.noPrice = false;
			var iRow = -1;
			
			for (i = 0; i < $scope.param_myData.length; i++) 
			{
				if ($scope.param_myData[i].Instrument === rowEntity.Instrument) {
					$scope.param_myData[i].Price = rowEntity.Price;
					iRow = i;
				}
				if (isNaN($scope.param_myData[i].Price)) {	// initially ok, 
					nMissLeg++;
				}
			}
			if (nMissLeg > 1) {	// too many missing legs
				var newLegSplits = rebuildSplit($scope.param_myData);
				$scope.myLegData = newLegSplits;
				return;
			}
			
			for (i = 0; i < $scope.param_myData.length - 2; i++) 
			{
				if (!isNaN($scope.param_myData[i].Price)) {
					params.push({
						'side' : $scope.param_myData[i].Side,
						'multiplier' : $scope.param_myData[i].Multiplier,
						'price' : $scope.param_myData[i].Price,
						'option' : $scope.param_myData[i].UL.split(' ')[1],
						'qty' : $scope.param_myData[i].Qty
					});
				} 
			}
			var iCal = $scope.param_myData.length - 2;
			multi = $scope.param_myData[iCal].Multiplier;
			var price = calRemainPrice(params, multi, premium);
			$scope.param_myData[iCal].Price = price;
			
//			if (isNaN(price) || Math.abs(price) < 0.001 || price < 0 || (price % 1 != 0)) {	// has decimal
			if (CFG.rule_check_price($scope.param_myData[0].UL, price)) {	// has decimal
				$scope.param_isLastLegPriceValid = true;
				
				for (i = 0; i < $scope.param_myData.length - 1; i++) {
					$scope.param_myData[i].displayTag = i === iCal ? CFG.DISPLAY_PRICE_NOEDIT_OK : CFG.DISPLAY_PRICE_EDIT_OK;	// Uneditable+Valid
				}
			}
			else {
				$scope.param_myData[iCal].isValidate = true;
				$scope.param_isLastLegPriceValid = false;
				$scope.param_myData[iRow].displayTag = CFG.DISPLAY_PRICE_EDIT_INVALID;	// Editable+Valid
				$scope.param_myData[iCal].displayTag = CFG.DISPLAY_PRICE_NOEDIT_INVALID;	// Uneditable+Valid
			}
			
			var newLegSplits = rebuildSplit($scope.param_myData);
			$scope.myLegData = newLegSplits;
			
			$scope.param_isShowSendBtn = ($scope.param_isQtyValid && $scope.param_isDeltaValid 
					&& $scope.param_isFutMatValid && $scope.param_isLastLegPriceValid);
			
			 $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
			 if (!$scope.$$phase) {
				 $scope.$apply();
			 }
		};
		// ========================== gridOptions end ================================
		
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
	// ====================== DialogController end ===========================

	// ====================== unit test ===============================	
	$scope.showCrossDetail_test = function(ev, trType, symbol, company, cpCompany) {
		var str = [];
 // P
 str.push('HSI JUN17 19000 P 191 TRADES REF 9850');
 // PB
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850 (10000)');
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850 (11000)');
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850 (9000)');
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17 11000/10000/9000 PFLY 191 TRADES REF 9850');
 // PC
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (10000)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (9000)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (1100)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (8000)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850 (C)');
 str.push('HSCEI JUN17 11000/10000/9000/8000 PDOR 191 TRADES REF 9850');
 // PDIAG
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850 (7000)');
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850 (9000)');
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/DEC17 7000/9000 PS 191 TRADES REF 9850');
 // PR
 str.push('HSCEI DEC17 10000/9000 1x1.5 PS 191 TRADES REF 9850 (9000)');
 str.push('HSCEI DEC17 10000/9000 1x1.5 PS 191 TRADES REF 9850 (10000)');
 str.push('HSCEI DEC17 10000/9000 1x1.5 PS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI DEC17 10000/9000 1x1.5 PS 191 TRADES REF 9850 (C)');
 str.push('HSCEI DEC17 10000/9000 1x1.5 PS 191 TRADES REF 9850');
 // PS
 str.push('HSCEI DEC17 9000/8600 PS 191 TRADES REF 9850 (8600)');
 str.push('HSCEI DEC17 9000/8600 PS 191 TRADES REF 9850 (9000)');
 str.push('HSCEI DEC17 9000/8600 PS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI DEC17 9000/8600 PS 191 TRADES REF 9850 (C)');
 str.push('HSCEI DEC17 9000/8600 PS 191 TRADES REF 9850');
 // PTB
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850 (7800)');
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17 7800 PFLY 191 TRADES REF 9850');
 // PTC
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (8000)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 8000 PDOR 191 TRADES REF 9850');
 // PL
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850 (9000)');
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850 (8000)');
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850 (10000)');
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850 (C)');
 str.push('HSCEI SEP17 10000/9000/8000 PLDR 191 TRADES REF 9850');
 // PTL
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850 (9200)');
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17 9200 PLDR 191 TRADES REF 9850');
 // PTR
 str.push('HSI DEC17/DEC18 20000 2x1 PS 191 TRADES REF 9850 (DEC17)');
 str.push('HSI DEC17/DEC18 20000 2x1 PS 191 TRADES REF 9850 (DEC18)');
 str.push('HSI DEC17/DEC18 20000 2x1 PS 191 TRADES REF 9850 (20000)');
 str.push('HSI DEC17/DEC18 20000 2x1 PS 191 TRADES REF 9850 (C)');
 str.push('HSI DEC17/DEC18 20000 2x1 PS 191 TRADES REF 9850');
 // PTS
 str.push('HSCEI JUN17/JUN19 9000 PS 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI JUN17/JUN19 9000 PS 191 TRADES REF 9850 (JUN19)');
 str.push('HSCEI JUN17/JUN19 9000 PS 191 TRADES REF 9850 (9000)');
 str.push('HSCEI JUN17/JUN19 9000 PS 191 TRADES REF 9850 (C)');
 str.push('HSCEI JUN17/JUN19 9000 PS 191 TRADES REF 9850');
		
		
 // SPRD
 str.push('HSCEI MAR17/JUN17 9800 ROLL 191 TRADES REF 9850');
 str.push('HSCEI DEC17 10400 C 191 TRADES REF 9850');
		
 str.push('HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850 (10000)');
 str.push('HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850 (9000)');
 str.push('HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850 (11000)');
 str.push('HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17 9000/10000/11000 CFLY 191 TRADES REF 9850');
		
 str.push('HSCEI JUN17 8000/9000/10000/11000 CDOR 191 TRADES REF 9850');
 // CDIAG
 str.push('HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850 (12000)');
 str.push('HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850 (12600)');
 str.push('HSCEI MAR17/DEC17 12000/12600 CS 191 TRADES REF 9850');
 // CR
 str.push('HSI SEP17 12000/13000 1x2 CS 191 TRADES REF 9850 (13000)');
 str.push('HSI SEP17 12000/13000 1x2 CS 191 TRADES REF 9850 (12000)');
 str.push('HSI SEP17 12000/13000 1x2 CS 191 TRADES REF 9850 (SEP17)');
 str.push('HSI SEP17 12000/13000 1x2 CS 191 TRADES REF 9850');
 // CS
 str.push('HSI DEC17 12000/13800 CS 191 TRADES REF 9850 (13800)');
 str.push('HSI DEC17 12000/13800 CS 191 TRADES REF 9850 (12000)');
 str.push('HSI DEC17 12000/13800 CS 191 TRADES REF 9850 (DEC17)');
 str.push('HSI DEC17 12000/13800 CS 191 TRADES REF 9850');
 // CTB
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850 (10600)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CFLY 191 TRADES REF 9850');
 // CTC
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (10000)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17/DEC17 10000 CDOR 191 TRADES REF 9850');
 // CL
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850 (10000)');
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850 (11000)');
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850 (9000)');
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850 (C)');
 str.push('HSCEI SEP17 9000/10000/11000 CLDR 191 TRADES REF 9850');
 // CTL
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850 (JUN17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850 (SEP17)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850 (10600)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/JUN17/SEP17 10600 CLDR 191 TRADES REF 9850');
 // CTR
 str.push('HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850 (10000)');
 str.push('HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/DEC17 10000 2x1 CS 191 TRADES REF 9850');
 // CTS
 str.push('HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850 (MAR17)');
 str.push('HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850 (10400)');
 str.push('HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850 (C)');
 str.push('HSCEI MAR17/DEC17 10400 CS 191 TRADES REF 9850');
 // IF
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850 (8000)');
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850 (12000)');
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850 (10000)');
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850 (C)');
 str.push('HSCEI DEC17 8000/10000/12000 IFLY 191 TRADES REF 9850');
 // IFR
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850 (8000)');
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850 (12000)');
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850 (10000)');
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850 (C)');
 str.push('HSCEI DEC17 8000/10000/12000 1x1.5x1 IFLY 191 TRADES REF 9850');
 // RR
 str.push('HSI SEP17 19000/25000 RR 191 TRADES REF 9850');
 str.push('HSI SEP17 19000/25000 RR 191 TRADES REF 9850 (SEP17)');
 str.push('HSI SEP17 19000/25000 RR 191 TRADES REF 9850 (19000)');
 str.push('HSI SEP17 19000/25000 RR 191 TRADES REF 9850 (C)');
 str.push('HSI SEP17 19000/25000 RR 191 TRADES REF 9850 (25000)');
 // SYNTH
 str.push('HSCEI DEC17 9800 SYNTH 191 TRADES REF 9850 (C)');
 str.push('HSCEI DEC17 9800 SYNTH 191 TRADES REF 9850 (DEC17)');
 str.push('HSCEI DEC17 9800 SYNTH 191 TRADES REF 9850 (9800)');
 str.push('HSCEI DEC17 9800 SYNTH 191 TRADES REF 9850');
 // SD
 str.push('HSI DEC18 23000 STRD 191 TRADES REF 9850 (DEC18)');
 str.push('HSI DEC18 23000 STRD 191 TRADES REF 9850 (23000)');
 str.push('HSI DEC18 23000 STRD 191 TRADES REF 9850 (C)');
 str.push('HSI DEC18 23000 STRD 191 TRADES REF 9850');
		// SDTS
		str.push('HSCEI MAR17/DEC17 10000 STRD 191 TRADES REF 9850 (MAR17)');
		str.push('HSCEI MAR17/DEC17 10000 STRD 191 TRADES REF 9850 (DEC17)');
		str.push('HSCEI MAR17/DEC17 10000 STRD 191 TRADES REF 9850 (10000)');
		str.push('HSCEI MAR17/DEC17 10000 STRD 191 TRADES REF 9850 (C)');
		str.push('HSCEI MAR17/DEC17 10000 STRD 191 TRADES REF 9850');
		// SG
		str.push('HSCEI DEC17 8000/12000 STRG 191 TRADES REF 9850 (DEC17)');
		str.push('HSCEI DEC17 8000/12000 STRG 191 TRADES REF 9850 (8000)');
		str.push('HSCEI DEC17 8000/12000 STRG 191 TRADES REF 9850 (12000)');
		str.push('HSCEI DEC17 8000/12000 STRG 191 TRADES REF 9850 (C)');
		str.push('HSCEI DEC17 8000/12000 STRG 191 TRADES REF 9850');
		
		
		var res = [];
 res.push(['HSI','JUN17','19000','1','P',191,9850]);
		
 res.push(['HSCEI','MAR17','11000/10000/9000','-1X2X-1','PB',191,9850]);
 res.push(['HSCEI','MAR17','11000/10000/9000','1X-2X1','PB',191,9850]);
 res.push(['HSCEI','MAR17','11000/10000/9000','1X-2X1','PB',191,9850]);
 res.push(['HSCEI','MAR17','11000/10000/9000','1X-2X1','PB',191,9850]);
 res.push(['HSCEI','MAR17','11000/10000/9000','1X-2X1','PB',191,9850]);
 res.push(['HSCEI','MAR17','11000/10000/9000','1X-2X1','PB',191,9850]);
		
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','-1X1X1X-1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','-1X1X1X-1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','1X-1X-1X1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','1X-1X-1X1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','1X-1X-1X1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','1X-1X-1X1','PC',191,9850]);
 res.push(['HSCEI','JUN17','11000/10000/9000/8000','1X-1X-1X1','PC',191,9850]);
		
 res.push(['HSCEI','MAR17/DEC17','7000/9000','1X-1','PDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','7000/9000','1X-1','PDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','7000/9000','-1X1','PDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','7000/9000','-1X1','PDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','7000/9000','-1X1','PDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','7000/9000','-1X1','PDIAG',191,9850]);
		
 res.push(['HSCEI','DEC17','10000/9000','-1X1.5','PR',191,9850]);
 res.push(['HSCEI','DEC17','10000/9000','1X-1.5','PR',191,9850]);
 res.push(['HSCEI','DEC17','10000/9000','1X-1.5','PR',191,9850]);
 res.push(['HSCEI','DEC17','10000/9000','1X-1.5','PR',191,9850]);
 res.push(['HSCEI','DEC17','10000/9000','1X-1.5','PR',191,9850]);
		
 res.push(['HSCEI','DEC17','9000/8600','-1X1','PS',191,9850]);
 res.push(['HSCEI','DEC17','9000/8600','1X-1','PS',191,9850]);
 res.push(['HSCEI','DEC17','9000/8600','1X-1','PS',191,9850]);
 res.push(['HSCEI','DEC17','9000/8600','1X-1','PS',191,9850]);
 res.push(['HSCEI','DEC17','9000/8600','1X-1','PS',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','-1X2X-1','PTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','1X-2X1','PTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','1X-2X1','PTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','1X-2X1','PTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','1X-2X1','PTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','7800','1X-2X1','PTB',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','-1X1X1X-1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','-1X1X1X-1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','1X-1X-1X1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','1X-1X-1X1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','1X-1X-1X1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','1X-1X-1X1','PTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','8000','1X-1X-1X1','PTC',191,9850]);
		
 res.push(['HSCEI','SEP17','10000/9000/8000','-1X1X1','PL',191,9850]);
 res.push(['HSCEI','SEP17','10000/9000/8000','-1X1X1','PL',191,9850]);
 res.push(['HSCEI','SEP17','10000/9000/8000','1X-1X-1','PL',191,9850]);
 res.push(['HSCEI','SEP17','10000/9000/8000','1X-1X-1','PL',191,9850]);
 res.push(['HSCEI','SEP17','10000/9000/8000','1X-1X-1','PL',191,9850]);
 res.push(['HSCEI','SEP17','10000/9000/8000','1X-1X-1','PL',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','1X1X-1','PTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','1X1X-1','PTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','-1X-1X1','PTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','-1X-1X1','PTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','-1X-1X1','PTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','9200','-1X-1X1','PTL',191,9850]);
		
 res.push(['HSI','DEC17/DEC18','20000','2X-1','PTR',191,9850]);
 res.push(['HSI','DEC17/DEC18','20000','-2X1','PTR',191,9850]);
 res.push(['HSI','DEC17/DEC18','20000','-2X1','PTR',191,9850]);
 res.push(['HSI','DEC17/DEC18','20000','-2X1','PTR',191,9850]);
 res.push(['HSI','DEC17/DEC18','20000','-2X1','PTR',191,9850]);
		
 res.push(['HSCEI','JUN17/JUN19','9000','1X-1','PTS',191,9850]);
 res.push(['HSCEI','JUN17/JUN19','9000','-1X1','PTS',191,9850]);
 res.push(['HSCEI','JUN17/JUN19','9000','-1X1','PTS',191,9850]);
 res.push(['HSCEI','JUN17/JUN19','9000','-1X1','PTS',191,9850]);
 res.push(['HSCEI','JUN17/JUN19','9000','-1X1','PTS',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17','9800','-1X1X1X-1','SPRD',191,9850]);
 res.push(['HSCEI','DEC17','10400','1','C',191,9850]);
		
 res.push(['HSCEI','MAR17','9000/10000/11000','-1X2X-1','CB',191,9850]);
 res.push(['HSCEI','MAR17','9000/10000/11000','1X-2X1','CB',191,9850]);
 res.push(['HSCEI','MAR17','9000/10000/11000','1X-2X1','CB',191,9850]);
 res.push(['HSCEI','MAR17','9000/10000/11000','1X-2X1','CB',191,9850]);
 res.push(['HSCEI','MAR17','9000/10000/11000','1X-2X1','CB',191,9850]);
		
 res.push(['HSCEI','JUN17','8000/9000/10000/11000','1X-1X-1X1','CC',191,9850]);

 res.push(['HSCEI','MAR17/DEC17','12000/12600','1X-1','CDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','12000/12600','1X-1','CDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','12000/12600','-1X1','CDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','12000/12600','-1X1','CDIAG',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','12000/12600','-1X1','CDIAG',191,9850]);
		
 res.push(['HSI','SEP17','12000/13000','-1X2','CR',191,9850]);
 res.push(['HSI','SEP17','12000/13000','1X-2','CR',191,9850]);
 res.push(['HSI','SEP17','12000/13000','1X-2','CR',191,9850]);
 res.push(['HSI','SEP17','12000/13000','1X-2','CR',191,9850]);
		
 res.push(['HSI','DEC17','12000/13800','-1X1','CS',191,9850]);
 res.push(['HSI','DEC17','12000/13800','1X-1','CS',191,9850]);
 res.push(['HSI','DEC17','12000/13800','1X-1','CS',191,9850]);
 res.push(['HSI','DEC17','12000/13800','1X-1','CS',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','-1X2X-1','CTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X-2X1','CTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X-2X1','CTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X-2X1','CTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X-2X1','CTB',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X-2X1','CTB',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','-1X1X1X-1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','-1X1X1X-1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','1X-1X-1X1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','1X-1X-1X1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','1X-1X-1X1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','1X-1X-1X1','CTC',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17/DEC17','10000','1X-1X-1X1','CTC',191,9850]);
		
 res.push(['HSCEI','SEP17','9000/10000/11000','-1X1X1','CL',191,9850]);
 res.push(['HSCEI','SEP17','9000/10000/11000','-1X1X1','CL',191,9850]);
 res.push(['HSCEI','SEP17','9000/10000/11000','1X-1X-1','CL',191,9850]);
 res.push(['HSCEI','SEP17','9000/10000/11000','1X-1X-1','CL',191,9850]);
 res.push(['HSCEI','SEP17','9000/10000/11000','1X-1X-1','CL',191,9850]);
 res.push(['HSCEI','SEP17','9000/10000/11000','1X-1X-1','CL',191,9850]);
		
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X1X-1','CTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','1X1X-1','CTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','-1X-1X1','CTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','-1X-1X1','CTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','-1X-1X1','CTL',191,9850]);
 res.push(['HSCEI','MAR17/JUN17/SEP17','10600','-1X-1X1','CTL',191,9850]);
		
 res.push(['HSCEI','MAR17/DEC17','10000','2X-1','CTR',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10000','-2X1','CTR',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10000','-2X1','CTR',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10000','-2X1','CTR',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10000','-2X1','CTR',191,9850]);
		
 res.push(['HSCEI','MAR17/DEC17','10400','1X-1','CTS',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10400','-1X1','CTS',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10400','-1X1','CTS',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10400','-1X1','CTS',191,9850]);
 res.push(['HSCEI','MAR17/DEC17','10400','-1X1','CTS',191,9850]);
		
 res.push(['HSCEI','DEC17','8000/10000/12000','1X-1X-1X1','IF',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','1X-1X-1X1','IF',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1X1X-1','IF',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1X1X-1','IF',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1X1X-1','IF',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1X1X-1','IF',191,9850]);
		
 res.push(['HSCEI','DEC17','8000/10000/12000','1X-1.5X-1.5X1','IFR',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','1X-1.5X-1.5X1','IFR',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1.5X1.5X-1','IFR',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1.5X1.5X-1','IFR',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1.5X1.5X-1','IFR',191,9850]);
 res.push(['HSCEI','DEC17','8000/10000/12000','-1X1.5X1.5X-1','IFR',191,9850]);
		
 res.push(['HSI','SEP17','19000/25000','1X-1','RR',191,9850]);
 res.push(['HSI','SEP17','19000/25000','1X-1','RR',191,9850]);
 res.push(['HSI','SEP17','19000/25000','1X-1','RR',191,9850]);
 res.push(['HSI','SEP17','19000/25000','-1X1','RR',191,9850]);
 res.push(['HSI','SEP17','19000/25000','-1X1','RR',191,9850]);
		
 res.push(['HSCEI','DEC17','9800','-1X1','SYNTH',191,9850]);
 res.push(['HSCEI','DEC17','9800','1X-1','SYNTH',191,9850]);
 res.push(['HSCEI','DEC17','9800','1X-1','SYNTH',191,9850]);
 res.push(['HSCEI','DEC17','9800','1X-1','SYNTH',191,9850]);
		
 res.push(['HSI','DEC18','23000','1X1','SD',191,9850]);
 res.push(['HSI','DEC18','23000','1X1','SD',191,9850]);
 res.push(['HSI','DEC18','23000','1X1','SD',191,9850]);
 res.push(['HSI','DEC18','23000','1X1','SD',191,9850]);
		
		res.push(['HSCEI','MAR17/DEC17','10000','1X1X-1X-1','SDTS',191,9850]);
		res.push(['HSCEI','MAR17/DEC17','10000','-1X-1X1X1','SDTS',191,9850]);
		res.push(['HSCEI','MAR17/DEC17','10000','-1X-1X1X1','SDTS',191,9850]);
		res.push(['HSCEI','MAR17/DEC17','10000','-1X-1X1X1','SDTS',191,9850]);
		res.push(['HSCEI','MAR17/DEC17','10000','-1X-1X1X1','SDTS',191,9850]);
		
		res.push(['HSCEI','DEC17','8000/12000','1X1','SG',191,9850]);
		res.push(['HSCEI','DEC17','8000/12000','1X1','SG',191,9850]);
		res.push(['HSCEI','DEC17','8000/12000','1X1','SG',191,9850]);
		res.push(['HSCEI','DEC17','8000/12000','1X1','SG',191,9850]);
		res.push(['HSCEI','DEC17','8000/12000','1X1','SG',191,9850]);


		for (var i=0; i<str.length; i++) {
			var isCorrect = true;
			var s = str[i].replace(/ +(?= )/g,'');
			try {
			var tokens = parseSymbol(s);
			var myInstr = tokens[0];
			var myExpiry = tokens[1];
			var myStrike = tokens[2];
			var myMultiplier = tokens[3];
			var myStrat = tokens[4];
			var myPremium = Number(tokens[5]);
			var myRef = Number(tokens[6].replace(',', ''));
			var val = res[i];
			if (val[0] !== myInstr) {
				alert(s + ',' + myInstr + ',' + val[0]);
			}
			else if (val[1] !== myExpiry) {
				alert(s + ',myExpiry=' + myExpiry + ',' + val[1]);
			}
			else if (val[2] !== myStrike) {
				alert(s + ',myStrike=' + myStrike + ',' + val[2]);
			}
			else if (val[3] !== myMultiplier) {
				alert(s + ',myMultiplier=' + myMultiplier + ',' + val[3]);
			}
			else if (val[4] !== myStrat) {
				alert(s + ',myStrat=' + myStrat + ',' + val[4]);
			}
			else if (val[5] !== myPremium) {
				alert(s + ',myPremium=' + myPremium + ',' + val[5]);
			}
			else if (val[6] !== myRef) {
				alert(s + ',myRef=' + myRef + ',' + val[6]);
			}
			else {
// alert(s + 'OK');
			}
			}catch (err) {
				alert(err.message);
			}
		}
	};
}]);

// ========================================= tools =========================================
function calRemainPrice(params, myMultiplier, myPremium) {
	sum = 0;
	for (var i=0; i<params.length; i++) 
	{
// var sign = params[i].side === 'Sell' ? -1 : 1;
		sum += Number(params[i].price) * Number(params[i].multiplier);
	}
// var mySign = mySide === 'Sell' ? -1 : 1;
	return (myPremium - sum) / (myMultiplier);
}

function getMonthFromString(mmmyy){
   var d = Date.parse(mmmyy.substring(0,3) + "1, 20" + mmmyy.substring(3,5));
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
// var d = new Date(futExp);
// var m = d.getMonth();
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
	case 'CTC': // - European Call Time Condor':
	case 'PC': // European Put Condor':
	case 'PTC': // - European Put Time Condor':
		return '1X-1X-1X1';
	case 'CDIAG': // ECDIAG - European Call Diagonal':
	case 'PDIAG': // ECDIAG - European Put Diagonal':
	case 'CTS': // - European Call Time Spread':
	case 'PTS': // - European Put Time Spread':
	case 'CTR - European Call Time Ratio':
	case 'PTR - European Put Time Ratio':
		return '-1X1';
	case 'CL': // - European Call Ladder':
	case 'PL': // - European Put Ladder':
		return '1X-1X-1';
	case 'CTL': // - European Call Time Ladder':
	case 'PTL': // - European Put Time Ladder':
		return '-1X-1X1';
	case 'CR': // - European Call Ratio':
	case 'PR': // - European Put Ratio':
	case 'CS':
	case 'PS':
		return '1X-1';
	case 'CTB': // - European Call Time Butterfly':
	case 'CFLY':  // butterfly
	case 'CB':  // 'ECB - European Call Butterfly':
	case 'PB':  // 'ECB - European Call Butterfly':
	case 'PTB': // - European Call Time Butterfly':
	case 'PFLY':  // butterfly
		return '1X-2X1';
	case 'IF': // - European Iron Fly':
	case 'IFR': // - European Iron Fly Ratio':
		return '-1X1X1X-1';
	case 'RR': // - European Risk Reversal':
// case 'S':// - European Synthetic Call Over': // special reverse of 'SPO' -> S
// case 'SPO':// - European Synthetic Put Over':
	case 'SYNTH':
		return '1X-1';
	case 'SD': // - European Straddle':
		return '1X1';
	case 'SDTS': // - European Straddle Time Spread':
		return '-1X-1X1X1';
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
	case 'SPRD' : // - Spread':
		return '-1X1X1X-1';
		break;
	default:
		alert('no matching deriv type: ' + deriv);
		break;
	}
}

function getMultiplier(unsignedTerm, strat) {
	var tokens = unsignedTerm.split('X');
	switch (strat) {
	case 'C': // European Call
	case 'P': // European Put
		return tokens[0];
	case 'CC': // - European Call Condor':
	case 'CTC': // - European Call Time Condor':
	case 'CDOR': // European Call Condor':
	case 'PC': // European Put Condor':
	case 'PDOR': // European Put Condor':
	case 'PTC': // - European Put Time Condor':
		return tokens[0] + 'X-' + tokens[1] + 'X-' + tokens[2] + 'X' + tokens[3];
	case 'CL': // - European Call Ladder':
	case 'PL': // - European Put Ladder':
		return tokens[0] + 'X-' + tokens[1] + 'X-' + tokens[1];
// return '1X1X1';
	case 'CTL': // - European Call Time Ladder':
	case 'PTL': // - European Put Time Ladder':
		return '-' + tokens[0] + 'X-' + tokens[1] + 'X' + tokens[1];
	case 'CR': // - European Call Ratio':
	case 'CS':
	case 'PR': // - European Put Ratio':
	case 'PS': // put spread
	case 'RR': // - European Risk Reversal':
// case 'SPO':// - European Synthetic Put Over':
	case 'SYNTH':// - European Synthetic Put Over':
		return tokens[0] + 'X-' + tokens[1];
	case 'CTR' : // European Call Time Ratio':
	case 'CTS': // - European Call Time Spread':
	case 'CDIAG': // ECDIAG - European Call Diagonal':
	case 'PTR' : // - European Put Time Ratio':
	case 'PTS': // - European Put Time Spread':
	case 'PDIAG':
// case 'S':// - European Synthetic Call Over':
		return '-' + tokens[0] + 'X' + tokens[1];
	case 'CTB': // - European Call Time Butterfly':
	case 'CFLY':  // butterfly
	case 'CB':  // 'ECB - European Call Butterfly':
	case 'PB':  // 'ECB - European Call Butterfly':
	case 'PTB': // - European Call Time Butterfly':
	case 'PFLY':  // butterfly
		return tokens[0] + 'X-' + tokens[1] + 'X' + tokens[2];
	case 'IF': // - European Iron Fly':
	case 'IFR': // - European Iron Fly Ratio':
		return '-' + tokens[0] + 'X' + tokens[1] + 'X' + tokens[1] + 'X-' + tokens[2];
	case 'SD': // - European Straddle':
	case 'SG': // - European Strangle':
		return tokens[0] + 'X' + tokens[1];
	case 'SDTS': // - European Straddle Time Spread':
		return '-' + tokens[0] + 'X-' + tokens[1] + 'X' + tokens[2] + 'X' + tokens[3];
	case 'SPRD': // - Spread':
		return '-' + tokens[0] + 'X' + tokens[1] + 'X' + tokens[2] + 'X-' + tokens[3];
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

	default:
		alert('no matching deriv type: ' + deriv);
	break;
	}
}

function getMultiple(signedTerm, strat) {
	var multi = [];
	var tokens = [];
	
	if (signedTerm.indexOf('X') > 0) {
		tokens = signedTerm.split('X');
	} else {
		var t = getDefaultMultiplier(strat);
		tokens = t.split('X');
	}
	
	for (j = 0; j < tokens.length; j++) {
		multi.push(tokens[j]);
	}
	return multi;
}

function getSides(term, thisSide) {
	var multi = [];
	var otherSide = thisSide == SIDE.BUY ? SIDE.SELL : SIDE.BUY;
	if (term.indexOf('X') > 0) {
		var tokens = term.split('X');
		for (j = 0; j < tokens.length; j++) {
			if (Number(tokens[j]) > 0)
				multi.push(thisSide);
			else 
				multi.push(otherSide);	
		}
	} 
	else {	// single leg
		multi.push(thisSide);
	}
	return multi;
}

function getSidesByParty(term, buyer, seller) {
	var multi = [];
	if (term.indexOf('X') > 0) {
		var tokens = term.split('X');
		for (j = 0; j < tokens.length; j++) {
			if (Number(tokens[j]) > 0)
				multi.push([buyer, seller]);
			else
				multi.push([seller, buyer]);
		}
	} 
	else {	// single leg
		multi.push([buyer, seller]);
	}
	return multi;
}

function getMaturities(term, sExpiry, strat) {
	var ary = [];
	
	var legs = term.split('X');
	var mat = sExpiry.split('/');
	
	switch (strat) {
		case 'SPRD': 
		case 'SDTS': {
			ary.push(mat[0]);
			ary.push(mat[0]);
			ary.push(mat[1]);
			ary.push(mat[1]);
			break;
		}
		default: {
			if (sExpiry.indexOf('/') > 0) {
				for (var i=0; i<mat.length; i++) {
					ary.push(mat[i]);
				}	
			}
			else {
				for (var i=0; i<legs.length; i++) {
					ary.push(sExpiry);
				}
			}
			break;
		}
	}
	return ary;
}

function getStrikes(term, sStrike, strat) {
	var ary = [];
	
	var legs = term.split('X');
	var strikes = sStrike.split('/');
	
	switch (strat) {
		case 'IF':
		case 'IFR': {
			ary.push(strikes[0]);
			ary.push(strikes[1]);
			ary.push(strikes[1]);
			ary.push(strikes[2]);
			break;
		}
		default: {
			if (sStrike.indexOf('/') > 0) {
				for (var i=0; i<strikes.length; i++) {
					ary.push(strikes[i]);
				}	
			}
			else {
				for (var i=0; i<legs.length; i++) {
					ary.push(sStrike);
				}
			}
		break;
		}
	}
	return ary;
}

function deduceStrat(common_strat, is_n_expiry, is_n_strike, is_n_multiplier, hasReverse) {
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
// case 'SYNTH' : {
// if (hasReverse)
// return 'S';
// else
// return 'SPO';
// }
	case 'STRD' : {
		if (is_n_expiry)
			return 'SDTS';
		else 
			return 'SD';
	}
	case 'ROLL' : {
		return 'SPRD';
	}
	case 'STRG' : {
		return 'SG';
	}
	default:
		return common_strat;
	}
}

function isLegNegative(items, multipliers, sReverse) {
	if (items.length <= 1)
		return false;
	
	for (var i=0; i<items.length; i++) {
		if (sReverse === items[i] && Number(multipliers[i]) < 0)
			return true;
	}
	return false;
}

function deduceReverse(common_strat, expiry, strike, multiplier, sReverse) {
	try {
		switch (common_strat) {
		case 'CDOR' : 
		case 'CFLY' : 
		case 'CLDR' :
		case 'CS' :
		case 'PDOR' : 
		case 'PFLY' : 
		case 'PLDR' : 
		case 'PS' :
		case 'ROLL' : 
		case 'STRG' : {
			var strikes = strike.split('/');
			var multipliers = multiplier.split('X');
			var isNeg = isLegNegative(strikes, multipliers, sReverse);
			if (isNeg)
				return true;
			var expiries = expiry.split('/');
			var isNeg = isLegNegative(expiries, multipliers, sReverse);
			if (isNeg)
				return true;
			break;
		}
		case 'STRD' : {
			var expiries = expiry.split('/');
			// negative legs
			if (expiries.length > 1 && sReverse === expiries[0])
				return true;
			break;
		}
		case 'IFLY' : {
			var strikes = strike.split('/');
			// negative legs
			if (sReverse === strikes[0] || sReverse === strikes[2])
				return true;
			break;
		}
		case 'RR' :
		case 'SYNTH': 
		{
			var strikes = strike.split('/');
			var multipliers = multiplier.split('X');
			var isNeg = isLegNegative(strikes, multipliers, sReverse);
			if (isNeg)
				return true;
			var expiries = expiry.split('/');
			var isNeg = isLegNegative(expiries, multipliers, sReverse);
			if (isNeg)
				return true;
			if (sReverse === 'C')
				return true;
			break;
		}
		default: {
			return false;
		}
	}
	}
	catch (err) {
		alert('deduceReverse error: ' + err.message);
	}
	return false;
}

function parseSymbol(mySymbol) 
{
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
	var common_strat;
	
	var multi = [];
	for (j = 0; j < MAX; j++) {
		multi[j] = 1;
	}

	var tokens = mySymbol.toUpperCase().split(' ');
	var i = 0;
// multi[0] = tokens[i++]; // UL
	ul = tokens[0];	// UL , i = 0
	
	var isReverse = false;
	var hasReverseSign = mySymbol.indexOf('(') >=0 && mySymbol.indexOf(')') > 0;
	
	expiry = tokens[1];	// Expiry , i = 1
	var is_n_expiry = false;
	if (expiry.split('/').length > 1) {
		is_n_expiry = true;
	}
	
	strike = tokens[2];	// strike, i=2
	var is_n_strike = false;
	if (strike.split('/').length > 1) {
		is_n_strike = true;
	}
	
	// multiple specified i = 3
	if (tokens[3].indexOf('X') > -1
			&& tokens[3].match(/^[0-9]+/)) 
	{
		common_strat = tokens[4];	// i = 4
		strat = deduceStrat(common_strat, is_n_expiry, is_n_strike, true, hasReverseSign);
		multiplier = getMultiplier(tokens[3], strat);	// ( multiplier ) // i =
														// 3
		i = 5;
	} else {
		// default
		common_strat = tokens[3];	// i = 3
		strat = deduceStrat(common_strat, is_n_expiry, is_n_strike, false, hasReverseSign);
		multiplier = getDefaultMultiplier(strat);
		i = 4;
	}
	
	multi[0] = ul;
	multi[1] = expiry;
	multi[2] = strike;

	j = 5;
	while (i < tokens.length) {
		value = tokens[i++];
		if (value === 'TRADES' || value === 'REF' || value === 'DELTA') {
		} 
		else if ((value.indexOf('(') >=0) && (value.indexOf(')') > 0)) {
			var sReverse = value.replace('(','').replace(')','').toUpperCase();
			isReverse = deduceReverse(common_strat, expiry, strike, multiplier, sReverse);
		}
		else {
			if (j < MAX)
				multi[j++] = value;
			else {
				alert('unexpected: ' + value);
			}
		}
	}
	multi[3] = isReverse ? reverse(multiplier) : multiplier;
	multi[4] = strat;
	
	return multi;
}

function reverse(multiplier) {
	var tokens = multiplier.split('X');
	var new_tokens = [];
	var str = "";
	for (var i=0; i<tokens.length; i++) {
		str += (Number(tokens[i]) * -1) + "X";
	}
	s = str.substring(0, str.length-1);
	return s;
}

function fill(data, array, qty, isFirstLeg, groupId) {
	var displayQty = CFG.DISPLAY_QTY_INVALID;	// red
	if (CFG.rule_check_qty(data.UL, qty))
		displayQty = 1; // no problem
	array.push({'UL' : data.UL, 'Instrument' : data.Instrument, 'Expiry' : data.Expiry, 
		'Strike' : data.Strike, 'Qty' : qty, 'Price': data.Price,
		'Buyer': data.Buyer, 'Seller': data.Seller, 'Multiplier': data.Multiplier, 
		'isEditable' : !isFirstLeg ? false: data.isEditable,
		// keep the first leg price editable
		'displayTag' : (data.displayTag === CFG.DISPLAY_PRICE_EDIT_INVALID
				&& !isFirstLeg) ? 1 : data.displayTag,
		'displayQty' : data.displayQty,
		'isLastLeg' : data.isLastLeg,		
		'isHide' : data.isHide,
		'isSingle' : data.isSingle,
		'displayQty' : displayQty,
		'isFirstSplit' : isFirstLeg,
		'Group' : groupId,
		});
}

function rebuildSplit(param_myData) 
{
	var newLegData = [];
	var maxQty = 0;
	var maxQtyIdx = 0;
	var groupId = [];	// to count the number leg split
	
	for (var i=0; i<param_myData.length; i++) 
	{
		groupId.push(1);
		
		var legQty = param_myData[i].Qty;
		
		if (maxQty < legQty) {
			maxQty = legQty;
			maxQtyIdx = i;
		}
//		accumQty += legQty;
		
		var isFirstLeg = true;
		var count = 1;
		while (legQty > 1000) {
			legQty -= 1000;
			fill(param_myData[i], newLegData, CFG.max_leg_qty(param_myData[0].UL), isFirstLeg, groupId[i]);
			isFirstLeg = false;
			groupId[i]++;
		} 
		fill(param_myData[i], newLegData, legQty, isFirstLeg, groupId[i]);
	}
//	if (accumQty < 100) {
	// change only the first appear max_qty
	if (maxQty < CFG.min_qty(param_myData[0].UL) 
			&& newLegData[maxQtyIdx].displayQty === CFG.DISPLAY_QTY_OK) {
		newLegData[maxQtyIdx].displayQty = CFG.DISPLAY_QTY_ROUND_TO_MAX;
	}
	return newLegData;
}

//
// function calRemainPrice(params, myMultiplier, mySide, myPremium) {
// sum = 0;
// for (i=0; i<params.length; i++)
// {
// var sign = params[i].side === 'Sell' ? -1 : 1;
// sum += Number(params[i].price) * sign * Number(params[i].multiplier);
// }
// var mySign = mySide === 'Sell' ? -1 : 1;
// return (myPremium - sum) / (myMultiplier * mySign);
// }

// function hedgeSide(params) {
// sum = 0;
// for (i=0; i<params.length; i++)
// {
// var qty = Number(params[i].qty);
// if ((params[i].side === SIDE.BUY && params[i].option === 'Put') ||
// (params[i].side === SIDE.SELL && params[i].option === 'Call'))
// sum += -1 * qty;
// else
// sum += qty;
// }
// if (sum > 0) {
// return SIDE.SELL;
// }
// return SIDE.BUY;
// }
