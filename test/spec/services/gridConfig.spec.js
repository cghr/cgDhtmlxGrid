'use strict';

describe('Service: GridConfig', function () {

    var fakeServiceBaseUrl = "http://fakeServer/"
    // load the service's module
    beforeEach(module('cg.dhtmlxGrid.config'));

    // instantiate service
    var GridConfig, $rootScope;
    beforeEach(inject(function ($rootScope, _GridConfig_) {

        $rootScope = $rootScope;
        $rootScope.serviceBaseUrl = fakeServiceBaseUrl;
        GridConfig = _GridConfig_;


    }));


    it('should do verify default Grid Config and GridService Base url', function () {


        var gridServiceBaseUrl = GridConfig.getGridServiceBaseUrl;
        delete GridConfig.getGridServiceBaseUrl;


        expect(GridConfig).toEqual({
            width: '600px',
            height: '300px',
            autoUpdate: false,
            autoUpdateInterval: 10000,
            imagePath: 'assets/imgs/',
            skin: 'modern',
            pagingSkin: 'bricks',
            paging: true,
            recordsPerPage: 500});

        expect(gridServiceBaseUrl()).toEqual(fakeServiceBaseUrl + 'api/GridService');
    });

});
