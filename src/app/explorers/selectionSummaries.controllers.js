(function () {
  'use strict';
  angular.module('app')
    .component('projectSelectionSummary', {
      templateUrl: 'app/explorers/selection-summary.html',
      bindings: {
        selectedProjects: '<',
        scrollSelection: '<',
        isProjectExploreOpen: '<'
      },
      controller: function () {
        var $ctrl = this;
        $ctrl.sectorCount = 0;
        $ctrl.leadOrgCount = 0;
        $ctrl.formsOfSupportCount = 0;
        $ctrl.projectsCount = 0;
        var previousSelectedCount = 0;

        $ctrl.$doCheck = function () {
          var newSelectedCount = ($ctrl.selectedProjects) ? $ctrl.selectedProjects.length : 0;
          if (previousSelectedCount != newSelectedCount && $ctrl.isProjectExploreOpen) {

            //Iterate over selected projects, and count unique related entities.
            var formsOfSupport = [];
            var sectors = [];
            var leadOrgs = [];

            for (var pr = 0; pr < $ctrl.selectedProjects.length; pr++) {
              var project = $ctrl.selectedProjects[pr];
              leadOrgs.push(project.leadOrg);

              for (var sec = 0; sec < project.sectors.length; sec++) {
                sectors.push(project.sectors[sec]);
              }

              for (var fs = 0; fs < project.formsOfSupport.length; fs++) {
                formsOfSupport.push(project.formsOfSupport[fs]);
              }
            }
            $ctrl.sectorCount = _.uniq(sectors).length;
            $ctrl.leadOrgCount = _.uniq(leadOrgs).length;
            $ctrl.formsOfSupportCount = _.uniq(formsOfSupport).length;
            $ctrl.projectsCount = $ctrl.selectedProjects.length;
            previousSelectedCount = newSelectedCount;
          }
        }
      }
    })
})();

