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

app.factory('socket', function (socketFactory) {
	 return socketFactory();
	}).
	value('version', '0.1');

app.controller('AppCtrl', ['$scope', '$http', '$mdDialog', 
	'uiGridConstants', 'socket', '$templateCache', 
	function($scope, $http
			, $mdDialog 
		,uiGridConstants, socket, $templateCache
		) {
	
//    $scope.clients = {};

//    $scope.mySide = "Buy";

//    $scope.mySymbol = 'HSCEI JUN17 9000/7000 1x1.5 PS 191 TRADES REF 9850 DELTA 28';
//    $scope.mySymbol = 'HSI DEC17 22000/24000 1x1.25 CR 10 TRADES REF 22,825';
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
    
//    $scope.myType = 'EC - European Call';
    
//    // RESET when enter controller
//	$scope.param_isShowSendBtn = false;	// display send button
//	$scope.param_isQtyValid = false;
//	$scope.param_isDeltaValid = false;
//	$scope.param_isFutMatValid = false;
//	$scope.param_isLastLegPriceValid = false;
//	$scope.param_myData = [];
//	$scope.myQty = '';
//	$scope.myDelta = '';
//	$scope.myFutMat = '';
	
    socket.on('send:message', function (data) {
//        $scope.message = data.id + ',' + data.refId + ',' + data.status;
        var refId = Number(data.message.RefId);
        var id = Number(data.message.Id);
        for (i=0; i<$scope.myOtData.length; i++) {
        	if ($scope.myOtData[i].RefId === refId) {
        		$scope.myOtData[i].Id = id;
        		$scope.myOtData[i].Status = data.message.Status;
        		break;
        	}
        }
        $scope.otGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    });
	
	if (!$scope.isInit) {
		
		$scope.iconTemplate = '<i class="material-icons" style="color:red">error_outline</i>';
//		$scope.iconTemplate = '<i class="material-icons" style="color:red" ng-show="!grid.appScope.param_isFutMatValid">error_outline</i>';
		
	    // cross detail scope data
	    $scope.trTypes = [
	    	'T1 - Single Trade Report',
	    	'T2 - Combo Trade Report',
	    	'T4 - Interbank Trade Report',
	    	];
	    $scope.myTrType = 'T2 - Combo Trade Report',
	    $scope.mySymbol = 'HSI DEC17 22000/24000 1x1.25 CR 10 TRADES REF 22,825';
	    
	    $scope.myOtData = [];
	    $scope.sides = [SIDE.BUY, SIDE.SELL];
//		$scope.myInstr = '';
//		$scope.myExpiry = '';
//		$scope.myStrike = '';
//		$scope.myMultiplier = '';
//		$scope.myStrat = '';
//		$scope.myPremium = '';
//		$scope.myRef = '';
//		$scope.myUl  = '';
	    
	    
	    // RESET when enter controller
		$scope.param_isShowSendBtn = false;	// display send button
		$scope.param_isQtyValid = false;
		$scope.param_isDeltaValid = false;
		$scope.param_isFutMatValid = false;
		$scope.param_isLastLegPriceValid = false;
		$scope.param_myData = [];
		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
		
		$scope.status = '  ';
		$scope.myCompany = 'HKCEL';
		$scope.myCpCompany = 'HKTOM';

		$scope.myEnv = "TESTING";
		
		$http.get('api/getTradeReport').then(function(result) {
//			console.log(result);
			v = result.data.data;
			for (i=0; i<v.length; i++) {
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
						'legs': v[i].legs,
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
	                'data': data.legs
		        }
				$scope.myOtData.unshift(data);
			}
		});
	}
	$scope.isInit = true;
	
	$scope.cancel = function($event) {
		
//		$scope.param_isShowSendBtn = false;	// display send button
//		$scope.param_isQtyValid = false;
//		$scope.param_isDeltaValid = false;
//		$scope.param_isFutMatValid = false;
//		$scope.param_isLastLegPriceValid = false;
//		
		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
//		
//		$scope.param_myData = [];
		
		$mdDialog.cancel();
	}
	
	$scope.showCrossDetail = function(ev, trType, symbol, company, cpCompany) 
	{

		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
//		$scope.myDelta = 20;
//		$scope.myQty = 100;
//		$scope.myFutMat = 'MAR17'; 
		
		var tokens = parseSymbol(symbol);
		$scope.myInstr = tokens[0];
		$scope.myExpiry = tokens[1];
		$scope.myStrike = tokens[2];
		$scope.myMultiplier = tokens[3];
		$scope.myStrat = tokens[4];
		$scope.myPremium = Number(tokens[5]);
		$scope.myRef = Number(tokens[6].replace(',', ''));
		$scope.myCompany = company;
		$scope.myCpCompany = cpCompany;
		$scope.mySymbol = symbol;
		$scope.myTrType = trType;
//		$scope.mySide = !side ? SIDE.BUY : side;
		$scope.myUl  = $scope.myInstr;
		
		$scope.param_isShowSendBtn = false;	// display send button
		$scope.param_isQtyValid = false;
		$scope.param_isDeltaValid = false;
		$scope.param_isFutMatValid = false;
		$scope.param_isLastLegPriceValid = false;
		
		var myQty = qty;
		$scope.param_myData = [];
		var strat = $scope.myStrat;
		var qty = [];
		var ul = [];

//		var expiry = $scope.myExpiry;
		var strike = $scope.myStrike;
		var multiplier = $scope.myMultiplier;
		var ref = Number($scope.myRef);
//		var sides = getSides($scope.myMultiplier, $scope.mySide);
		var sides = getSidesByParty($scope.myMultiplier, $scope.myCompany, $scope.myCpCompany);
		var instr = tokens[0];
		var futExp = '';

		var multi = getMultiple(multiplier, strat);
		var strikes = getStrikes(multiplier, tokens[2], strat);
		
//		var expiry = tokens[1];
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
				{ icon: $scope.iconTemplate, name: 'Choose...', ticked: true , disabled: true },
//			    { icon: "<img src=[..]/internet_explorer.png.. />",   name: "Internet Explorer",  maker: "(Microsoft)",             ticked: false },
//			    { icon: '<img src="https://cdn1.iconfinder.com/data/icons/humano2/32x32/apps/firefox-icon.png" />',        
//			    	name: "Firefox",            maker: "(Mozilla Foundation)",    ticked: false  },
//			    { icon: "<img src=[..]/safari_browser.png.. />",      name: "Safari",             maker: "(Apple)",                 ticked: false },
//			    { icon: "<img src=[..]/chrome.png.. />",              name: "Chrome",             maker: "(Google)",                ticked: true  }
			], 
			'outputBrowsers' : [],
			},
		];
		
		switch (strat) {
		case 'C': { // 'EC - European Call':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Buyer': sides[0][0], 'Seller': sides[0][1], 'Multiplier' : Number(multi[0]), 
				'noPrice' : true, 'isValidate' : false, 'isEditable' : false
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 'Price' : ref, 'Multiplier' : 0, 
				'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			$scope.param_isLastLegPriceValid = true;
			break;
		}
		// put strategy
		case 'P' : { // - European Put': {
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Buyer': sides[0][0], 'Seller': sides[0][1],	
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : false
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '',	 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1],
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '',
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;			
		}
		case 'PL':  //'EPL - European Put Ladder':
		case 'PTL' : // - European Put Time Ladder':
		case 'PFLY':  // butterfly
		case 'PB':  // 'EPB - European Put Butterfly':
		case 'PTB': { // 'EPTB - European Put Time Butterfly':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1], 
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false,  'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 
				'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'PC': 
		case 'PDOR': //'EPC - European Put Condor':
		case 'PTC': {//'EPC - European Put Time Condor':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'P', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1], 
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1], 
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1], 
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1], 
				'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : '', 'Strike' : '', 'Qty' : '',
