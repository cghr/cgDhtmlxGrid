/*! cgdhtmlxgrid - v0.0.1 - 2014-03-12 */'use strict';
angular.module('cg.dhtmlxGrid', ['cg.dhtmlxGrid.directive']);



'use strict';

angular.module('cg.dhtmlxGrid.directive', ['cg.dhtmlxGrid.config', 'cg.dhtmlxGrid.service', 'cg.dhtmlxGrid.jsonUtil'])
    .directive('dhtmlxGrid', function (GridConfig, GridService ,$compile, JsonUtil, $interval, $log) {
        return {
            template: '<div></div><div></div>',
            scope: {
                options: '='
            },
            restrict: 'E',
            link: function postLink(scope, element) {

                var GridUtil={

                    /* Renders grid from a given config */
                    renderGrid: function (config) {

                        config.gridElement.style.height = config.height;
                        config.gridElement.style.width = config.width;
                        config.pagingElement.style.width = config.width;
                        var mygrid = new dhtmlXGridObject(config.gridElement);
                        mygrid.setImagePath(config.imagePath);
                        mygrid.enablePaging(config.paging, config.recordsPerPage, 5, config.pagingElement, true);
                        mygrid.setPagingSkin(config.pagingSkin);
                        mygrid.setSkin(config.skin);
                        mygrid.setHeader(config.headings);
                        mygrid.attachHeader(config.filters);
                        angular.isDefined(config.sortings) ? mygrid.setColSorting(config.sortings) : angular.noop;
                        mygrid.init();
                        mygrid.parse(config.data, 'json');
                        $compile(angular.element(config.gridElement).contents())(scope);

                    },
                    /* Downloads config and data remotely and renders grid */
                    remoteInitialize: function (config) {


                        var self = this;
                        var success = function (resp) {
                            angular.extend(config, resp.data);
                            self.renderGrid(config, scope);
                        };
                        var fail = function () {
                            $log.error('Failed to fetch data from server');

                        };
                        GridService.getData().then(success, fail);

                    },
                    /* Resolve local data format */
                    resolveLocalInitialize: function (config) {
                        angular.extend(config, scope.options);
                        angular.isUndefined(scope.options.data) ? this.remoteInitialize(config, scope) : this.resolveDataFormatAndRenderGrid(config, scope);

                    },
                    /* Resolve data format to jsArray or json to render grid */
                    resolveDataFormatAndRenderGrid: function (config) {
                        (config.data instanceof  Array) ? (config.data = {rows: JsonUtil.jsonToArray(config.data)}) : angular.noop;
                        this.renderGrid(config, scope);
                    }
                };
                var config = {
                    gridElement: element.children()[0],
                    pagingElement: element.children()[1]
                };
                angular.extend(config, GridConfig);
                angular.isUndefined(scope.options) ? GridUtil.remoteInitialize(config) : GridUtil.resolveLocalInitialize(config);

                var AutoUpdateRunner = {
                    startAutoUpdate: function () {
                        $log.info('started auto update');
                        scope.intervalPromise = $interval(function () {
                            AutoUpdateRunner.checkForUpdates();
                        }, config.autoUpdateInterval);

                    },
                    checkForUpdates: function () {
                        $log.info('checking for updates');
                        var done = function (resp) {
                            scope.gridRows = resp.data.data.rows.length;
                        };
                        var fail = function () {
                            $log.error('Error while fetching data ');
                        };
                        GridService.getData().then(done, fail);

                    },
                    killAutoUpdate: function () {
                        $log.info('killed auto update');
                        if ($interval.cancel(scope.intervalPromise) === false) {
                            throw 'Failed to Cancel $interval';
                        }

                    }
                };


                (config.autoUpdate === true) ? AutoUpdateRunner.startAutoUpdate() : angular.noop; //Start Auto Update Grid when autoUpdate is true

                /*
                 Watch for Changes in Grid Rows
                 */
                scope.$watch('gridRows', function () {

                    (config.autoUpdate === true && angular.isUndefined(scope.options)) ? GridUtil.remoteInitialize(config) : angular.noop;

                });
                /*
                 Kill Auto Update when View is destroyed
                 */
                scope.$on('$destroy', function () {
                    config.autoUpdate === true ? AutoUpdateRunner.killAutoUpdate() : angular.noop;
                    $log.info('killed auto update');
                });

            }
        };
    });

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

'use strict';

angular.module('cg.dhtmlxGrid.jsonUtil', [])
    .factory('JsonUtil', function() {

        // Public API here
        return {
            jsonToArray: function(jsonArray) {
                var jsArray = [];
                var i = 0;
                angular.forEach(jsonArray, function(jsonObject) {
                    var innerArray = [];
                    angular.forEach(jsonObject, function(value) {
                        innerArray.push(value);
                    });
                    jsArray.push({
                        id: i++,
                        data: innerArray
                    });
                });
                return jsArray;
            }
        };
    });