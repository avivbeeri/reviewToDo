var blessed = require('blessed');
var EventEmitter = require('events').EventEmitter;
var util = require('util');


function RepoListScreen() {
    'use strict';
    var self =  this;
    this.parent = undefined;
    this.attachTo = function (parent, data) {
        parent.append(list);
        self.parent = parent;
        list.setItems(data);
        list.focus();
        self.onAttach();
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

    list.on('select', function getRepos(item) {
        list.off('select', getRepos);
        var repoName = item.content;
        self.emit('select', repoName);
    });
}

util.inherits(RepoListScreen, EventEmitter);
module.exports = RepoListScreen;
