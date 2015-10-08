var blessed = require('blessed');
var EventEmitter = require("events").EventEmitter;
var util = require('util');


function LoginScreen() {

    var self =  this;
    this.parent = undefined;
    this.attachTo = function (parent) {
        parent.append(form);
        self.parent = parent;
        self.onAttach();
    };

    this.detach = function () {
        self.parent.remove(form);
    }

    this.onAttach = function () {
        form.focus();
        usernameInput.focus();
    };

    var form = blessed.form({
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

    form.on('submit', function (data) {
        self.emit('submit', data);
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
        keys: true,
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

    submit.on('press', function () {
        form.submit();
    })

    return this;
};

util.inherits(LoginScreen, EventEmitter);
module.exports = LoginScreen;
