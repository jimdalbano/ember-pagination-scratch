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


