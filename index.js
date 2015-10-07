var blessed = require('blessed'),
Client  = require('node-rest-client').Client,
_       = require('lodash'),
bucketAPI = require('./bitbucket');

var LoginScreen = require('./loginScreen');

var userData = {
    username: undefined
};

var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'reviewToDo';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c', 'C-d'], function(ch, key) {
    return process.exit(0);
});


// Create a box perfectly centered horizontally and vertically.
var box = blessed.list({
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
    },

});
// Append our list to the screen.
screen.append(list);
var loginScreen = new LoginScreen();
loginScreen.attachTo(screen);


loginScreen.on('submit', function (data) {
    // Check the credentials, then remove the loginForm.
    client = new bucketAPI(data.username, data.password);
    client.getAllRepositories().then(function (results) {
        loginScreen.detach();
        list.setItems(_.flatten(results));
        list.focus();
        screen.render();
    });
});

list.on('select', function (repository) {
    client.getPullRequests(item).then(function (requests) {
        list.setItems(requests);
        list.focus();
        screen.render();
    });
});



// Render the screen.
screen.render();
