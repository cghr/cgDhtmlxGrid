'use strict';

angular.module('cg.dhtmlxGrid.service', ['cg.dhtmlxGrid.config'])
    .factory('GridService', function (GridConfig, $http, $location) {



        // Public API here
        return {
            getData: function () {

                var dataUrl = GridConfig.getGridServiceBaseUrl() + $location.url();
                return $http.get(dataUrl);
            }
        };
    });
