var blessed = require('blessed'),
    Client  = require('node-rest-client').Client,
    bucketAPI = require('./bitbucket');

var LoginScreen = require('./loginScreen');

var userData = {
    username: undefined
};

// Configure REST Client
var client = new Client();
function createClient(username, password) {
    userData.username = username;
    var optionsAuth = {user: username, password: password};
    var client = new Client(optionsAuth);
    client.registerMethod("getAllTeams", "https://api.bitbucket.org/2.0/teams/?role=member", "GET");

    return client;
}

var screen = blessed.screen({
    smartCSR: true
});

screen.title = 'reviewToDo';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c', 'C-d'], function(ch, key) {
  return process.exit(0);
});


// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
    top: 'center',
    left: 'center',
    width: '95%',
    height: '95%',
    content: 'Hello {bold}world{/bold}!',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: '#f0f0f0'
        }
    }
});
// Append our box to the screen.
screen.append(box);
var loginScreen = new LoginScreen();
loginScreen.attachTo(screen);


loginScreen.on('submit', function (data) {
    // Check the credentials, then remove the loginForm.

    client = new bucketAPI(data.username, data.password);
    client.getAllRepositories().then(function (results) {
        loginScreen.detach();
        box.setText(JSON.stringify(results));
        screen.render();
    });
});

// Render the screen.
screen.render();
