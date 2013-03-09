App.LazyDataSourceRoute = Em.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', new App.RecentPhotos());
  }
})