//				'Buyer': sides[0][0], 'Seller': sides[0][1],
//				'Buyer': sides[1][0], 'Seller': sides[1][1],
//				'Buyer': sides[2][0], 'Seller': sides[2][1],
//				'Buyer': sides[3][0], 'Seller': sides[3][1],
				'Buyer': '', 'Seller': '',
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1],
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1],
				'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'SG' :  //} - European Strangle':
		case 'RR' :  {// - European Risk Reversal':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'SD':  //} - European Straddle':
		case 'S' :  // - European Synthetic Call Over':
		case 'SPO': { // - European Synthetic Put Over':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '', 
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Buyer': sides[0][0], 'Seller': sides[0][1],
				'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Buyer': sides[1][0], 'Seller': sides[1][1],
				'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Buyer': sides[2][0], 'Seller': sides[2][1],
				'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Buyer': sides[3][0], 'Seller': sides[3][1],
				'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Buyer': '', 'Seller': '',
				'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false, 
			};
			break;
		}
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

		default:
			alert('no matching');
			break;
		}
		
		$mdDialog.show({
			controller : 'AppCtrl',
			scope : $scope,
			templateUrl : 'dialog_auto.tmpl.html',
//			parent : angular.element(document.body),
			preserveScope: true,
			targetEvent: ev,
			clickOutsideToClose: false,
			fullscreen : false,
//			locals: {
//				'myTrType': myTrType,
//				'mySide': mySide,
//				'mySymbol': mySymbol,
//				'myCpCompany': myCpCompany,
//				'myInstr': instr,
//				'myExpiry': expiry,
//				'myStrike': strike,
//				'myMultiplier': multiplier,
//				'myStrat': strat,
//				'myPremium': premium,
//				'myRef': ref,
//			}
			
		// Only for -xs, -sm breakpoints.
		});
