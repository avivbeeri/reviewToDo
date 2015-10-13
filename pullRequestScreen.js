var blessed = require('blessed');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var util = require('util');


function PullRequestScreen() {
    'use strict';
    var self =  this;
    this.parent = undefined;
    this.requests = undefined;


    this.attachTo = function (parent, data) {
        parent.append(list);
        self.parent = parent;

        self.requests = data;
        var requestNames = _.pluck(self.requests, 'title').sort();

        list.setItems(requestNames);
        list.focus();
    };

    this.detach = function () {
        self.parent.remove(list);
    };

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

    list.on('select', function (item, index) {

        var request = self.requests[index];
        self.emit('select', request, index);
    });
}

util.inherits(PullRequestScreen, EventEmitter);
module.exports = PullRequestScreen;
