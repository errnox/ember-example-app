var App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter;

App.Task = DS.Model.extend({
  // id: DS.attr('number'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  done: DS.attr('boolean')
});

App.Task.reopenClass({
  FIXTURES: fixture_tasks
});

App.Router.map(function() {
  this.resource('task', {path: '/task/:task_id'});
  this.route('catchall', {path: '/*wildcard'});
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('task');
  },
  actions: {
    error: function() {
      this.transitionTo('catchall', 'application-error');
    }
  }
});

App.IndexController = Ember.Controller.extend({
  actions: {
    toggleInfo: function() {
      var infoSection = $('#main-info-section');
      var hiddenClass = 'hidden';
      if (infoSection.hasClass(hiddenClass)) {
        $(infoSection).removeClass(hiddenClass);
        $(infoSection).hide();
      }
      infoSection.slideToggle('fast');
    },
  }
});

App.ApplicationController = Ember.Controller.extend({
  taskIdSearchQuery: '',
  actions: {
    findTaskById: function() {
      var self = this;
      var taskId = parseInt(this.get('taskIdSearchQuery'));
      var redirect = function() {
        self.set('taskIdSearchQuery', 1);
        self.transitionTo('/index');
      };
      if (!isNaN(taskId)) {
        var task = this.store.find('task', taskId).then(function(task) {
          self.transitionTo('/task/' + taskId);
        }, function() {
	  redirect();
        });
      } else {
	redirect();
      }
    }
  }
});

App.TaskRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('task', params.task_id)
  }
});

App.TaskListGroupComponent = Ember.Component.extend({
  tagName: 'div',
  classNames: ['list-group'],
  classNameBindings: ['isUrgent:text-info:text-muted', 'textRight',
                      'noWell::well', 'priority'],
  attributeBindings: ['componentName:data-component-name'],
  componentName: 'navigation-list-group',
  isUrgent: false,
  textRight: false, // Class name gets dasherized: `is-urgent'
  noWell: true,
  priority: 'highestPriority', // Is added literally: `highestPriority'

  actions: {
    showInfo: function() {
      this.toggleProperty('isShowingInfo');
    }
  }
});