//		.then(function(answer) {	// either OK / Cancel -> succ
//			if (answer === 'Cancel') {
//				$scope.status = 'cancelled';	
//			}
//			else {
//				$scope.status = 'Trade Report sent ' + answer;
//			}
////			$http.post('api/emailInvoice', {
////				client : answer,
////				start : $scope.myStartDate.getTime(),
////				end : $scope.myEndDate.getTime()
////			}).then(function(result) {
//////			$http.post('api/emailInvoice', answer).then(function(result) {
////				console.log(result);
////				//    	vm.param_myData = result.data.data;
//////				$scope.param_myData = result.data.data;
////			});
//		}, function() { // fail , press outside or close dialog box
//			$scope.status = 'close ';
//		  $mdDialog.destroy();
//		});
	};
//}]);

//function DialogController($scope, $mdDialog, locals, uiGridConstants) 
//{

	$scope.futMatTypes = [
		{id: 'JAN17', type: 'JAN17' },
		{id: 'FEB17', type: 'FEB17' },
		{id: 'MAR17', type: 'MAR17' },
		{id: 'APR17', type: 'APR17' },
		{id: 'MAY17', type: 'MAY17' },
		{id: 'JUN17', type: 'JUN17' },
		{id: 'JUL17', type: 'JUL17' },
		{id: 'AUG17', type: 'AUG17' },
		{id: 'SEP17', type: 'SEP17' },
		{id: 'OCT17', type: 'OCT17' },
		{id: 'NOV17', type: 'NOV17' },
		{id: 'DEC17', type: 'DEC17' },
	];
	  
//	$scope.myOtData[0] = {'UL': 1, 'Side': 2, 'TrType': 3, 'CP': 4};

	$scope.hide = function() {
		$mdDialog.hide();
	};
	
//	$scope.answer = function(answer) {
//		$mdDialog.hide(answer);
//	};
	
	$scope.sendTradeReport = function(ev) {
		
		var order = {};
//		alert($scope.param_myData);
//		$scope.orders.push();
		var legs = $scope.param_myData;
		refId = new Date().getTime();
		data = 
			{
				'RefId' : refId,
				'TrType': $scope.myTrType.substring(0,2), 
				'UL': $scope.myUl, 
				'Strategy': $scope.myStrat, 
				'Expiry': $scope.myExpiry,
				'Strike': $scope.myStrike,
				'Multiplier' :$scope.myMultiplier,
				'Qty': $scope.myQty,
				'Premium': $scope.myPremium,
				'Delta' :$scope.myDelta,
				'Buyer' :$scope.myCompany,  
				'Seller' :$scope.myCpCompany,  
				'FutMat': $scope.myFutMat,   
				'Symbol': $scope.mySymbol,   
				'Status': 'UNSENT',   
				'legs': legs,
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
                data: data.legs
        }
		
		$scope.myOtData.unshift(data);
		
		$http.post('api/sendTradeReport', {
			'refId'  : refId,
			'trType' : $scope.myTrType.substring(0,2),
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
		//$http.post('api/emailInvoice', answer).then(function(result) {
//			alert(result);
			//    	vm.param_myData = result.data.data;
		//	$scope.param_myData = result.data.data;
		});
		
		$scope.param_isShowSendBtn = false;	// display send button
		$scope.param_isQtyValid = false;
		$scope.param_isDeltaValid = false;
		$scope.param_isFutMatValid = false;
		$scope.param_isLastLegPriceValid = false;
		
		$scope.myQty = '';
		$scope.myDelta = '';
		$scope.myFutMat = '';
		
		$scope.param_myData = [];
		
		$mdDialog.cancel();
	};

	$scope.otGridOptions = {
		data : 'myOtData',
//		enableHorizontalScrollbar: false, 
//		enableVerticalScrollbar: false,
//			rowEditWaitInterval : -1,
		enableSorting : false,
		enableColumnResizing : true,
		enableFiltering : false,
		showGridFooter : false,
		showColumnFooter : false,
	    enableCellEditOnFocus: true,
	    expandableRowTemplate: 'expandableRowTemplate.html',
	    expandableRowHeight: 150,
	    //subGridVariable will be available in subGrid scope
	    expandableRowScope: {
	      subGridVariable: 'subGridScopeVariable',
//			appScopeProvider: {
//				showRow: function(row) {
//					return true;
//				}
//			},
	    },
		appScopeProvider: {
			showRow: function(row) {
				return true;
			}
		},
		columnDefs : [ 
			{field : 'Id', headerCellClass: 'green-header', width : '60', enableCellEdit : false}, 
			{field : 'Status', headerCellClass: 'green-header', width : '100', enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val === 'SENT')
						return 'order_in_progress';
					if (val === 'REJECT')
						return 'order_reject';
					return 'order_ok';
				}
			}, 
			{field : 'TrType', displayName: 'Cross Type', headerCellClass: 'green-header', width : '60', enableCellEdit : false}, 
			{field : 'Symbol', headerCellClass: 'green-header',width : '*',enableCellEdit : false},
			{field : 'Qty', headerCellClass: 'green-header', width : '60',enableCellEdit : false},
			{field : 'Delta', headerCellClass: 'green-header', displayName: 'Delta', width : '60',enableCellEdit : false},
			{field : 'FutMat', displayName: 'Fut Mat', headerCellClass: 'green-header', width : '60',enableCellEdit : false},
			{field : 'Buyer', headerCellClass: 'green-header', width : '80', enableCellEdit : false},
			{field : 'Seller', headerCellClass: 'green-header', width : '80', enableCellEdit : false},
		 ],
