(function() {
  'use strict';
  angular.module('app')
    .service('SectorsService', ['$http', function($http) {
      return {
        list: function() {
          return $http.get('data/sectors.json');
        }
      };
    }])
})();
