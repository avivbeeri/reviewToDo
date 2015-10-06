var Client  = require('node-rest-client').Client,
    q       = require('q'),
    _       = require('lodash');

module.exports = function (user, pass) {
        var optionsAuth = {user: user, password: pass};
        var client = new Client(optionsAuth);
        client.registerMethod("getAllTeams", "https://api.bitbucket.org/2.0/teams/?role=member", "GET");
        client.registerMethod("getRepositories", "https://api.bitbucket.org/2.0/repositories/${owner}", "GET");

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

        return this;
};
