'use strict';

var fs = require('fs')

require('angular-sanitize')

angular.module('hgTypeahead', [
    'ngSanitize'
])

.directive('hungryTypeahead', ['$compile', '$q', function($compile, $q) {    
    return {
        restrict: 'A',
        scope: {
            ngModel: '=',
            hungryTypeahead: '&',
        },
        require: ['ngModel'],
        link: function(scope, element, attrs, controllers) {
            element.after($compile(fs.readFileSync(__dirname + '/html/matches.html', 'utf8'))(scope));

            scope.$watch('ngModel', function(search) {
                var deferred = $q.defer();

                if (search) {
                    var sanitized = search.replace(/[^\w\s]/g, '')

                    var searchExpression = new RegExp("(" + sanitized + ")", "gi");

                    scope.hungryTypeahead({
                        search: angular.extend({}, deferred, {string: search})
                    }).then(function(matches) {
                        scope.matches = matches.filter(function(match) {
                            return match.match(searchExpression)
                        }).map(function(match) {
                            return match.replace(searchExpression, '<span class="match">$1</span>');
                        })
                    })
                } else {
                    scope.matches = null;
                }
            })
        }
    }
}])