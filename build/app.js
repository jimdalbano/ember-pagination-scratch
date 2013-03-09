(function() {

Em = Ember;
App = Em.Application.create();



})();

(function() {

App.FlickrAPIKey = 'f9a3a8cbe838942e08ce5269507f56ca';


})();

(function() {

var get = Ember.get, set = Ember.set

App.FlickrAdapter = DS.RESTAdapter.extend({

  // Don't do it. Just don't. It means nothing in the context of Flickr.
  find: null,
  findAll: null,

  url: "https://secure.flickr.com/services/rest/",

  buildURL: function(record, suffix) {
    return this.url;
  },

  /*
    Override DS.RESTAdapter.didFindQuery only so that we can change the
    loader.populateArray function. Unfortunately, we can't just twiddle
    the populateArray function and let _super do the work. A hook would be nice.
    Especially since this sure seems like something a serializer ought to be

    doing rather than an adapter.
    TODO: Extract this into the model (probably) since the meta we're pulling
         here is likely Type (method_name) dependant.
  */
  didFindQuery: function(store, type, payload, recordArray) {
    var loader = DS.loaderFor(store);

    // ================================================
    // Pull out the meta before it hits the serializer.
    //
    if (type.toString() === 'App.Photo') {
      if (payload.stat === 'ok') {
        // some assumptions here....
        recordArray.set('page', payload.photos.page);
        recordArray.set('per_page', payload.photos.perpage);
        recordArray.set('pages', payload.photos.pages);
        recordArray.set('total', payload.photos.total);
      }
      payload = { 'photos' : payload.photos.photo };
    }
    // ================================================

    loader.populateArray = function(data) {
      // ================================================
      // We want to accumulate records in the array instead
      // of replacing the entire contents.
      data.forEach(function(item, index, enumerable){
        this.addReference(item);
      }, recordArray);
      // ================================================
    };
    get(this, 'serializer').extractMany(loader, payload, type);
  },

  // Override DS.RESTAdapter so that we can pull ContentType out of the request
  // headers for flickr. Flicker doesn't seem to like it for CORS requests.
  ajax: function(url, type, hash) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    // This is the header flicker won't accept for a CORS request.
    // hash.contentType = 'application/json; charset=utf-8';
    hash.context = this;

    if (hash.data && type != 'GET') {
      hash.data = JSON.stringify(hash.data);
    }

    jQuery.ajax(hash);
  }
});




})();

(function() {

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


})();

(function() {

App.Store = DS.Store.extend({
  revision: 12,
  adapter: App.FlickrAdapter.create()
});


})();

(function() {

/**
  https://gist.github.com/tchak/1559628

  It's not used in this project (yet?).

  Works well when you've got the entire dataset locally. Should be able
  to fit some on-demand fetching into it without too much issue.

*/

var get = Ember.get;

/**
  @extends Ember.Mixin

  Implements common pagination management properties for controllers.
*/
Ember.PaginationSupport = Ember.Mixin.create({
  /**
   */
  total: -1,

  /**
   */
  rangeStart: 0,

  /**
   */
  rangeWindowSize: 10,

  /**
   */
  rangeStop: Ember.computed('total', 'rangeStart', 'rangeWindowSize', function() {
    var rangeStop = get(this, 'rangeStart') + get(this, 'rangeWindowSize'),
    total = get(this, 'total');
    if (rangeStop < total) {
      return rangeStop;
    }
    return total;
  }).cacheable(),

  /**
   */
  page: Ember.computed('rangeStart', 'rangeWindowSize', function() {
    return (get(this, 'rangeStart') / get(this, 'rangeWindowSize')) + 1;
  }).cacheable(),

  /**
   */
  totalPages: Ember.computed('total', 'rangeWindowSize', function() {
    return Math.ceil(get(this, 'total') / get(this, 'rangeWindowSize'));
  }).cacheable(),

  /**
   */
  hasPrevious: Ember.computed('rangeStart', function() {
    return get(this, 'rangeStart') > 0;
  }).cacheable(),

  /**
   */
  hasNext: Ember.computed('rangeStop', 'total', function() {
    return get(this, 'rangeStop') < get(this, 'total');
  }).cacheable(),

  /**
  */
  didRequestRange: Ember.K,

  /**
   */
  nextPage: function() {
    if (get(this, 'hasNext')) {
      this.incrementProperty('rangeStart', get(this, 'rangeWindowSize'));
    }
  },

  /**
   */
  previousPage: function() {
    if (get(this, 'hasPrevious')) {
      this.decrementProperty('rangeStart', get(this, 'rangeWindowSize'));
    }
  },

  rangeDidChange: Ember.observer(function() {
    this.didRequestRange(get(this, 'rangeStart'), get(this, 'rangeStop'));
  }, 'rangeStart', 'rangeStop')
});


})();

(function() {

App.EmberDataController = Em.ArrayController.extend({

  total: null,
  page: 0,
  perPage: 3,

  _lastBatch: null,

  nextPage: function(start, end) {

    this.incrementProperty('page', 1);

    // Friggin' Flickr! api takes 'per_page' as an argument,
    //      but returns 'perpage' in meta of payload. Nice.
    // Also, see the comment in the observer below about why
    //      we're holding this batch here instead of just letting
    //      the records find their way into the Store.
    this.set('_lastBatch', App.Photo.getRecent({page: this.get('page'),
                                            per_page: this.get('perPage')}));
  }
}).reopen({
    lastBatchChanged: function() {
      Ember.run.once(this, function() {
        // Since this is basically a work-around for not having a good
        //  didLoad/isLoaded mechanism on RecordArrays, we'll only react
        //  when there's actually a total (which is returned as meta from
        //  the server and might take a little while to find its way here.
        if (this.get('_lastBatch.total')) {
          this.set('total', this.get('_lastBatch.total'));
        }
      });
    }.observes('_lastBatch.total')
});


})();

(function() {

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


})();

(function() {

App.Router.map(function() {
  this.route('lazy_data_source', {path: '/lazy_data_source'});
  this.route('ember_data', {path: '/ember_data'});
});


})();

(function() {

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


})();

(function() {

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


})();

(function() {

App.EmberDataRoute = Em.Route.extend({
  setupController: function(controller, model) {
    // Just show all of them. The controller will fetch more on-demand
    //  in the background
    controller.set('content', App.Photo.filter(function(photo){ return true;}));
  }
});


})();

(function() {

App.LazyDataSourceRoute = Em.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', new App.RecentPhotos());
  }
})


})();