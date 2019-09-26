(function() {
  'use strict';
  angular.module('app')
  .directive('bsTooltip', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $(element).hover(function() {
          // on mouseenter
          $(element).tooltip('show');
        }, function() {
        // on mouseleave
          $(element).tooltip('hide');
        });
      }
    };
  }]);
})();
