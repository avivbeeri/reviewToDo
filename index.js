
var blessed     = require('blessed'),
    _           = require('lodash'),
    BucketAPI   = require('./bitbucket'),
    LoginScreen = require('./loginScreen');

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
screen.append(list);
var loginScreen = new LoginScreen();
loginScreen.attachTo(screen);

loginScreen.on('submit', function (data) {
    'use strict';
    // Check the credentials, then remove the loginForm.
    client = new BucketAPI(data.username, data.password);
    client.getAllRepositories().then(function (results) {
        loginScreen.detach();
        list.setItems(_.flatten(results));
        list.focus();
        screen.render();
    });
});



list.on('select', function getRepos(item) {
    'use strict';
    list.off('select', getRepos);
    var repoName = item.content;
    client.getPullRequests(repoName).then(function (responseValues) {
        var requests = _.map(responseValues, _.partialRight(_.pick, ['title', 'id']));
        var requestNames = _.pluck(requests, 'title');
        list.setItems(requestNames);
        list.focus();
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
