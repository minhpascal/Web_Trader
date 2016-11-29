angular.module('app', ['ui.grid', 'ui.grid.edit', 'ui.select'])
  .controller('MainCtrl', MainCtrl)
  .directive('uiSelectWrap', uiSelectWrap);

MainCtrl.$inject = ['$scope', '$http'];
function MainCtrl($scope, $http) {
	var month = moment(new Date()).format('MMM');
	var year = moment(new Date()).format('YYYY');
	
  $scope.gridOptions = {
    rowHeight: 38,
    columnDefs: [
      { field: 'instr', name: 'Instrument' ,
          editableCellTemplate: 'uiSelect',
          editDropdownOptionsArray: [
              'HSI', 'HSCEI']
   	  },
   	  { field: 'strike', name: 'Strike', type: 'number' },
      { field: 'month', name: 'Month' ,
          editableCellTemplate: 'uiSelect',
          editDropdownOptionsArray: [
              'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
   	  },
      { field: 'year', name: 'Year' ,
          editableCellTemplate: 'uiSelect',
          editDropdownOptionsArray: ['2016', '2017']
   	  },
      { field: 'price', name: 'Price', type: 'number' },
      { field: 'qty', name: 'Qty', type: 'number' },
      { field: 'cond', name: 'Cond' ,
          editableCellTemplate: 'uiSelect',
          editDropdownOptionsArray: ['T1', 'T2', 'T4']
   	  },
      { field: 'side', name: 'Side',
        editableCellTemplate: 'uiSelect',
        editDropdownOptionsArray: ['Cross', 'Buy', 'Sell']
      }
    ]
  };

//  $http.get('https://cdn.rawgit.com/angular-ui/ui-grid.info/v3.0.7/data/500_complex.json')
//    .success(function(data) {
//      $scope.gridOptions.data = data;
//    });
  
  $scope.gridOptions.data = [{
	    "instr": "HSI",
	    "strike": "",
	    "month": month,
	    "year": year,
	    "price": "",
	    "qty": "",
	    "cond": "T2",
	    "side": "Cross",
	  }];	
}

uiSelectWrap.$inject = ['$document', 'uiGridEditConstants'];
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
