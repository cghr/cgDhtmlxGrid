'use strict';

describe('Directive: dhtmlxGrid', function () {

    var fakeServiceBaseUrl = 'http://fakeServer/';
    var dataUrl = fakeServiceBaseUrl + 'api/GridService/country';

    var element,
        scope, gridData, compile, deferred, q;
    var jsArrayData = {'rows': [
        {'id': 1, 'data': [1, 'india', 'asia']},
        {'id': 2, 'data': [2, 'pakistan', 'asia']},
        {'id': 3, 'data': [3, 'srilanka', 'asia']}
    ]};
    var standarJSONData = [
        {id: 1, name: 'india', continent: 'asia'},
        {id: 2, name: 'pakistan', continent: 'asia'},
        {id: 3, name: 'srilanka', continent: 'asia'}
    ];
    var mockResponse = {status: 200, data: {headings: 'id,name,continent', filters: '#text_filter,#text_filter,#text_filter', sortings: 'int,str,str', data: jsArrayData }};


    // load the directive's module
    beforeEach(angular.mock.module('cg.dhtmlxGrid.service'));
    beforeEach(module('cg.dhtmlxGrid.directive'));

    beforeEach(function () {
        module(function ($provide) {

            var mockGridService = {getData: function () {
                deferred = q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            }};
            $provide.value('GridService', mockGridService);
        });
    });

    beforeEach(inject(function ($rootScope, $compile, $q) {
        scope = $rootScope.$new();
        compile = $compile;
        q = $q;
    }));


    function initializeGridLocally() {
        element = angular.element("<dhtmlx-grid options='gridOptions'></dhtmlx-grid>");
        gridData = mockResponse.data;

        scope.gridOptions = gridData;
        element = compile(element)(scope);
        scope.$digest();

    }

    function initializeGridLocallyWithStandardJSONData() {
        element = angular.element("<dhtmlx-grid options='gridOptions'></dhtmlx-grid>");
        gridData = mockResponse.data;
        delete gridData.data; //Delete jsArray format data
        gridData.data = standarJSONData; //Assign Standard Json data

        scope.gridOptions = gridData;
        element = compile(element)(scope);
        scope.$digest();

    }

    function initializeGridRemotely() {
        element = angular.element('<dhtmlx-grid></dhtmlx-grid>');
        element = compile(element)(scope);
        scope.$digest();

    }

    function initializeGridWithLocalConfigAndRemoteData() {


        element = angular.element("<dhtmlx-grid options='gridOptions'></dhtmlx-grid>");
        gridData = mockResponse.data;
        var gridDataCopy = {};
        angular.copy(gridData, gridDataCopy);


        scope.gridOptions = gridDataCopy;
        delete scope.gridOptions.data; //Remove local data so that it'd be loaded from server
        element = compile(element)(scope);
        scope.$digest();

    }

    it('should render grid initialized locally', function () {

        initializeGridLocally();
        verifyGridHeadings();
        verifyGridFilters();
        verifyRowsAndColumns();
        verifyPagination();


    });

    it('should render grid initialized from remote config and data', function () {

        initializeGridRemotely();
        verifyGridHeadings();
        verifyGridFilters();
        verifyRowsAndColumns();
        verifyPagination();


    });

    it('should render grid initialized from local config and remote data', function () {

        initializeGridWithLocalConfigAndRemoteData();
        verifyGridHeadings();
        verifyGridFilters();
        verifyRowsAndColumns();
        verifyPagination();


    });
    it('should render grid from a Standard Json Data Initialization from local config', function () {

        initializeGridLocallyWithStandardJSONData();
        verifyGridHeadings();
        verifyGridFilters();
        verifyRowsAndColumns();
        verifyPagination();


    });
    function verifyGridHeadings() {

        var headings = jQuery(element).find('div.xhdr table tbody tr td div.hdrcell').text();
        expect(headings).toBe('idnamecontinent');

    }

    function verifyGridFilters() {
        var filters = jQuery(element).find('div.xhdr table tbody tr td div.hdrcell input:text');
        expect(filters.length).toBe(3);

    }

    function verifyRowsAndColumns() {
        var rowCount = jQuery(element).find('div.objbox table tbody tr').length;
        var columnCount = jQuery(element).find('div.objbox table tbody tr:first th').length;

        expect(rowCount - 1).toEqual(3);//First Row is  for formatting,doesn't contain data
        expect(columnCount).toEqual(3);


    }

    function verifyPagination() {

        var pagingInfo = jQuery(element).find('div.dhx_pager_info_modern');
        expect(pagingInfo.html()).toBe('<div>Records from 1 to 3 of 3</div>');


    }


});
describe('Dhtmlx Grid Directive Auto Update mode', function () {

    var fakeServiceBaseUrl = 'http://fakeServer/';
    var dataUrl = fakeServiceBaseUrl + 'api/GridService/country';

    var element,
        scope, gridData, compile, deferred, q,interval;
    var jsArrayData = {'rows': [
        {'id': 1, 'data': [1, 'india', 'asia']},
        {'id': 2, 'data': [2, 'pakistan', 'asia']},
        {'id': 3, 'data': [3, 'srilanka', 'asia']}
    ]};
    var jsArrayDataUpdated=
    {'rows': [
        {'id': 1, 'data': [1, 'india', 'asia']},
        {'id': 2, 'data': [2, 'pakistan', 'asia']},
        {'id': 3, 'data': [3, 'srilanka', 'asia']},
        {'id': 4, 'data': [4, 'china', 'asia']}
    ]};

    var mockResponse = {status: 200, data: {headings: 'id,name,continent', filters: '#text_filter,#text_filter,#text_filter', sortings: 'int,str,str', data: jsArrayData }};


    // load the directive's module
    beforeEach(angular.mock.module('cg.dhtmlxGrid.service'));
    beforeEach(module('cg.dhtmlxGrid.directive'));

    beforeEach(function () {
        module(function ($provide) {

            var mockGridService = {getData: function () {
                deferred = q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            }};
            $provide.value('GridService', mockGridService);
        });
    });

    beforeEach(inject(function ($rootScope, $compile, $q,GridConfig,_$interval_) {
        scope = $rootScope.$new();
        compile = $compile;
        q = $q;
        interval=_$interval_;
        GridConfig.autoUpdate=true;
        GridConfig.autoUpdateInterval=10000;

    }));

    function initializeGridRemotely() {
        element = angular.element('<dhtmlx-grid></dhtmlx-grid>');
        element = compile(element)(scope);
        scope.$digest();

    }
    it('should render grid initialized from remote config and data and auto update on data changes', function () {

        initializeGridRemotely();
        verifyRowsAndColumns();
        mockResponse.data.data=jsArrayDataUpdated;
        interval.flush(10000);
        verifyRowsAndColumnsAfterUpdate();
        var isolateScope=element.scope();
        isolateScope.$destroy();

    });
    function verifyRowsAndColumns() {
        var rowCount = jQuery(element).find('div.objbox table tbody tr').length;
        var columnCount = jQuery(element).find('div.objbox table tbody tr:first th').length;

        expect(rowCount - 1).toEqual(3);//First Row is  for formatting,doesn't contain data
        expect(columnCount).toEqual(3);

    }
    function verifyRowsAndColumnsAfterUpdate() {
        var rowCount = jQuery(element).find('div.objbox table tbody tr').length;
        var columnCount = jQuery(element).find('div.objbox table tbody tr:first th').length;

        expect(rowCount - 1).toEqual(4);//First Row is  for formatting,doesn't contain data
        expect(columnCount).toEqual(3);
    }

});
