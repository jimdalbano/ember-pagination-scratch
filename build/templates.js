Ember.TEMPLATES["application"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, stack2, hashTypes, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  data.buffer.push("Addepar's Lazy Data Source Inspired");
  }

function program3(depth0,data) {
  
  
  data.buffer.push("Ember-data");
  }

  data.buffer.push("<ul>\n  <li> ");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "lazy_data_source", options) : helperMissing.call(depth0, "linkTo", "lazy_data_source", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n  <li> ");
  hashTypes = {};
  options = {hash:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers.linkTo),stack1 ? stack1.call(depth0, "ember_data", options) : helperMissing.call(depth0, "linkTo", "ember_data", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("</li>\n</ul>\n\n");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("\n");
  return buffer;
  
});

Ember.TEMPLATES["ember_data"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <div>\n    <image ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("photo.url_sq")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(" />\n  </div>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n  <div>get the next page</div>\n");
  }

  data.buffer.push("<h2>ember-data Technique</h2>\n\n<h5>Pages Fetched: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "page", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" </h5>\n<h5>Per Page: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "perPage", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n<h5>Total: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "total", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n\n<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "nextPage", {hash:{},contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Next Page</button>\n<hr />\n\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "photo", "in", "controller", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  return buffer;
  
});

Ember.TEMPLATES["lazy_data_source"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Ember.Handlebars.helpers; data = data || {};
  var buffer = '', stack1, hashTypes, escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = '', hashTypes;
  data.buffer.push("\n  <div>\n    <image ");
  hashTypes = {'src': "STRING"};
  data.buffer.push(escapeExpression(helpers.bindAttr.call(depth0, {hash:{
    'src': ("photo.url_sq")
  },contexts:[],types:[],hashTypes:hashTypes,data:data})));
  data.buffer.push(" />\n  </div>\n");
  return buffer;
  }

function program3(depth0,data) {
  
  
  data.buffer.push("\n  <div>wait for it....</div>\n");
  }

  data.buffer.push("<h2>Addepar's Lazy Data Source Inspired Technique</h2>\n\n<h5>Pages Fetched: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "page", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push(" </h5>\n<h5>Per Page: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "perPage", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n<h5>Total: ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "total", {hash:{},contexts:[depth0],types:["ID"],hashTypes:hashTypes,data:data})));
  data.buffer.push("</h5>\n\n<button ");
  hashTypes = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "nextPage", {hash:{},contexts:[depth0],types:["STRING"],hashTypes:hashTypes,data:data})));
  data.buffer.push(">Next Page</button>\n<hr />\n\n");
  hashTypes = {};
  stack1 = helpers.each.call(depth0, "photo", "in", "controller", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  
});