/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

  A lazy loading paginated data source. This technique shamelessly lifted
  from Addepar's ember-table project.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

App.RecentPhotos = Em.ArrayProxy.extend({

  page: function() {
    return Math.floor(this.get('content.length') / this.get('perPage'));
  }.property('content.length'),

  perPage: 3,
  total: 0,
  content: Ember.A([]),

  makePhoto: function(row, data) {
    row.set('id', data.id);
    row.set('url_sq', data.url_sq);
    row.set('farm', data.farm);
    row.set('isLoaded', true);
  },

  objectAt: function(index) {
    if (index == -1) {return null;}

    var content = this.get('content'),
        record = content[index];

    if (record) {
      return record;
    }

    this.loadNextPage();
    return this.objectAt(index);
  },

  loadNextPage: function() {
    var url = "https://secure.flickr.com/services/rest/",
        content = this.get('content'),
        start = content.length,
        page = Math.floor(start / this.get('perPage') + 1),
        queryStringArgs, queryString;

    for (var i = start + this.get('perPage') - 1; i >= start; i--) {
      content.pushObject(Ember.Object.create({
        url_sq: 'http://placehold.it/75x75',
        isLoaded: false }));
    }

    queryStringArgs = { api_key: "f9a3a8cbe838942e08ce5269507f56ca",
                        format: 'json',
                        nojsoncallback: '1',
                        method: 'flickr.photos.getRecent',
                        page: page,
                        per_page: this.get('perPage'),
                        extras: 'url_sq' };

    queryString = jQuery.param(queryStringArgs);
    url = [url, queryString].join('?');

    var success = function(json) {
      this.set('total', json['photos']['total']);

      root = json['photos']['photo'];
      root.forEach(function(item, index, enumerable) {
        row = content[start + index];
        this.makePhoto(row, item);
      }, this);
    };

    this.ajax(url, 'GET', {success: success});
  },

  ajax: function(url, type, hash) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.context = this;

    if (hash.data && type != 'GET') {
      hash.data = JSON.stringify(hash.data);
    }

    jQuery.ajax(hash);
  }
});
