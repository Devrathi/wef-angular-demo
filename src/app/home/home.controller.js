/* eslint-disable indent */
/**
 * HomeController
 */
(function () {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', ['$scope', '$timeout', 'ProjectsService', 'SectorsService', 'FormsOfSupportService', function ($scope, $timeout, ProjectsService, SectorsService, formsOfSupportService) {

      // get all projects from json
      $scope.effectiveSelectedProjectsCount = 0;
      // $scope.projectsData = [];
      $scope.sectorsData = [];
      $scope.orgs = [];
      $scope.projectsInaSector = [];
      $scope.projectsInaFos = [];
      $scope.fosInSectorSelection = [];
      $scope.isPopupOpen = false;
      $scope.isIntroPopupOpen = false;
      $scope.isAboutPopupOpen = true;
      $scope.isInterventionsPopupOpen = false;
      $scope.isInterventionsListOpen = false;
      $scope.isLeadOrgsListOpen = false;

      //Breadcrumbs to show on explorer view. In format: {type:'projects|fos|leadOrgs|sectors', items: []}
      $scope.explorerBreadcrumbs = [];

      var sectorCount = [];
      var obj;

      // empty array for user-selected project
      $scope.selectedProjects = [];
      // empty array for user-selected sectors
      $scope.selectedSectors = [];
      // empty array for user-selected leadOrgs
      $scope.selectedLeadOrgs = [];
      // empty array for user-selected forms of support
      $scope.selectedFormsOfSupports = [];
      $scope.sectors = [];
      $scope.sectorsInALeadOrg = [];
      $scope.formsOfSupportInALeadOrg = [];
      $scope.sector = {};
      $scope.projects = [];

      init();

      function init() {

        formsOfSupportService.list().then(function (response) {
          $scope.formsOfSupportData = response.data;

          SectorsService.list().then(function (response) {
            $scope.sectorsData = response.data;

            ProjectsService.list().then(function (response) {
              $scope.projectsData = response.data;
              run();
            }, function (err) {
              console.log(err);
            });

          }, function (err) {
            console.log(err);
          });


        }, function (err) {
          console.log(err);
        });


        // scrollbar config
        $scope.config = {
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
        $scope.scrollSelection = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          setHeight: 120,
          axis: 'y',
          scrollInertia: 0
        };
        $scope.popup = {
          autoHideScrollbar: false,
          theme: 'light-thin',
          advanced: {
            updateOnContentResize: true
          },
          axis: 'y',
          scrollInertia: 0
        };
        $scope.verthoriz = {
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
      }

      // $scope.arr = [];
      // get the data from the ProjectsService
      function run() {
        $scope.leadOrgs = $scope.projectsData;
        $scope.totalLeadOrgs = $scope.projectsData.length;

        // loop through all lead orgs
        for (var i = 0; i < $scope.projectsData.length; i++) {
          // assign current leadorg to aLeadOrg
          const aLeadOrg = $scope.projectsData[i];
          // bind current leadOrg's projects to scope.projects
          $scope.projects = aLeadOrg.projects;
          // loop through all projects in current leadOrg
          for (var k = 0; k < aLeadOrg.projects.length; k++) {
            // assign current project to const
            const project = aLeadOrg.projects[k];
            // push this projects leadOrg name into project scope
            aLeadOrg.projects[k].leadOrg = aLeadOrg.name;
            aLeadOrg.projects[k].leadOrgSDIP = aLeadOrg.SDIP;
            aLeadOrg.projects[k].leadOrgType = aLeadOrg.type;
            aLeadOrg.projects[k].leadOrgDescription = aLeadOrg.description;
            //
            // look through all formsOfSupport in current project
            for (var f = 0; f < $scope.formsOfSupportData.length; f++) {
              // assign current formsOfSupport to const
              const jsonFOS = $scope.formsOfSupportData[f];
              // loop through all formsOfSupportIDs's in current project
              for (var z = 0; z < project.formsOfSupportIDs.length; z++) {
                // assign current formsOfSupportID to const
                const fos = project.formsOfSupportIDs[z];
                // check if current fos id matches formsOfSupportID within current project
                if (jsonFOS.id === fos) {
                  // push current sector to project.sectors array
                  project.formsOfSupport.push(jsonFOS);
                  // bind current FOS to $scope.sectorsInALeadOrg
                  $scope.formsOfSupportInALeadOrg.push(jsonFOS);
                }
              }
            }


            // look through all sectors in current project
            for (var j = 0; j < $scope.sectorsData.length; j++) {
              // assign current sector to const
              const jsonSector = $scope.sectorsData[j];
              // loop through all sectorID's in current project
              for (var z = 0; z < project.sectorIDs.length; z++) {
                // assign current sectorID to const
                const sector = project.sectorIDs[z];
                // check if current sector id matches sectorID within current project
                if (jsonSector.id === sector) {
                  // push current sector to project.sectors array
                  project.sectors.push(jsonSector);

                  // bind current sector to $scope.sectorsInALeadOrg
                  $scope.sectorsInALeadOrg.push(jsonSector);
                }
                project.sectorsDebugString = JSON.stringify(project.sectors.map(v => v.name));
              }
            }
          }
        } //

        for (var a = 0; a < $scope.projectsData.length; a++) {
          // var org = [];
          var aSectors = [];
          var aFormsOfSupport = [];
          var leadOrg = $scope.projectsData[a];
          for (var b = 0; b < leadOrg.projects.length; b++) {
            var project = leadOrg.projects[b];
            // loop through sectors within each project
            for (var c = 0; c < project.sectors.length; c++) {
              // if the sector is not already present
              if (aSectors.indexOf(project.sectors[c]) === -1) {
                // then push it aSectors array
                aSectors.push(project.sectors[c]);
              }
            }
            // loop through forms of support within each project
            for (var x = 0; x < project.formsOfSupport.length; x++) {
              // if the sector is not already present
              if (aFormsOfSupport.indexOf(project.formsOfSupport[x]) === -1) {
                // then push it aSectors array
                aFormsOfSupport.push(project.formsOfSupport[x]);
              }
            }
          }
          $scope.orgs.push({
            name: leadOrg.name,
            description: leadOrg.description,
            type: leadOrg.type,
            geography: leadOrg.geography,
            sectors: aSectors,
            aFormsOfSupport: aFormsOfSupport,
            projects: leadOrg.projects
          });
          // $scope.arrays.push($scope.arr);
        }

        /**
         * Set project.effectiveToggled value to true or false. Determines whether project is counted in
         *   total 'Interventions', or if project gets the 'projectIsSelected' css class.
         *  Value calculated based on if:
         *   - the project is in $scope.selectedProjects, OR
         *   - the project has .toggled == true
         *   - the project has one of the selected sectors ($scope.selectedSectors)
         *   - the project belongs to one of the selected lead orgs ($scope.selectedLeadOrgs)
         *   - the project has one of the selected forms of support ($scope.selectedFormsOfSupports)
         *
         *   @param {any} project The project for which we're updating effectiveToggledValue.
         */
        function setProjectEffectiveToggledValue(project) {
          if (project.toggled) {
            project.effectiveToggled = true;
            return;
          }
          if (_.contains($scope.selectedProjects, project)) {
            project.effectiveToggled = true;
            return;
          }

          if (_.findIndex($scope.selectedSectors, sec => _.contains(project.sectorIDs, sec.id)) > -1) {
            // One of project's sectorIds matches a selected sector.
            project.effectiveToggled = true;
            return;
          }

          if (_.findIndex($scope.selectedFormsOfSupports, fos => _.contains(project.formsOfSupportIDs, fos.id)) > -1) {
            // One of project's formsOfSupportIDs matches a selected fos.
            project.effectiveToggled = true;
            return;
          }

          if (_.findIndex($scope.selectedLeadOrgs, leadOrg => project.leadOrg === leadOrg.name) > -1) {
            // One of project's formsOfSupportIDs matches a selected fos.
            project.effectiveToggled = true;
            return;
          }

          project.effectiveToggled = false;
        }

        /**
         * Find all projects that belong to specified sector, and refresh effective toggled value.
         * @param {any} sector Sector that contains projects.
         */
        function updateEffectiveToggledForProjectsInSector(sector) {
          for (var i = 0; i < sector.projects.length; i++) {
            var project = sector.projects[i];
            setProjectEffectiveToggledValue(project);
          }
          updateCountOfEffectiveSelectedProjects();
        }

        /**
         * Find all projects that belong to specified Forms Of Support, and refresh effective toggled value.
         * @param {any} fos FOS that contains projects.
         */
        function updateEffectiveToggledForProjectsInFos(fos) {
          for (var s = 0; s < fos.projects.length; s++) {
            var project = fos.projects[s];
            setProjectEffectiveToggledValue(project);
          }
          updateCountOfEffectiveSelectedProjects();
        }

        /**
         * Find all projects that belong to specified LeadOrg, and refresh effective toggled value.
         * @param {any} leadOrg LeadOrg that contains projects.
         */
        function updateEffectiveToggledForProjectsInLeadOrg(leadOrg) {
          for (var t = 0; t < leadOrg.projects.length; t++) {
            var project = leadOrg.projects[t];
            setProjectEffectiveToggledValue(project);
          }
          updateCountOfEffectiveSelectedProjects();
        }

        /**
         * Iterate over all 'effectiveToggled' projects call updateEffectiveToggled,
         *   so that projects that should not be toggled anymore are un-toggled.
         */
        function tryEffectiveUntoggleProjects() {
          for (var i = 0; i < $scope.projectsData.length; i++) {
            const aLeadOrg = $scope.projectsData[i];
            for (var k = 0; k < aLeadOrg.projects.length; k++) {
              const project = aLeadOrg.projects[k];
              if (project.effectiveToggled) {
                setProjectEffectiveToggledValue(project);
              }
            }
          }
        }

        /**
         * Recalculates total nr of selected projects (based on how many have 'effectiveToggled'==true).
         */
        function updateCountOfEffectiveSelectedProjects() {
          var cnt = 0;

          for (var i = 0; i < $scope.projectsData.length; i++) {
            const aLeadOrg = $scope.projectsData[i];
            for (var k = 0; k < aLeadOrg.projects.length; k++) {
              const project = aLeadOrg.projects[k];
              if (project.effectiveToggled) {
                cnt++;
              }
            }
          }

          $scope.effectiveSelectedProjectsCount = cnt;
        }

        /**
        * Un-toggle projects that were clicked on explicitly.
        */
        function unToggleAllProjects() {
          for (var i = 0; i < $scope.projectsData.length; i++) {
            const aLeadOrg = $scope.projectsData[i];
            for (var k = 0; k < aLeadOrg.projects.length; k++) {
              const project = aLeadOrg.projects[k];
              if (project.toggled) {
                project.toggled = false;
              }
            }
          }
        }

        /**
        * Un-toggle leadOrgs that were clicked on explicitly.
        */
        function unToggleAllLeadOrgs() {
          for (var i = 0; i < $scope.projectsData.length; i++) {
            const aLeadOrg = $scope.projectsData[i];
            if (aLeadOrg.toggled) {
              aLeadOrg.toggled = false;
            }
          }
          for (var j = 0; j < $scope.orgs.length; j++) {
            const aLeadOrg = $scope.orgs[j];
            if (aLeadOrg.toggled) {
              aLeadOrg.toggled = false;
            }
          }
        }

        /**
        * Un-toggle sectors that were clicked on explicitly.
        */
        function unToggleAllSectors() {
          for (var i = 0; i < $scope.sectorsData.length; i++) {
            const sector = $scope.sectorsData[i];
            if (sector.toggled) {
              sector.toggled = false;
            }
          }
        }

        /**
        * Un-toggle FOSs that were clicked on explicitly.
        */
        function unToggleAllFormsOfSupport() {
          for (var i = 0; i < $scope.formsOfSupportData.length; i++) {
            const fos = $scope.formsOfSupportData[i];
            if (fos.toggled) {
              fos.toggled = false;
            }
          }
        }

        $scope.exploreSelectedProjects = function() {
          $scope.explorerBreadcrumbs.length = 0;
          $scope.explorerBreadcrumbs.push({type:'projects', items: [...$scope.selectedProjects]});
        };

        $scope.exploreSelectedFos = function() {
          $scope.explorerBreadcrumbs.length = 0;
          $scope.explorerBreadcrumbs.push({type:'fos', items: [...$scope.selectedFormsOfSupports]});
        };

        $scope.exploreSelectedSectors = function() {
          $scope.explorerBreadcrumbs.length = 0;
          $scope.explorerBreadcrumbs.push({type:'sectors', items: [...$scope.selectedSectors]});
        };

        $scope.exploreSelectedLeadOrgs = function() {
          $scope.explorerBreadcrumbs.length = 0;
          $scope.explorerBreadcrumbs.push({type:'leadOrgs', items: [...$scope.selectedLeadOrgs]});
        };

        function removeLastBreadcrumb() {
          if($scope.explorerBreadcrumbs.length > 0) {
            $scope.explorerBreadcrumbs.splice($scope.explorerBreadcrumbs.length - 1, 1)
          }
        }

        // $scope.destroyScrollbar = function() {
        //   $timeout(function() {
        //     $('.projects__container-aux').mCustomScrollbar("destroy");
        //   });
        // };
        $scope.updateScrollbar = function () {
          $timeout(function () {
            $('.projects__container-aux').mCustomScrollbar("update");
            $('.projects__container-aux').mCustomScrollbar("scrollTo", "left");
          });
        };


        $scope.toggleProjectSelected = function (project, sector) {
          if (project) {
            // if project is toggled:
            if (project.toggled) {
              var index = $scope.selectedProjects.indexOf(project);
              $scope.selectedProjects.splice(index, 1);

              obj = {};
              sectorCount = [];

              // Project is being un-toggled. When this happens from the 'project explorer' view,
              //  and the user has un-toggled the final project, we must also hide the explorer view.
              //  Otherwise the explorer view re-appears as soon as user selects a project again.
              if ($scope.selectedProjects.length === 0) {
                removeLastBreadcrumb();
              }

            }
            // if project is not selected:
            else if (!project.toggled) {
              if ($scope.selectedProjects.indexOf(project) === -1) {
                // add to array
                $scope.selectedProjects.push(project);
              }
            } // else if (!project.toggled)
            project.toggled = !project.toggled;
          } else if (sector) {
            for (var i = 0; i < $scope.projects.length; i++) {
              var iProject = $scope.projects[i];
              for (var k = 0; k < iProject.sectors.length; k++) {
                var iSector = iProject.sectors[k];
                if (iSector.id === sector.id) {
                  project.toggled = true;
                }
              }
            }
          }

          setProjectEffectiveToggledValue(project);
          updateCountOfEffectiveSelectedProjects();
        }; // end toggleProjectSelected


        // selects a sector
        $scope.toggleSectorSelected = function (sector) {
          // if sector is being turned off
          if (sector.toggled) {
            //De-select the sector.
            var index = $scope.selectedSectors.indexOf(sector);
            $scope.selectedSectors.splice(index, 1);

            var projectCounter = 0;
            // get number of selected projects if any in a sector
            if ($scope.selectedSectors.length > 0) {
              for (var p = 0; p < $scope.selectedSectors.length; p++) {
                var existingProjectLength = $scope.selectedSectors[p].projects.length;
                // Calculate the number of all projects along with the selected project sector
                projectCounter += existingProjectLength;
              }
            }
            // calculate sum of...
            var sumOfProjects = projectCounter;

            // Update all existing percentage
            for (var t = 0; t < $scope.selectedSectors.length; t++) {
              $scope.selectedSectors[t].percentage = $scope.selectedSectors[t].projects.length / sumOfProjects * 100;
            }

            // Sector is being un-toggled. When this happens from the 'sector explorer' view,
            //  and the user has un-toggled the final sector, we must also hide the explorer view.
            //  Otherwise the explorer view re-appears as soon as user selects a sector again.
            if ($scope.selectedSectors.length === 0) {
              removeLastBreadcrumb();
            }
          }
          // if sector is being turned on
          else if (!sector.toggled) {
            //Select the sector.
            if ($scope.selectedSectors.indexOf(sector) == -1) {
              $scope.selectedSectors.push(sector);

              const allProjects = [];
              const fosArrayHelper = [];
              var fosCounterArr = [];
              const uniqueListOfLeadOrgs = [];
              // loop through all lead orgs
              for (var i = 0; i < $scope.projectsData.length; i++) {
                // assign current leadorg to aLeadOrg
                const aLeadOrg = $scope.projectsData[i];
                var projectsInaSector;
                // bind current leadOrg's projects to scope.projects
                allProjects.push(...aLeadOrg.projects);
              }
              projectsInaSector = _.filter(allProjects, function (item, index) {
                return _.contains(item.sectorIDs, sector.id);
              });
              sector.projects = projectsInaSector;
              sector.percentageOfStudy = Math.round(sector.projects.length / allProjects.length * 100);

              // for each of the projects in the sector
              for (var s = 0; s < projectsInaSector.length; s++) {
                const sProject = projectsInaSector[s];
                const aLeadOrg = projectsInaSector[s].leadOrg;
                if (!_.contains(uniqueListOfLeadOrgs, sProject.leadOrg)) {
                  uniqueListOfLeadOrgs.push(sProject.leadOrg);
                }
                fosArrayHelper.push(...sProject.formsOfSupport);
                var fosCounter = _.countBy(fosArrayHelper, 'shortName');
                fosCounterArr = Object.keys(fosCounter).map(key => ({'name': key, 'numberOfTimes': fosCounter[key]}));
                for (var k = 0; k < fosCounterArr.length; k++) {
                  const kFos = fosCounterArr[k];
                  kFos.percentageFos = Math.round(kFos.numberOfTimes / projectsInaSector.length * 100);
                }
                sector.leadOrgs = uniqueListOfLeadOrgs;
                sector.fos = fosCounterArr;
              }
              var sector$ = sector;
              // get project length for a sector
              var selectedSectorProjectLength = projectsInaSector.length;
              // number to address
              var projectCounter = 0;
              var isMore = false;
              // get number of selected projects if any in a sector
              if ($scope.selectedSectors.length > 0) {
                if ($scope.selectedSectors.length === 1) {
                  $scope.selectedSectors[0].percentage = selectedSectorProjectLength / selectedSectorProjectLength * 100;
                } else {

                }
                for (var p = 0; p < $scope.selectedSectors.length; p++) {
                  var existingProjectLength = $scope.selectedSectors[p].projects.length;
                  // Calculate the number of all projects along with the selected project sector
                  projectCounter += existingProjectLength;
                  isMore = true;
                }
              } else {
                var percentage = selectedSectorProjectLength / selectedSectorProjectLength * 100;
                // $scope.selectedSectors.push({
                //   ...sector$,
                //   percentage: percentage,
                //   toggled: true
                // });
              }
              //  calculate sum of...
              if (isMore) {
                var sumOfProjects = projectCounter + selectedSectorProjectLength;
                var percentage = selectedSectorProjectLength / sumOfProjects * 100;

                // Push sector in selected sectors
                // $scope.selectedSectors.push({
                //   ...sector,
                //   percentage: percentage,
                //   toggled: true
                // });

                // Update all existing percentage
                for (var t = 0; t < $scope.selectedSectors.length; t++) {
                  $scope.selectedSectors[t].percentage = $scope.selectedSectors[t].projects.length / sumOfProjects * 100;
                }
              }
            }
          }
          sector.toggled = !sector.toggled;
          updateEffectiveToggledForProjectsInSector(sector);
        };


        $scope.toggleFormsOfSupportSelected = function (fos) {
          if (fos.toggled) {
            var index = $scope.selectedFormsOfSupports.indexOf(fos);
            $scope.selectedFormsOfSupports.splice(index, 1);

            // FOS is being un-toggled. When this happens from the 'explorer' view,
            //  and the user has un-toggled the final FOS, we must also hide the explorer view.
            //  Otherwise the explorer view re-appears as soon as user selects a FOS again.
            if ($scope.selectedFormsOfSupports.length === 0) {
              removeLastBreadcrumb();
            }

          } else if (!fos.toggled) {
            if ($scope.selectedFormsOfSupports.indexOf(fos) == -1) {
              // add to array
              $scope.selectedFormsOfSupports.push(fos);


              const allProjects = [];
              const sectorArrayHelper = [];
              var sectorCounterArr = [];
              const uniqueListOfLeadOrgs = [];
              // loop through all lead orgs
              for (var i = 0; i < $scope.projectsData.length; i++) {
                // assign current leadorg to aLeadOrg
                const aLeadOrg = $scope.projectsData[i];
                var projectsInaFos;
                // bind current leadOrg's projects to scope.projects
                allProjects.push(...aLeadOrg.projects);
              }

              projectsInaFos = _.filter(allProjects, function (item, index) {
                return _.contains(item.formsOfSupportIDs, fos.id);
              });
              fos.projects = projectsInaFos;
              fos.percentageOfStudy = Math.round(fos.projects.length / allProjects.length * 100);

              // for each of the projects in the fos
              for (var s = 0; s < projectsInaFos.length; s++) {

                const sProject = projectsInaFos[s];
                const aLeadOrg = projectsInaFos[s].leadOrg;

                if (!_.contains(uniqueListOfLeadOrgs, sProject.leadOrg)) {
                  uniqueListOfLeadOrgs.push(sProject.leadOrg);
                }
                // get all the sectors
                sectorArrayHelper.push(...sProject.sectors);
                var sectorCounter = _.countBy(sectorArrayHelper, 'name');

                sectorCounterArr = Object.keys(sectorCounter).map(key => ({
                  'name': key,
                  'numberOfTimes': sectorCounter[key]
                }));
                var newArray = getColorForEachSectorCounter(sectorCounterArr, projectsInaFos);
                for (var k = 0; k < sectorCounterArr.length; k++) {
                  const kSector = sectorCounterArr[k];
                  kSector.percentageSector = Math.round(kSector.numberOfTimes / projectsInaFos.length * 100);
                }

                fos.leadOrgs = uniqueListOfLeadOrgs;
                fos.sectors = newArray;
              }

              function getColorForEachSectorCounter(sectorCounterArr, projectsInaFos) {
                var result = [];
                for (var i = 0; i < $scope.sectorsData.length; i++) {
                  var sector = $scope.sectorsData[i];
                  for (var k = 0; k < sectorCounterArr.length; k++) {
                    var aSect = sectorCounterArr[k]
                    if (sector.name === aSect.name) {
                      result.push({
                        name: aSect.name,
                        color: sector.color,
                        numberOfTimes: aSect.numberOfTimes,
                        percentageSector: Math.round(aSect.numberOfTimes / projectsInaFos.length * 100)
                      })
                    }
                  }
                }
                return result;
              }
            }
          }
          fos.toggled = !fos.toggled;
          updateEffectiveToggledForProjectsInFos(fos);
        };

        // selects a leadOrg
        $scope.toggleLeadOrgSelected = function (leadOrg) {
          if (leadOrg.toggled) {
            var index = $scope.selectedLeadOrgs.indexOf(leadOrg);
            $scope.selectedLeadOrgs.splice(index, 1);

            // LeadOrg is being un-toggled. When this happens from the 'explorer' view,
            //  and the user has un-toggled the final LeadOrg, we must also hide the explorer view.
            //  Otherwise the explorer view re-appears as soon as user selects a LeadOrg again.
            if ($scope.selectedLeadOrgs.length === 0) {
              removeLastBreadcrumb();
            }

          } else if (!leadOrg.toggled) {
            if ($scope.selectedLeadOrgs.indexOf(leadOrg) == -1) {
              // add to array
              $scope.selectedLeadOrgs.push(leadOrg);


              const fosArrayHelper = [];
              var fosCounterArr = [];

              // for each of the projects in the selected leadorg
              for (var s = 0; s < leadOrg.projects.length; s++) {
                const aProject = leadOrg.projects[s];


                fosArrayHelper.push(...aProject.formsOfSupport);
                var fosCounter = _.countBy(fosArrayHelper, 'shortName');
                fosCounterArr = Object.keys(fosCounter).map(key => ({'name': key}));
                // for (var k = 0; k < fosCounterArr.length; k++) {
                //   const kFos = fosCounterArr[k];
                // }
                leadOrg.formsOfSupport = fosCounterArr;
              }
            }
          }
          leadOrg.toggled = !leadOrg.toggled;
          updateEffectiveToggledForProjectsInLeadOrg(leadOrg);
        };

        $scope.clearSelectedProjects = function () {
          //Strange, but this is how you clear an array and notify angular about it.
          $scope.selectedProjects.length = 0;
          unToggleAllProjects();
          tryEffectiveUntoggleProjects();
          updateCountOfEffectiveSelectedProjects();
        };

        $scope.clearSelectedLeadOrgs = function () {
          $scope.selectedLeadOrgs.length = 0;
          unToggleAllLeadOrgs();
          tryEffectiveUntoggleProjects();
          updateCountOfEffectiveSelectedProjects();
        };

        $scope.clearSelectedSectors = function () {
          $scope.selectedSectors.length = 0;
          unToggleAllSectors();
          tryEffectiveUntoggleProjects();
          updateCountOfEffectiveSelectedProjects();
        };

        $scope.clearSelectedFos = function () {
          $scope.selectedFormsOfSupports.length = 0;
          unToggleAllFormsOfSupport();
          tryEffectiveUntoggleProjects();
          updateCountOfEffectiveSelectedProjects();
        };

      } // end run function
    }]);
})();
