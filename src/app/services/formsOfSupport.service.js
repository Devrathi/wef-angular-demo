(function() {
  'use strict';
  angular.module('app')
    .service('FormsOfSupportService', ['$http', function($http) {
      return {
        list: function() {
          return $http.get('data/formsOfSupport.json');
        }
      };
    }])
})();
