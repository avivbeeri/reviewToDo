var blessed = require('blessed'),
    Client  = require('node-rest-client').Client;

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

var form = blessed.form({
    parent: box,
    width: '50%',
    height: 7,
    border: {
        type: 'line'
    },
    keys: true,
    tags: true,
    top: 'center',
    left: 'center'

});

blessed.text({
    parent: form,
    content: "Username:"
});

var usernameInput = blessed.textbox({
    parent: form,
    name: 'username',
    height: 1,
    top: 1,
    inputOnFocus: true,
    style: {
            fg: '#f6f6f6',
            bg: '#353535'
    },
});

blessed.text({
    parent: form,
    content: "Password:",
    top: 2
});

var passwordInput = blessed.textbox({
    parent: form,
    name: 'password',
    top: 3,
    height: 1,
    inputOnFocus: true,
    censor: true,
    style: {
            fg: '#f6f6f6',
            bg: '#353535'
    }
});

var submit = blessed.button({
  parent: form,
  mouse: true,
  keys: true,
  shrink: true,
  padding: {
    left: 1,
    right: 1
  },
  left: 'center',
  width: 10,
  top: 4,
  name: 'submit',
  content: 'submit',
  style: {
    focus: {
       bg: 'blue',
       fg: 'white'
    },
    hover: {
      bg: 'blue',
      fg: 'white'
    }
  },
  border: {
    type: 'line'
  }
});

form.on('submit', function (data) {
    client = createClient(data.username, data.password);

    // Check the credentials, then remove the loginForm.
    box.remove(form);
    client.methods.getAllTeams(function (data, response) {
        var info = JSON.parse(data);
        box.setText(JSON.stringify(info));
        screen.render();
    });
});

submit.on('press', function () {
    form.submit();
})
// Focus on `escape` or `i` when focus is on the screen.
screen.key(['tab'], function() {
    // Set the focus on the input.
    form.focusNext();
});
form.focus();

// Render the screen.
screen.render();
