var app = angular.module('AngularUiExamples',['ui.bootstrap']);

app.controller('MainController', function($scope, $http, $uibModal, $log, $document){

    var starshipsID = [5,9,10,11,15];
    
    //if localstorage empty or null
	if (localStorage.getItem('starwarsdata') == null) {
        
    $http.get('https://swapi.co/api/starships/').
     then(function(response) {
           $scope.data = response;
           $scope.data.results = [];
           var jsonlength = $scope.data.results.length; 
           var jsonObjArray = []; // = new Array();
        
           for (i=0; i<jsonlength; i++){
               for (k=0; k<starshipsID.length; k++){
                   var url = 'http://swapi.co/api/starships/'+ starshipsID[k] + '/';
                   if($scope.data.results[i].url == url){
                    //alert(JSON.stringify($scope.data.results[i]));
                    $scope.data.results[i].id =  starshipsID[k];
                    jsonObjArray.push($scope.data.results[i]);
                    localStorage.setItem('starwarsdata', JSON.stringify(jsonObjArray));
                    
                   }
               }
           }
           $scope.data = JSON.parse(localStorage.getItem('starwarsdata'));
        
           angular.forEach($scope.data, function (starship) {
              starship.crew = parseFloat(starship.crew);
           });
         });
      }
      else{
         $scope.data = JSON.parse(localStorage.getItem('starwarsdata'));
         
         angular.forEach($scope.data, function (starship) {
           starship.crew = parseFloat(starship.crew);
         });
      }
    
    $scope.animationsEnabled = true;
    $scope.crew = {};
    $scope.openModal = function (id, size, parentSelector) {
        var parentElem = parentSelector ? 
          angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          controllerAs: '$ctrl',
          size: size,
          appendTo: parentElem,
          resolve: {
            items: function () {
              var value = $scope.crew[id];
              var items = [];
              $scope.items = items;
              $scope.items.id = id
              $scope.items.value = value;
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function () {
          $scope.data = JSON.parse(localStorage.getItem('starwarsdata'));
          angular.forEach($scope.data, function (starship) {
            starship.crew = parseFloat(starship.crew);
          });
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    
});

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

    $scope.items = items;
    var starshipid = JSON.stringify($scope.items.id);
    
    $scope.updatestarship = function() {
        
        $scope.data = JSON.parse(localStorage.getItem('starwarsdata'));
        var jsonlength = $scope.data.length; 
        for (i=0; i<jsonlength; i++){
               
                if($scope.data[i].id == starshipid){
                    //$scope.data[i].crew = $scope.crews + starshipid;
                    //var newcrew = 'crew' + starshipid;
                    var value = $scope.items.value;
                    //$scope.crews = $scope.crews + starshipid
                    //$scope.crews = $scope.data[i].crew ;
                    $scope.data[i].crew = value;
                    $scope.data[i].edited = new Date();
                    localStorage.setItem("starwarsdata",JSON.stringify($scope.data))
                }
           }
        $uibModalInstance.close();
    }
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
