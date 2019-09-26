(function() {
  'use strict';
  angular.module('app')
    .component('introPopup', {
      templateUrl: 'app/popups/intro-popup.html',
      bindings: {
        isIntroPopupOpen:'='
      }
    })
    .component('aboutPopup', {
      templateUrl: 'app/popups/about-popup.html',
      bindings: {
        isAboutPopupOpen:'='
      }
    })
    .component('mobilePopup', {
      templateUrl: 'app/popups/mobile-popup.html',
      bindings: {}
    })
})();

