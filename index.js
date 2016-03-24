'use strict';

angular.module('hgTypeahead', [])

.directive('hungryTypeahead', ['$compile', '$q', function($compile, $q) {
    return {
        restrict: 'A',
        scope: {
            ngModel: '=',
            hungryTypeahead: '&',
        },
        require: ['ngModel'],
        link: function(scope, element, attrs, controllers) {
            element.after($compile(require('./html/matches.html'))(scope));

            scope.$watch('ngModel', function(search) {
                var deferred = $q.defer();

                var searchExpression = new RegExp(search,"gi");

                if (search) {
                    scope.hungryTypeahead({
                        search: angular.extend({}, deferred, {string: search})
                    }).then(function(matches) {
                        scope.matches = matches.filter(function(match) {
                            return match.match(searchExpression)
                        })
                    })
                } else {
                    scope.matches = null;
                }
            })
        }
    }
}])