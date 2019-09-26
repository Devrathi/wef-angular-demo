(function () {
  'use strict';
  angular.module('app')
    .component('projectsAndLeadorgsList', {
      templateUrl: 'app/explorers/projects-and-leadorgs-list.html',
      bindings: {
        //Expects object in format: { projects:[], leadOrgs:[], isLoading:true|false }
        items: '<',
        isProjectsAndLeadOrgsListOpen: '=',
        scrollbarConfig: '<',

        exploreProjectsCallback: '&',
        exploreLeadOrgsCallback: '&'
      },
      controller: function () {
        var $ctrl = this;

        $ctrl.exploreProjects = function(projects) {
          $ctrl.exploreProjectsCallback({projects:projects});
        };

        $ctrl.exploreLeadOrgs = function(leadOrgs) {
          $ctrl.exploreLeadOrgsCallback({leadOrgs:leadOrgs});
        };

        $ctrl.closeList = function() {
          $ctrl.isProjectsAndLeadOrgsListOpen = false;
        };

        $ctrl.$onChanges = function() {
          if (!$ctrl.isProjectsAndLeadOrgsListOpen || !$ctrl.items) {
            return;
          }
          if (!$ctrl.items.projects || !$ctrl.items.leadOrgs) {
            return;
          }
          $ctrl.isProjectsAndLeadOrgsListOpen = $ctrl.items.isLoading || ($ctrl.items.projects.length > 0 || $ctrl.items.leadOrgs.length > 0);
        }
      }
    })
})();