//		exporterMenuPdf : false,
	};
	$scope.otGridOptions.data = $scope.myOtData;
	
	$scope.otGridOptions.onRegisterApi = function(gridApi) {
		$scope.otGridApi = gridApi;
//		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditParamGrid);
	}
	
    $scope.expandAllRows = function() {
        $scope.otGridApi.expandable.expandAllRows();
      }
   
      $scope.collapseAllRows = function() {
        $scope.otGridApi.expandable.collapseAllRows();
      }
	
	$scope.paramGridOptions = {
		    data : 'myParam',
			appScopeProvider: {
				showRow: function(row) {
					return true;
				},
	
	fClick: function( rowEntity ) {           
//	    alert( 'On-item-click' );        
//	    alert( 'On-item-click - data:' );        
//	    alert( rowEntity );
		
		mb = rowEntity.modernBrowsers;
		if (!rowEntity.isFutMatValid) {	// first set FutMat
			last = mb.length - 1;
			mb.splice(last, 1);	// last one is dummy 'Choose...'
		}
		
		for (i=0; i<mb.length; i++) {
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
				{field : 'UL', headerCellClass: 'blue-header', width : '60', enableCellEdit : false}, 
				{field : 'Strategy', headerCellClass: 'blue-header',displayName:'Strat',width : '60',enableCellEdit : false}, 
			    {field : 'Buyer', headerCellClass: 'blue-header', width : '80', enableCellEdit: false }, 
			    {field : 'Seller', headerCellClass: 'blue-header', width : '80', enableCellEdit: false },
				{field : 'Expiry', headerCellClass: 'blue-header',width : '80',enableCellEdit : false}, 
				{field : 'Strike', headerCellClass: 'blue-header',width : '150',enableCellEdit : false}, 
				{field : 'Multiplier', headerCellClass: 'blue-header',width : '100',enableCellEdit : false}, 
				{field : 'Qty', headerCellClass: 'blue-header',width : '60',enableCellEdit : true,
//					editableCellTemplate: '<div><input type="number" class="form-control" ng-input="row.entity.Qty" ng-model="row.entity.Qty" /></div>',
//			        cellTemplate: 'prompt.html',
			        cellTemplate: '<div class="ui-grid-cell-contents"><i class="material-icons" style="color:red" ng-if="row.entity.isQtyValid === false">error_outline</i>' 
			        	+ '{{row.entity.Qty}}</div>',
//		        	cellTemplate: '<div><i class="material-icons" style="color:red" ng-if="grid.appScope.param_isQtyValid === false">error_outline</i>' 
//		        		+ '{{grid.appScope.myQty}}</div>',
				}, 
				{field : 'isQtyValid', visible: false},
				{field : 'Premium', headerCellClass: 'blue-header', displayName: 'Price', width : '60',enableCellEdit : false}, 
				{field : 'Delta', headerCellClass: 'blue-header',width : '60',enableCellEdit : true,
//					enableCellEditOnFocus: true,
//			          editableCellTemplate: $scope.cellInputEditableTemplate,
//			          cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="grid.appScope.param_isDeltaValid === false">error_outline</i>{{grid.appScope.myDelta}}</div>',
			          cellTemplate: '<div class="ui-grid-cell-contents"><i class="material-icons" style="color:red" ng-show="row.entity.isDeltaValid === false">error_outline</i>{{row.entity.Delta}}</div>',
				},
//				{field : 'isDeltaValid', visible: false},
//			    { 
//					field: 'FutMat',
//					headerCellClass: 'blue-header',
//			        name: 'FutMat', 
//			        displayName: 'Fut Mat', 
//			        editableCellTemplate: 'ui-grid/dropdownEditor', 
//			        width: '80',
////			        cellFilter: 'mapGender', 
////			        cellTemplate: '<div class="ui-grid-cell-contents"><i class="material-icons" style="color:red" ng-show="!row.entity.isFutMatValid">error_outline</i>{{row.entity.FutMat}}</div>',
//			        editDropdownValueLabel: 'type',
//			        editDropdownOptionsArray: $scope.futMatTypes 
////			        	[
////			        { id: 'DEC16', type: 'DEC16' },
////			        { id: 'MAR17', type: 'MAR17' },
////			        { id: 'JUN17', type: 'JUN17' }
////			        ] 
//			    },
				{field : 'Ref', width : '80',enableCellEdit: false, visible: false},
			    {field : 'FutMat', headerCellClass: 'blue-header', width : '100',
			    	cellTemplate: '<div><isteven-multi-select input-model="row.entity.modernBrowsers"' 
//		    		cellTemplate: '<div isteven-multi-select input-model="row.entity.modernBrowsers"' 
			    		+ ' output-model="row.entity.outputBrowsers" button-label="icon name" item-label="name" '
			    		+ ' tick-property="ticked" disable-property="disabled"'
//			    		+ ' on-item-click="grid.appScope.fClick( row.entity )" selection-mode="single"></div>'
			    		+ ' on-item-click="grid.appScope.fClick( row.entity )" selection-mode="single"></div>'
			    },
			 ],
			exporterMenuPdf : false,
	};
	
//	$scope.myExternalScope = $scope;
	
	$scope.paramGridOptions.onRegisterApi = function(gridApi) {
		$scope.paramGridApi = gridApi;
		gridApi.edit.on.afterCellEdit($scope, $scope.afterCellEditParamGrid);
	}
	
	$scope.afterCellEditParamGrid = function(rowEntity, colDef, newValue, oldValue) {
		var tokens = rowEntity.Multiplier.split('X');
		if (rowEntity.Qty && rowEntity.Qty !== '') {
			var params = [];
			
			// update legs qty
			var hasDecimal = false;
			for (i=0; i<tokens.length; i++) {
				var legQty = rowEntity.Qty * Math.abs(Number(tokens[i]));
				$scope.param_myData[i].Qty = legQty;
				if ((legQty % 1 !== 0)) {
					hasDecimal = true;
				}
//				params.push({side : $scope.param_myData[i].Side, option: $scope.param_myData[i].UL.split(' ')[1], qty: $scope.param_myData[i].Qty});
			}
			$scope.param_isQtyValid = !hasDecimal;
			rowEntity.isQtyValid = !hasDecimal;
////			// update future sell leg
//			var side = hedgeSide(params);
//			$scope.param_myData[$scope.param_myData.length - 1].Side = side;

			$scope.myQty = Number(rowEntity.Qty);
			
		}
		else {
			$scope.param_isQtyValid = false;
			$scope.myQty = rowEntity.Qty;
			for (i=0; i<tokens.length; i++) {
				$scope.param_myData[i].Qty = undefined;
			}
		}
		
		if (rowEntity.Delta && rowEntity.Delta !== '') {
			var len = $scope.param_myData.length;
			var delta = Number(rowEntity.Delta);
			var futQty = Number(rowEntity.Qty) * Math.abs(delta) * 0.01;
			$scope.param_myData[len - 1].Qty = futQty;
			$scope.myDelta = Number(rowEntity.Delta);
			
			rowEntity.isDeltaValid = (futQty % 1 === 0);
			$scope.param_isDeltaValid = (futQty % 1 === 0);
			
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
			$scope.param_myData[$scope.param_myData.length - 1].isHide = isHide;
//			var side = hedgeSide(params);
//			$scope.param_myData[$scope.param_myData.length - 1].Side = side;
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
			
			mb = rowEntity.modernBrowsers;
			for (i=0; i<mb.length; i++) {
//				if (mb.ticked) {
//					mb.icon = $scope.iconTemplate;
//				}
//				else {
					mb[i].icon = '';
//				}
			}
		}
		else {
			$scope.param_isFutMatValid = false;
			rowEntity.isFutMatValid = false;
			for (i=0; i<mb.length; i++) {
				if (mb.ticked) {
					mb[i].icon = $scope.iconTemplate;
				}
				else {
					mb[i].icon = '';
				}
			}
		}
		
		$scope.param_isShowSendBtn = ($scope.param_isQtyValid && $scope.param_isDeltaValid 
				&& $scope.param_isFutMatValid && $scope.param_isLastLegPriceValid);
		
//	    $scope.paramGridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
		 $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.ALL);
		 if (!$scope.$$phase) {
			 $scope.$apply();
		 }
	}
	
	$templateCache.put('ui-grid/uiGridViewport',
			"<div class=\"ui-grid-viewport\" ng-style=\"colContainer.getViewportStyle()\"><div class=\"ui-grid-canvas\"><div ng-repeat=\"(rowRenderIndex, row) in rowContainer.renderedRows track by $index\" ng-if=\"grid.appScope.showRow(row.entity)\" class=\"ui-grid-row\" ng-style=\"Viewport.rowStyle(rowRenderIndex)\"><div ui-grid-row=\"row\" row-render-index=\"rowRenderIndex\"></div></div></div></div>"
	);
	
	$scope.gridOptions = {
		appScopeProvider: {
			showRow: function(row) {
				if (row.isHide && row.isHide === true)
					return false;
				return true;
			}
		},
//		rowEditWaitInterval : -1,
		enableSorting : false,
		enableColumnResizing : true,
		enableFiltering : false,
		showGridFooter : false,
		showColumnFooter : false,
		enableCellEditOnFocus: false,
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
					if (!isNaN(val) && val > 0 && (val % 1 === 0))	// decimal
						 return '';
					return 'missing';
				}
			}, 
			{field : 'Buyer', headerCellClass: 'brown-header', width : '80',enableCellEdit : false,
				cellClass : function(grid, row, col, rowRenderIndex, colRenderIndex) {
					var val = grid.getCellValue(row, col);
					if (val)
						return '';
					return 'missing';
				}
			}, 
			{field : 'Seller', headerCellClass: 'brown-header', width : '80',enableCellEdit : false,
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
			{field : 'Price', headerCellClass: 'brown-header', displayName : 'Price', width : '*', /*enableCellEdit : true, */cellFilter : 'number: 2',
			    cellEditableCondition: function ($scope) {
			    	if ($scope.row.entity.isEditable)
			    		return true;
			    	return false;
//			    	'row.entity.isEditable',
			    },
				cellTemplate: '<div class="ui-grid-cell-contents" ng-if="row.entity.isEditable">'
					+ '<i class="material-icons" style="color:red" ng-show="!row.entity.isValidate && row.entity.noPrice">error_outline</i>'
					+ '{{row.entity.Price}}'
//					+ '<input ng-if="!row.entity.isValidate"ng-model="row.entity.Price" />'
					+ '</div>'
					+ '<div class="ui-grid-cell-contents" ng-if="!row.entity.isEditable">'
					+ '<input ng-if="row.entity.isValidate" style="background-color: red; color: white;" ng-input="row.entity.Price" ng-model="row.entity.Price" />'
					+ '<div ng-if="!row.entity.isValidate">{{row.entity.Price}}</div>'
					+ '</div>',
//					cellTemplate: '<div><i class="material-icons" style="color:red" ng-show="!row.entity.isValidate && row.entity.noPrice">error_outline</i>'
//						+ '<input ng-if="row.entity.isValidate" style="background-color: red; color: white;" ng-input="row.entity.Price" ng-model="row.entity.Price" />'
//						+ '<input ng-if="!row.entity.isValidate"ng-model="row.entity.Price" />'
//						+ '</div>',
			},
            {field : 'noPrice', headerCellClass: 'brown-header', displayName : 'noPrice', enableCellEdit : false, visible : false},
            {field : 'isValidate', headerCellClass: 'brown-header', displayName : 'isValidate', enableCellEdit : false, visible : false},
            {field : 'isEditable', headerCellClass: 'brown-header', displayName : 'isEditable', enableCellEdit : false, visible : false},
            {field : 'Multiplier', headerCellClass: 'brown-header', displayName : 'Multiplier',width : '*', enableCellEdit : false, visible : false},
		],
