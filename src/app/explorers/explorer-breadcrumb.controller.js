(function () {
  'use strict';
  angular.module('app')
    .component('explorerBreadcrumb', {
      templateUrl: 'app/explorers/explorer-breadcrumb.html',
      bindings: {
        breadcrumbs: '='
      },
      controller: function () {
        var $ctrl = this;
        $ctrl.formattedBreadcrumbs = []; //Generated when incoming 'breadcrumbs' change.
        var previousSelectedCount = 0;

        $ctrl.closeExplorerView = function() {
          $ctrl.breadcrumbs.length = 0;
        };

        $ctrl.openBreadcrumb = function(index) {
          //remove all breadcrumbs after the specified one.
          $ctrl.breadcrumbs.length = index+1;
        };

        $ctrl.$doCheck = function () {
          var newSelectedCount = $ctrl.breadcrumbs.length;
          if (previousSelectedCount != newSelectedCount) {
            previousSelectedCount = newSelectedCount;
            $ctrl.formattedBreadcrumbs = $ctrl.breadcrumbs.map(
              function(rawBreadcrumb) {
                var title = 'Selected Items';
                if (rawBreadcrumb.type === 'projects') {
                  title = 'Interventions Selection';
                }
                else if (rawBreadcrumb.type === 'fos') {
                  title = 'Forms of Support Selection ';
                }
                else if (rawBreadcrumb.type === 'sectors') {
                  title = 'Sectors Selection';
                }
                else if (rawBreadcrumb.type === 'leadOrgs') {
                  title = 'Lead Organizations Selection';
                }
                return {title: title};
              });
          }
        }
      }
    })
})();

