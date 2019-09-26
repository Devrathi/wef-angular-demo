(function() {
  'use strict';
  angular.module('app')
    .service('ProjectsService', ['$http', function($http) {
      return {
        list: function() {
          return $http.get('data/projects.json');
        }
      };
    }])

})();

