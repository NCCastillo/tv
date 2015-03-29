// Load modules

var Backbone = require('backbone');
var _ = require('lodash');

var ChannelSelectorView = require('./channelSelector');


// Declare internals

var internals = {};


exports = module.exports = internals.ToolbarView = Backbone.View.extend({

    template: require('../templates/toolbar.hbs'),

    events: {
        'focus .search': '_initializeInputActions',
        'keyup .search': '_triggerSearchChanged',
        'click .settings': '_triggerShowSettings',
        'click .clear': '_triggerClearFeed',
        'click .pause-resume': '_pauseResumeRequests',
        'click .search-clear-text': '_clearText'
    },

    render: function () {

        this.$el.html(this.template());

        new ChannelSelectorView({ el: this.$('.channel-selector-container'), model: this.model }).render();

        this._initializeSearchPopover();

        return this;
    },

    _initializeSearchPopover: function () {
        var self = this;
        this.searchPopover = self.$el.find('.search-popover');

        this.searchPopover.popover({
            title: 'To Search',
            content: 'This is the way you use search',
            trigger: 'hover',
            delay: { 'show': 500, 'hide': 100 },
            placement: 'bottom',
            container: 'body'
        });
    },

    _pauseResumeRequests: function (e) {

        var paused = $(e.currentTarget).find('.resume:visible').length === 1;

        if (paused) {
            this._resumeRequests();
        }
        else {
            this._pauseRequests();
        }
    },

    _pauseRequests: function () {

        this.$el.find('.pause').addClass('hidden');
        this.$el.find('.resume').removeClass('hidden');
        this.trigger('pause');
    },

    _resumeRequests: function () {

        this.$el.find('.pause').removeClass('hidden');
        this.$el.find('.resume').addClass('hidden');
        this.trigger('resume');
    },

    _triggerSearchChanged: _.debounce(function (e) {

        var queryString = $(e.currentTarget).val();
        this.trigger('searchChanged', queryString);
        this._updateInputActions(queryString);
    }, 200),

    _triggerShowSettings: function () {

        this.trigger('showSettings');
    },

    _triggerClearFeed: function () {

        this.trigger('clearFeed');
    },

    _clearText: function () {

        this.$el.find('.search').val('');
        this.$el.find('.search-clear-text').addClass('hidden');
        this.$el.find('.search-popover').removeClass('hidden');
        // this.$el.find('.search').focus();
    },

    _initializeInputActions: function () {

        this.$el.find('.search-clear-text').removeClass('hidden');
        this.$el.find('.search-popover').addClass('hidden');
    },

    _updateInputActions: function (queryString) {

        if (queryString.length === 0) {
            this.$el.find('.search-clear-text').addClass('hidden');
            this.$el.find('.search-popover').removeClass('hidden');
        } else {
            this.$el.find('.search-clear-text').removeClass('hidden');
            this.$el.find('.search-popover').addClass('hidden');
        }
    }

});
