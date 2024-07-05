// Assuming your AngularJS module is named 'app'
var app = angular.module('app', []);

// Configure CSRF token handling
app.config(function($httpProvider) {
    $httpProvider.interceptors.push(function() {
        return {
            'request': function(config) {
                // Add the CSRF token from the meta tag
                config.headers['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                return config;
            }
        };
    });
});