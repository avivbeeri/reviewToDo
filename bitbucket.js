var Client  = require('node-rest-client').Client,
    q       = require('q'),
    _       = require('lodash');

module.exports = function (user, pass) {
        var optionsAuth = {user: user, password: pass};
        var client = new Client(optionsAuth);
        client.registerMethod("getAllTeams", "https://api.bitbucket.org/2.0/teams/?role=member", "GET");
        client.registerMethod("getRepositories", "https://api.bitbucket.org/2.0/repositories/${owner}", "GET");
        client.registerMethod("getPullRequests", "https://api.bitbucket.org/2.0/repositories/${slug}/pullrequests?state=MERGED", "GET");
        client.registerMethod("getPullRequestComments",
                              "https://bitbucket.org/api/2.0/repositories/${slug}/pullrequests/${id}/comments", "GET");


        //getPRComments(id)
        //

        this.getAllRepositories = function () {
            var deferred = q.defer();
            client.methods.getAllTeams(function (data) {
                var response = JSON.parse(data);
                var repositories = [];
                var promises = [];
                var teams = _.pluck(response.values, "username");
                _.forEach(teams, function (teamname) {
                    var options = {
                        path: {
                            "owner": teamname
                        }
                    };
                    var deferred = q.defer();
                    client.methods.getRepositories(options, function (data) {
                        var response = JSON.parse(data);
                        repositories.push(_.pluck(response.values, "full_name"));
                        deferred.resolve();
                    });
                    promises.push(deferred.promise);
                });
                q.all(promises).then(function () {
                    deferred.resolve(repositories);
                });
            });
            return deferred.promise;
        };

        this.getPullRequests = function (slug) {
            var deferred = q.defer();
            var options = {
                path: {
                    "slug": slug
                }
            };
            var deferred = q.defer();
            client.methods.getPullRequests(options, function (data) {
                var response = JSON.parse(data);
                deferred.resolve(response.values);
            });

            return deferred.promise;
        };

        this.getPullRequestComments = function (slug, id) {

            var deferred = q.defer();
            var options = {
                path: {
                    "slug": slug,
                    "id": id
                }
            };
            var deferred = q.defer();
            client.methods.getPullRequestComments(options, function (data) {
                var response = JSON.parse(data);
                deferred.resolve(response.values);
            });

            return deferred.promise;
        }

        return this;
};
