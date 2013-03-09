App.EmberDataRoute = Em.Route.extend({
  setupController: function(controller, model) {
    // Just show all of them. The controller will fetch more on-demand
    //  in the background
    controller.set('content', App.Photo.filter(function(photo){ return true;}));
  }
});
