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
