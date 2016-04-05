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
            onSelect: '&',
        },
        require: ['ngModel', 'hungryTypeahead'],
        controller: function() {

        },
        link: function(scope, element, attrs, controllers) {
            element.after($compile(fs.readFileSync(__dirname + '/html/matches.html', 'utf8'))(scope));

            scope.$watch('ngModel', function(search) {
                var deferred = $q.defer();

                if (search) {
                    var sanitized = search.replace(/[^\w\s]/g, '')

                    var searchExpression = new RegExp("(" + sanitized + ")", "gi");

                    scope.hungryTypeahead({
                        search: angular.extend({}, deferred, {title: search})
                    }).then(function(matches) {
                        scope.matches = matches.filter(function(match) {
                            return match.title.match(searchExpression)
                        }).map(function(match) {
                            return angular.extend(match, {
                                select: function() {
                                    scope.onSelect({match: this});
                                },
                                title: match.title,
                                match: match.title.replace(searchExpression, '<span class="match">$1</span>')
                            })
                        })
                    })
                } else {
                    scope.matches = null;
                }
            })
        }
    }
}])