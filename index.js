
var blessed        = require('blessed'),
    _              = require('lodash'),
    BucketAPI      = require('./bitbucket'),
    LoginScreen    = require('./loginScreen'),
    RepoListScreen = require('./repoListScreen');

var client;

var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'reviewToDo';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c', 'C-d'], function () {
    'use strict';
    // Function takes ch, key as parameters
    return process.exit(0);
});


// Create a list perfectly centered horizontally and vertically.
var list = blessed.list({
    top: 'center',
    left: 'center',
    width: '95%',
    height: '95%',
    keys: true,
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: '#f0f0f0'
        },
        selected: {
            bg: 'white'
        }
    }
});
// Append our list to the screen.

var loginScreen = new LoginScreen();
var repoScreen = new RepoListScreen();
loginScreen.attachTo(screen);

loginScreen.on('submit', function (data) {
    'use strict';
    // Check the credentials, then remove the loginForm.
    client = new BucketAPI(data.username, data.password);
    client.getAllRepositories().then(function (results) {
        loginScreen.detach();
        repoScreen.attachTo(screen, _.flatten(results).sort());
        screen.render();
    });
});



repoScreen.on('select', function (repoName) {
    'use strict';
    repoScreen.detach();

    client.getPullRequests(repoName).then(function (responseValues) {
        var requests = _.map(responseValues, _.partialRight(_.pick, ['title', 'id']));
        var requestNames = _.pluck(requests, 'title').sort();
        list.setItems(requestNames);
        list.focus();
        screen.append(list);
        screen.render();

        list.on('select', function getComments(item, index) {
            list.off('select', getComments);
            var id = requests[index].id;
            client.getPullRequestComments(repoName, id).then(function (responseValues) {
                var comments = _(responseValues).reject(function (comment) {
                    return comment.parent !== undefined;
                }).map(_.partialRight(_.pick, ['content', 'id', 'user', 'inline'])).value();
                var commentContent = _.pluck(comments, 'content.raw');
                list.setItems(commentContent);
                list.focus();
                screen.render();
            });

        });

    });


});



// Render the screen.
screen.render();
