Em = Ember;
App = Em.Application.create();

require('src/flickr/flickr');

require('src/store');

require('src/mixins/pagination_support');
require('src/controllers/ember_data_controller');
require('src/controllers/lazy_data_source_controller');

require('src/routes/router');
