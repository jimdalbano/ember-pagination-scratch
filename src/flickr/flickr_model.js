App.FlickrModel = DS.Model.extend({
}).reopenClass({
  format: 'json',
  nojsoncallback: '1',

  _query: function(query) {
    Ember.assert("No query was supplied for findQuery search", !!query);
    query.format = this.format;
    query.nojsoncallback = this.nojsoncallback;
    query.api_key =  App.FlickrAPIKey;

    return query;
  }

});
