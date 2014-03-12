'use strict';

angular.module('cg.dhtmlxGrid.config', [])
    .factory('GridConfig', function ($rootScope) {

        // Public API here
        return {
            width: '600px',
            height: '300px',
            autoUpdate: false,
            autoUpdateInterval: 10000,
            imagePath: 'assets/imgs/',
            skin: 'modern',
            pagingSkin: 'bricks',
            paging: true,
            recordsPerPage: 500,
            getGridServiceBaseUrl: function () {
                if (angular.isUndefined($rootScope.serviceBaseUrl)){
                    throw  'Error ! service base url Not Found in $rootScope';
                }

                return $rootScope.serviceBaseUrl + 'api/GridService';
            }
        };
    });