//		rowTemplate: '<div><div style="height: 100%; {\'background-color\': \'\'}" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>',
//		exporterMenuPdf : false,
	};

	$scope.gridOptions.data = $scope.param_myData;
	
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
		
		for (i = 0; i < $scope.param_myData.length; i++) 
		{
			if ($scope.param_myData[i].noPrice) {
//			if (isNaN($scope.param_myData[i].Price)) {
				nMissLeg++;
			}
		}
		if (nMissLeg > 1)
			return;
		
		for (i = 0; i < $scope.param_myData.length - 2; i++) 
		{
			if (!$scope.param_myData[i].noPrice) {
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
//		side = $scope.param_myData[iCal].Side;
		multi = $scope.param_myData[iCal].Multiplier;
		var price = calRemainPrice(params, multi, premium);
//		var price = calRemainPrice(params, multi, side, premium);
		// calRemainPrice(params, myMultiplier, myPrice, mySide);
		$scope.param_myData[iCal].Price = price;
		$scope.param_myData[iCal].noPrice = false;
		
		if (isNaN(price) || price < 0 || (price % 1 != 0)) {	// has decimal
			$scope.param_myData[iCal].isValidate = true;
			$scope.param_isLastLegPriceValid = false;
		}
		else {
			$scope.param_myData[iCal].isValidate = false;
			$scope.param_isLastLegPriceValid = true;
		}
		
		$scope.param_isShowSendBtn = ($scope.param_isQtyValid && $scope.param_isDeltaValid 
				&& $scope.param_isFutMatValid && $scope.param_isLastLegPriceValid);
		
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
		$scope.param_myData = [];
		var data = []; // clear legs
		var strat = tokens[4];
		$scope.myStrat = strat;
		var qty = [];
		var ul = [];

//		var expiry = $scope.myExpiry;
		var strike = $scope.myStrike;
		var multiplier = $scope.myMultiplier;
		var ref = Number($scope.myRef);
		var sides = getSides($scope.myMultiplier, $scope.mySide);
		var instr = tokens[0];
		

		var multi = getMultiple(multiplier, strat);
//		var strikes = tokens[2].split('/');
		var strikes = getStrikes(multiplier, tokens[2], strat);
		
//		var expiry = tokens[1];
		var maturities = getMaturities(multiplier, tokens[1], strat);
		
		switch (strat) {
		case 'C': { // 'EC - European Call':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : false
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		// put strategy
		case 'P' : { // - European Put': {
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 'Price' : $scope.myPremium,
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : false
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;			
		}
		case 'PL':  //'EPL - European Put Ladder':
		case 'PTL' : // - European Put Time Ladder':
		case 'PFLY':  // butterfly
		case 'PB':  // 'EPB - European Put Butterfly':
		case 'PTB': { // 'EPTB - European Put Time Butterfly':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false,  'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : sides[3], 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'PC': 
		case 'PDOR': //'EPC - European Put Condor':
		case 'PTC': {//'EPC - European Put Time Condor':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			ul[2] = exchangeSymbol(instr, 'P', strikes[2], maturities[2]);
			ul[3] = exchangeSymbol(instr, 'P', strikes[3], maturities[3]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : sides[3], 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Put', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Call', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : sides[3], 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'SG' :  //} - European Strangle':
		case 'RR' :  {// - European Risk Reversal':
			ul[0] = exchangeSymbol(instr, 'P', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'C', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Put', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Call', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
		case 'SD':  //} - European Straddle':
		case 'S' :  // - European Synthetic Call Over':
		case 'SPO': { // - European Synthetic Put Over':
			ul[0] = exchangeSymbol(instr, 'C', strikes[0], maturities[0]);
			ul[1] = exchangeSymbol(instr, 'P', strikes[1], maturities[1]);
			$scope.param_myData[0] = {
				'UL' : instr + ' Call', 'Instrument' : ul[0], 'Expiry' : maturities[0], 'Strike' : strikes[0], 'Qty' : '', 
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
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
				'Side' : sides[0], 'Multiplier' : Number(multi[0]),	'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[1] = {
				'UL' : instr + ' Put', 'Instrument' : ul[1], 'Expiry' : maturities[1], 'Strike' : strikes[1], 'Qty' : '', 
				'Side' : sides[1], 'Multiplier' : Number(multi[1]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[2] = {
				'UL' : instr + ' Call', 'Instrument' : ul[2], 'Expiry' : maturities[2], 'Strike' : strikes[2], 'Qty' : '', 
				'Side' : sides[2], 'Multiplier' : Number(multi[2]), 'noPrice' : true, 'isValidate' : false, 'isEditable' : true
			};
			$scope.param_myData[3] = {
				'UL' : instr + ' Put', 'Instrument' : ul[3], 'Expiry' : maturities[3], 'Strike' : strikes[3], 'Qty' : '', 
				'Side' : sides[3], 'Multiplier' : Number(multi[3]), 'noPrice' : true, 'isValidate' : true, 'isEditable' : false
			};
			$scope.param_myData[4] = {
				'UL' : instr + ' Future', 'Instrument' : '', 'Expiry' : futExp, 'Strike' : '', 'Qty' : '',
				'Side' : '', 'Price' : ref, 'Multiplier' : 0, 'noPrice' : false, 'isValidate' : false, 'isEditable' : false
			};
			break;
		}
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

		default:
			alert('no matching');
			break;
		}
	};
}]);


function calRemainPrice(params, myMultiplier, myPremium) {
	sum = 0;
	for (i=0; i<params.length; i++) 
	{
//		var sign = params[i].side === 'Sell' ? -1 : 1; 
		sum += Number(params[i].price) * Number(params[i].multiplier);
	}
//	var mySign = mySide === 'Sell' ? -1 : 1;
	return (myPremium - sum) / (myMultiplier);
}
//
//function calRemainPrice(params, myMultiplier, mySide, myPremium) {
//	sum = 0;
//	for (i=0; i<params.length; i++) 
//	{
//		var sign = params[i].side === 'Sell' ? -1 : 1; 
//		sum += Number(params[i].price) * sign * Number(params[i].multiplier);
//	}
//	var mySign = mySide === 'Sell' ? -1 : 1;
//	return (myPremium - sum) / (myMultiplier * mySign);
//}

//function hedgeSide(params) {
//	sum = 0;
//	for (i=0; i<params.length; i++) 
//	{
//		var qty = Number(params[i].qty);
//		if ((params[i].side === SIDE.BUY && params[i].option === 'Put') ||
//			(params[i].side === SIDE.SELL && params[i].option === 'Call'))
//			sum += -1 * qty;
//		else 
//			sum += qty;
//	}
//	if (sum > 0) {
//		return SIDE.SELL;
//	}
//	return SIDE.BUY;
//}

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
		return '1X-1';
	case 'S':// - European Synthetic Call Over':
		return '1X-1';
	case 'SPO':// - European Synthetic Put Over':
		return '-1X1';
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
//		return '1X1X1';
	case 'CTL': // - European Call Time Ladder':
	case 'PTL': // - European Put Time Ladder':
		return '-' + tokens[0] + 'X-' + tokens[1] + 'X' + tokens[1];
	case 'CR': // - European Call Ratio':
	case 'CS':
	case 'PR': // - European Put Ratio':
	case 'PS': // put spread
	case 'RR': // - European Risk Reversal':
	case 'SPO':// - European Synthetic Put Over':
		return tokens[0] + 'X-' + tokens[1];
	case 'CTR' : // European Call Time Ratio':
	case 'CTS': // - European Call Time Spread':
	case 'CDIAG': // ECDIAG - European Call Diagonal':
	case 'PTR' : // - European Put Time Ratio':
	case 'PTS': // - European Put Time Spread':
	case 'PDIAG':
	case 'S':// - European Synthetic Call Over':
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

//function getMultiple(term, n, defaultTerm) {
//	var multi = [];
//	for (i = 0; i < n; i++) {
//		multi[i] = 1;
//	}
//	if (term.indexOf('X') > 0) {
//		var tokens = term.split('X');
//		for (j = 0; j < tokens.length; j++) {
//			multi[j] = Math.abs(tokens[j]);
//		}
//	} else {
//		var tokens = defaultTerm.split('X');
//		for (j = 0; j < tokens.length; j++) {
//			multi[j] = tokens[j];
//		}
//	}
//	return multi;
//}

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
		multi.push(thisSide);
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
				for (i=0; i<mat.length; i++) {
					ary.push(mat[i]);
				}	
			}
			else {
				for (i=0; i<legs.length; i++) {
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
				for (i=0; i<strikes.length; i++) {
					ary.push(strikes[i]);
				}	
			}
			else {
				for (i=0; i<legs.length; i++) {
					ary.push(sStrike);
				}
			}
		break;
		}
	}
	return ary;
}

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
	case 'SYNTH' : {
		if (isReverse)
			return 'S';
		else 
			return 'SPO';
	}
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
		var common_strat = tokens[4];	// i = 4
		strat = deduceStrat(common_strat, is_n_expiry, is_n_strike, true);
		multiplier = getMultiplier(tokens[3], strat);	// ( multiplier )	// i = 3
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