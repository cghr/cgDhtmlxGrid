'use strict';

describe('Service: GridService', function () {


    var fakeServerBaseUrl = 'http://fakeServer:8080/';
    var currentLocation = '/user'

    // load the service's module
    beforeEach(angular.mock.module('cg.dhtmlxGrid.config'));
    beforeEach(module('cg.dhtmlxGrid.service'));

    // instantiate service
    var GridService, http, location, httpBackend;
    beforeEach(function () {
        module(function ($provide) {

            var mockGridConfig = {getGridServiceBaseUrl: function () {
                return fakeServerBaseUrl + 'api/GridService';
            }};
            $provide.value('GridConfig', mockGridConfig);
        });
    });


    beforeEach(inject(function (_GridService_, _$http_, _$location_, _$httpBackend_) {
        GridService = _GridService_;
        http = _$http_;
        location = _$location_;
        location.url(currentLocation);
        httpBackend = _$httpBackend_;
    }));

    it('should  get Data from a Restful GridService', function () {

        var dataUrl = fakeServerBaseUrl + 'api/GridService' + currentLocation;
        var mockResp = {username: "user1", roles: "user"};

        httpBackend.whenGET(dataUrl).respond(mockResp);

        GridService.getData().then(function (resp) {
            expect(resp.data).toEqual(mockResp);
        });
        httpBackend.flush();
    });


});
