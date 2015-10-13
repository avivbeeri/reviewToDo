var blessed = require('blessed');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var util = require('util');


function CommentsScreen() {
    'use strict';
    var self =  this;
    this.parent = undefined;
    this.comments = undefined;


    this.attachTo = function (parent, data) {
        parent.append(container);
        self.parent = parent;
        self.comments = data;
    };

    this.detach = function () {
        self.parent.remove(container);
    };

    var container = blessed.box({
        top: 'center',
        left: 'center',
        width: '94%',
        height: '95%',
        style: {
            fg: 'white'
        }
    });

    var commentsList = blessed.box({
        parent: container,
        top: 0,
        left: 0,
        width: '49%',
        height: '100%',
        scrollable: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white'
        }
    });

    var contextView = blessed.box({
        parent: container,
        top: 0,
        left: '52%',
        width: '49%',
        height: '100%',
        border: {
            type: 'line'
        },
        style: {
            fg: 'white'
        }
    });
    /*
    list.on('select', function (item, index) {

        // var request = self.requests[index];
        // self.emit('select', request, index);
    });
    */
}

util.inherits(CommentsScreen, EventEmitter);
module.exports = CommentsScreen;
