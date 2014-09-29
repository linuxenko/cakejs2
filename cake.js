;(function() {
	'use strict';

	var Module = function() {
		this.scope = {
			libPath : '',
			appPath : '',
			params : [],
			modules : []
		};

		this.route = {
			name : '',
			routes : [],
			params : []
		};

		var initialize = function() {
			var self = this;

			var preConfigure = function() {
				var  i, c,
				scripts = document.getElementsByTagName('script');

				for (i = 0; i < scripts.length; i++) {
					c = scripts[i];
					if (typeof c.getAttribute('data-main') == 'string') {
						self.scope.libPath = c.getAttribute('src').match(/^(.*\/).+\.js$/)[1] || null;
						self.scope.appPath = c.getAttribute('data-main') || null;
						break;
					}
				}

				//if (!self.findModule('App') && self.scope.appPath.length > 1)
				//	self.require('App', null);
			};

			preConfigure();
		};

		this.load = function(params, callback) {
			var iterations = params.length, d = null, i = 0;

			if (typeof $ != 'undefined')
				d = $.Deferred();

			var complete = function() {
				if (--iterations <= 0) {
					if (typeof callback == 'function')
						callback();
					if (d !== null)
						d.resolve();
				}
			};

			for (i in params) {
				this.require(params[i], complete.bind(this));
			}

			return d;
		};

		this.router = function(params) {
			var self = this;

			self.route.routes = params;

			var openRoute = function(name) {
				var route = self.route.routes[name], i = 0;

				if (typeof route.controllers == 'undefined')
					return;

				self.load(route.controllers, function() {
					for (i =0; i < route.controllers.length; i++) {
						self.findModule(route.controllers[i]).active = false;
						self.startModule.call(self,route.controllers[i]);
					}

				});
			};

			var makeRoute = function() {
				var hash = window.location.hash;

				if (hash.length < 1)
					return openRoute('home');

				var tmp = hash.split('/');
				var name = tmp[0].match(/^#(.*)$/)[1];
				var params = [];

				for (var i = 1; i < tmp.length; i++)
					params.push(tmp[i]);

				self.route.backName = self.route.name.toString();
				self.route.backParams = self.route.params;
				if (typeof self.route.URL !== 'undefined' && self.route.backName != 'logout')
					self.route.backURL = self.route.URL;
				self.route.URL = window.location.href;
				self.route.name = name;
				self.route.params = params;

				openRoute(name);
			};

			window.onpopstate = makeRoute;
			makeRoute();
		};

		this.startModule = function(name) {
			var self = this,
			mod = self.findModule(name),
			deps = {},
			d,
			i = 0;

			if (mod === null || mod.active === true)
				return;
			
			for (; i < mod.deps.length; i++) {
				d = self.findModule(mod.deps[i]);
				if (!d)
					return self.load(mod.deps, self.startModule.bind(self, name));
				
				deps[d.name] = d.module;
			}

			mod.active = true;

			if (typeof mod.module == 'function') {
				mod.module(deps);
			}

			if (typeof mod.module == 'object' && typeof mod.module.init == 'function') {
				mod.module.init(deps);
			}
		};

		this.findModule = function(name) {
			for (var i in this.scope.modules) {
				if (this.scope.modules[i].name == name)
					return this.scope.modules[i];
			}
			return null;
		};

		this.require = function(name, cb) {
			var self = this, url = name, callback = cb,
				script, d = null, modules = self.scope.modules, mod = null;

			if (typeof $ != 'undefined')
				d = $.Deferred();

			if (typeof url == 'undefined')
				return;

			if ((mod = self.findModule(url)) !== null) {
				d.resolve(mod.module);
				if (typeof callback == 'function')
					callback(mod.module);
				if (typeof mod.module == 'function')
					self.define(mod.name, mod.deps, mod.module);
				return;
			}

			if (!url.match(/^.*\.js/))
				url = self.scope.appPath + url + '.js';

			script = document.createElement('script');
			script.setAttribute('src', url);

			script.onload = script.onreadystatechange = function() {
				if (typeof callback == 'function')
					callback(this);
				
				if (d !== null)
					d.resolve(this);
			};

			script.onerror = function(e) {
				if (d !== null)
					d.reject(e);
			};

			document.head.appendChild(script);

			return d;
		};

		this.define = function(name, deps, mod) {
			var modules = this.scope.modules,
			self = this;

			var hasModule = function(name) {
				for (var i in modules) {
					if (modules[i].name == name)
						return true;
				}

				return false;
			};

			var hasModules = function(names) {
				for (var i in names)
					if (!hasModule(names[i]))
						return false;

				return true;
			};

			var appendModule = function(params) {
				if (!hasModule(params.name))
					modules.push(params);
			};

			var loadDeps = function(loadDeps, name) {
		
			};

			var module = mod;

			if (typeof name != 'string')
				return;

			if (typeof module == 'undefined')
				module = deps;

			if (typeof deps == 'object' && (typeof mod == 'object' || typeof mod == 'function'))
				loadDeps.call(this, deps, name);
			else if (typeof module == 'function' && name == 'App')
				module();

			appendModule({name : name, deps : deps, module: module, active : (name == 'App')});
		};

		this.t = function(source, data) {
			var getSource = function(div) {
				return div
					.innerHTML
					.replace(/<!--\?/gi, '<?')
					.replace(/\?-->/gi, '?>')
				;
			};

			/*jshint evil: true */
			var parse = function(str, data) {
				var c = new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +"with(obj){p.push('" + str
					.replace(/[\r\t\n]/g, " ")
					.split("<?").join("\t")
					.replace(/((^|\?>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)\?>/g, "',$1,'")
					.split("\t").join("');")
					.split("?>").join("p.push('")
					.split("\r").join("\\'") + "');return p.join('');};");

				return c(data);
			};

			try {
				return parse(getSource(document.getElementById(source)), data);
			} catch(e) {
				throw 'No template found: ' + source;
			}

			return null;
		};

		initialize.call(this);
	};

	window.$c = new Module();
})();
