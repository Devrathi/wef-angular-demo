(function () {
  'use strict';
  angular.module('app')
    .component('explorerViews', {
      templateUrl: 'app/explorers/explorer-views.html',
      bindings: {
        //Breadcrumbs array in format: {type:'projects|fos|leadOrgs|sectors', items: []}
        explorerBreadcrumbs: '=',

        isInterventionsPopupOpen: '=', //refers to popup when clicking on single project header.
        isInterventionsListOpen: '=', //refers to list of interventions on sectors/fos views.
        isLeadOrgsListOpen: '=', //refers to list of interventions on sectors/fos views.
        isLeadOrgPopupOpen: '=', //refers to popup when clicking on single leadOrg header.

        allLeadOrgs: '<' //For lookup.
      },
      controller: ['$timeout', function ($timeout) {
        var $ctrl = this;
        $ctrl.isProjectsAndLeadOrgsListOpen = false;
        $ctrl.selectedProjectsAndLeadOrgs = {};
        var previousBreadcrumbsLength = 0;

        /**
         * Given a sector, and a fos, return {projects:[], leadOrgs:[]} where:
         *
         * @param sector Sector object.
         * @param fos Fos object.
         */
        function getProjectsAndLeadOrgsForSectorAndFos(sector, fos) {
          var projects = getProjectsForSectorAndFos(sector, fos.name);
          var leadOrgs = getLeadOrgsForProjects(projects);
          return { projects: projects, leadOrgs: leadOrgs, isLoading:false };

          function getProjectsForSectorAndFos(sector, fosString) {
            var projectsThatContainFos = _.filter(sector.projects,
              function(pr) {
                return _.some(pr.formsOfSupport, function(fos) { return fos.name === fosString;});
              });
            return projectsThatContainFos;
          }
        }

        /**
         * Given a sector, and a fos, return {projects:[], leadOrgs:[]} where:
         * @param sectorName Name of sector that project must belong to.
         * @param fosObj Full FOS object that contains projects(and projects must contain sectors)
         * @returns {{projects: *, leadOrgs: *}}
         */
        function getProjectsAndLeadOrgsForSectorNameAndFos(sectorName, fosObj) {
          var projects = getProjectsThatHaveSector(sectorName, fosObj.projects);
          var leadOrgs = getLeadOrgsForProjects(projects);
          return { projects: projects, leadOrgs: leadOrgs, isLoading:false };
        }

        function getProjectsThatHaveSector(sectorName, projects) {
          return _.filter(projects, function(pr) {
            return _.some(pr.sectors, function(sec) { return sec.name == sectorName; });
          });
        }

        function getProjectsThatHaveFos(fosName, projects) {
          return _.filter(projects, function(pr) {
            return _.some(pr.formsOfSupport, function(fos) { return fos.name == fosName; });
          });
        }

        function getProjectsAndLeadOrgsForSectorNames(sectorNames) {
          var allProjects = _.flatten($ctrl.allLeadOrgs.map(function(lo) { return lo.projects; }));
          var matchingProjects = [];
          for (var i = 0; i < sectorNames.length; i++) {
            var secName = sectorNames[i];
            var projectsThatHaveSector = getProjectsThatHaveSector(secName, allProjects);
            matchingProjects.push(...projectsThatHaveSector);
          }

          var uniqueProjects = _.uniq(matchingProjects);
          var leadOrgs = getLeadOrgsForProjects(uniqueProjects);
          return { projects: uniqueProjects, leadOrgs: leadOrgs, isLoading:false };
        }

        function getProjectsAndLeadOrgsForFosNames(fosNames) {
          var allProjects = _.flatten($ctrl.allLeadOrgs.map(function(lo) { return lo.projects; }));
          var matchingProjects = [];
          for (var i = 0; i < fosNames.length; i++) {
            var fosName = fosNames[i];
            var projectsThatHaveFos = getProjectsThatHaveFos(fosName, allProjects);
            matchingProjects.push(...projectsThatHaveFos);
          }
          var uniqueProjects = _.uniq(matchingProjects);
          var leadOrgs = getLeadOrgsForProjects(uniqueProjects);
          return { projects: uniqueProjects, leadOrgs: leadOrgs, isLoading:false };
        }

        /**
         * Extract unique leadOrg objects from projects.
         * @param projects
         * @returns {*}
         */
        function getLeadOrgsForProjects(projects) {
          var leadOrgNames = _.uniq(projects.map(function(pr) { return pr.leadOrg }));
          return _.filter($ctrl.allLeadOrgs, function(lo) { return _.contains(leadOrgNames, lo.name); });
        }

        function hideAllPopups() {
          $ctrl.isLeadOrgPopupOpen = false;
          $ctrl.isInterventionsPopupOpen = false;
          $ctrl.isInterventionsListOpen = false;
          $ctrl.isLeadOrgsListOpen = false;
          $ctrl.isProjectsAndLeadOrgsListOpen = false;
        }

        /**
         * Shows popup list that shows projects+leadOrgs for the specified sector+fos combination.
         * @param cardIndex
         * @param sector
         * @param fos
         */
        $ctrl.showProjectsAndLeadOrgsListForSectorFos = function(cardIndex, sector, fos) {
          hideAllPopups();
          $ctrl.focusedCardIndex = cardIndex;
          $ctrl.isProjectsAndLeadOrgsListOpen = true;
          $ctrl.selectedProjectsAndLeadOrgs = getProjectsAndLeadOrgsForSectorAndFos(sector, fos);
        };

        /**
         * Shows popup list that shows projects+leadOrgs for the specified sector+fos combination.
         * @param cardIndex
         * @param sectorNameObj Object with sector name in {name} property (not full sector object)
         * @param fosObj Full FOS object with sub projects.
         */
        $ctrl.showProjectsAndLeadOrgsListForSectorNameAndFos = function(cardIndex, sectorNameObj, fosObj) {
          hideAllPopups();
          $ctrl.focusedCardIndex = cardIndex;
          $ctrl.isProjectsAndLeadOrgsListOpen = true;
          $ctrl.selectedProjectsAndLeadOrgs = {projects:[], leadOrgs:[], isLoading:true};

          //'crunch data' in the background.
          $timeout(function () {
            $ctrl.selectedProjectsAndLeadOrgs = getProjectsAndLeadOrgsForSectorNameAndFos(sectorNameObj.name, fosObj);
          }, 300);
        };

        $ctrl.showProjectsAndLeadOrgsListForSectors = function(cardIndex, sectorNameObjects) {
          $ctrl.focusedCardIndex = cardIndex;
          $ctrl.isProjectsAndLeadOrgsListOpen = true;
          $ctrl.selectedProjectsAndLeadOrgs = {projects:[], leadOrgs:[], isLoading:true};

          //'crunch data' in the background.
          $timeout(function () {
            var names = sectorNameObjects.map(function(sec) { return sec.name; });
            $ctrl.selectedProjectsAndLeadOrgs = getProjectsAndLeadOrgsForSectorNames(names);
          }, 300);
        };

        $ctrl.showProjectsAndLeadOrgsListForFos = function(cardIndex, fos) {
          $ctrl.focusedCardIndex = cardIndex;
          $ctrl.isProjectsAndLeadOrgsListOpen = true;
          $ctrl.selectedProjectsAndLeadOrgs = {projects:[], leadOrgs:[], isLoading:true};

          //'crunch data' in the background.
          $timeout(function () {
            var names = fos.map(function(fos) { return fos.name; });
            $ctrl.selectedProjectsAndLeadOrgs = getProjectsAndLeadOrgsForFosNames(names);
          }, 300);
        };

        $ctrl.exploreProjects = function(projectsToExplore) {
          hideAllPopups();
          $ctrl.explorerBreadcrumbs.push({type:'projects', items: projectsToExplore})
        };

        $ctrl.exploreLeadOrgNames = function(leadOrgsNames) {
          var leadOrgsToExplore = _.filter($ctrl.allLeadOrgs, function(org) { return _.contains(leadOrgsNames, org.name);});
          $ctrl.exploreLeadOrgs(leadOrgsToExplore);
        };

        $ctrl.exploreLeadOrgs = function(leadOrgsToExplore) {
          hideAllPopups();
          $ctrl.explorerBreadcrumbs.push({type:'leadOrgs', items: leadOrgsToExplore})
        };

        $ctrl.toggleLeadOrgsList = function(index) {
          $ctrl.focusedCardIndex = index;
          $ctrl.isLeadOrgsListOpen = !$ctrl.isLeadOrgsListOpen;
        };

        $ctrl.toggleInterventionsList = function(index) {
          $ctrl.focusedCardIndex = index;
          $ctrl.isInterventionsListOpen = !$ctrl.isInterventionsListOpen;
        };

        $ctrl.toggleProjectPopup = function(project) {
          console.log('opening project:', project);
          $ctrl.isInterventionsPopupOpen = !$ctrl.isInterventionsPopupOpen;
          $ctrl.selectedProjectPopup = project.name;
        };

        $ctrl.toggleLeadOrgPopup = function(leadOrg) {
          $ctrl.isLeadOrgPopupOpen = !$ctrl.isLeadOrgPopupOpen;
          $ctrl.selectedLeadOrgPopup = leadOrg.name;
        };

        $ctrl.onToggleProjectSelected = function (index) {
          $ctrl.selectedProjects.splice(index, 1);
          if ($ctrl.selectedProjects.length == 0) {
            hideAllPopups();
            $ctrl.explorerBreadcrumbs.pop();
          }
        };

        $ctrl.onToggleSectorSelected = function (index) {
          $ctrl.selectedSectors.splice(index, 1);
          if ($ctrl.selectedSectors.length == 0) {
            hideAllPopups();
            $ctrl.explorerBreadcrumbs.pop();
          }
        };

        $ctrl.onToggleFormsOfSupportSelected = function (index) {
          $ctrl.selectedFormsOfSupports.splice(index, 1);
          if ($ctrl.selectedFormsOfSupports.length == 0) {
            hideAllPopups();
            $ctrl.explorerBreadcrumbs.pop();
          }
        };
        $ctrl.onToggleLeadOrgSelected = function (index) {
          $ctrl.selectedLeadOrgs.splice(index, 1);
          if ($ctrl.selectedLeadOrgs.length == 0) {
            hideAllPopups();
            $ctrl.explorerBreadcrumbs.pop();
          }
        };

        $ctrl.updateScrollbar = function () {
          $timeout(function () {
            $('.projects__container-aux').mCustomScrollbar("update");
            $('.projects__container-aux').mCustomScrollbar("scrollTo", "left");
          });
        };

        $ctrl.scrollSelection = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          setHeight: 120,
          axis: 'y',
          scrollInertia: 0
        };

        function renderBreadcrumb(breadcrumb) {
          if(breadcrumb.type === 'projects') {
            console.log('Exploring projects:', breadcrumb.items);
            $ctrl.selectedProjects = breadcrumb.items;
            $ctrl.isProjectExploreOpen = true;
          }
          else if (breadcrumb.type === 'sectors') {
            console.log('Exploring sectors:', breadcrumb.items);
            $ctrl.selectedSectors = breadcrumb.items;
            $ctrl.isSectorExplorerOpen = true;
          }
          else if (breadcrumb.type === 'fos') {
            console.log('Exploring fos:', breadcrumb.items);
            $ctrl.selectedFormsOfSupports = breadcrumb.items;
            $ctrl.isFosExploreOpen = true;
          }
          else if (breadcrumb.type === 'leadOrgs') {
            console.log('Exploring leadOrgs:', breadcrumb.items);
            $ctrl.selectedLeadOrgs = breadcrumb.items;
            $ctrl.isLeadOrgExploreOpen = true;
          }
          else {
            throw 'Unsupported breadcrumb type: ' + breadcrumb.type + ' for breadcrumb: ' + JSON.stringify(breadcrumb);
          }
        }

        function renderLastBreadcrumb() {
          var lastBreadcrumb = $ctrl.explorerBreadcrumbs[$ctrl.explorerBreadcrumbs.length - 1];
          $ctrl.isProjectExploreOpen = false;
          $ctrl.isLeadOrgExploreOpen = false;
          $ctrl.isSectorExplorerOpen = false;
          $ctrl.isFosExploreOpen = false;
          renderBreadcrumb(lastBreadcrumb);
        }

        function closeExplorerView() {
          //Clear breadcrumbs and hide view.
          hideAllPopups();
          previousBreadcrumbsLength = 0;
          $ctrl.explorerBreadcrumbs.length = 0;
        }

        $ctrl.$doCheck = function () {
          var newBreadcrumbsLength = $ctrl.explorerBreadcrumbs.length;
          $ctrl.isExplorerViewOpen = ($ctrl.explorerBreadcrumbs.length > 0);

          if (newBreadcrumbsLength != previousBreadcrumbsLength) {
            previousBreadcrumbsLength = newBreadcrumbsLength;

            if ($ctrl.explorerBreadcrumbs.length > 0) {
              renderLastBreadcrumb();
            }
            else {
              closeExplorerView();
            }
          }
        };

        // scrollbar configs
        $ctrl.config = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          setHeight: 200,
          axis: 'y',
          scrollInertia: 0
        };
        // scrollbar config
        $ctrl.scrollSelection = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          setHeight: 120,
          axis: 'y',
          scrollInertia: 0
        };
        $ctrl.popup = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          axis: 'y',
          scrollInertia: 0
        };
        $ctrl.verthoriz = {
          autoHideScrollbar: false,
          theme: 'light-thick',
          advanced: {
            updateOnContentResize: true
          },
          scrollButtons: {
            enable: false
          },
          setHeight: 200,
          axis: 'xy',
          scrollInertia: 0
        };
      }]
    })
})();

