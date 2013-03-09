App.Photo = App.FlickrModel.extend({
  title:      DS.attr('string'),
  owner:      DS.attr('string'),
  secret:     DS.attr('string'),
  server:     DS.attr('string'),
  farm:       DS.attr('number'),
  url_sq:     DS.attr('string'),
  height_sq:  DS.attr('number'),
  width_sq:   DS.attr('number'),
  url_t:      DS.attr('string'),
  height_t:   DS.attr('number'),
  width_t:    DS.attr('number')
}).reopenClass({

  getRecent: function(query) {
    var query = this._query(query), results;
    query.method = 'flickr.photos.getRecent';
    query.extras = 'url_sq,url_t,geo'
    return this.find(this._query(query));
  },

  getGetty: function(query) {
    var query = this._query(query);
    query.is_getty = true;
    query.method = 'flickr.photos.search';

    return this.find(query);
  },

  search: function(query) {
    var query = this._query(query);

    // query.bbox = '-70.4319,43.5555,-10.193,43.777';
    // query.min_upload_date = '2013-01-01 00:00:00';

    query.method = 'flickr.photos.search';

    return this.find(query);
  }
});
