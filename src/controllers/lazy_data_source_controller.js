App.LazyDataSourceController = Em.ArrayController.extend({

  total: function() {
    return this.get('content.total');
  }.property('content.total'),

  perPage: function() {
    return this.get('content.perPage');
  }.property('content.perPage'),

  page: function() {
    return this.get('content.page');
  }.property('content.page'),

  nextPage: function() {
    Ember.assert("Need content to fetch the nextPage", !!this.get('content'));

    this.get('content').loadNextPage()
  }
});
