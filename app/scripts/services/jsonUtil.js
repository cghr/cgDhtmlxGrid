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