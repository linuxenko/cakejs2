(function() {
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
			var self = this, vendors = ['jquery.js'];

			var preConfigure = function() {
				iterations = vendors.length;

				var scripts = document.getElementsByTagName('script');
				for (var i = 0; i < scripts.length; i++) {
					var c = scripts[i];
					if (typeof c.getAttribute('data-main') == 'string') {
						self.scope.libPath = c.getAttribute('src').match(/^(.*\/)\w+\.js$/)[1];
						self.scope.appPath = c.getAttribute('data-main');
						break;
					}
				}

				var complete = function() {
					if (--iterations > 0)
						return;
					
					self.require('app', null);
				};

				for (var i in vendors)
					self.require(self.scope.libPath + vendors[i], complete);
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
					if (d != null)
						d.resolve();
				}
			}

			for (i in params) {
				this.require(params[i], complete.bind(this));
			}

			return d;
		}

		this.router = function(params) {
			var self = this;

			self.route.routes = params;

			var openRoute = function(name) {
				var route = self.route.routes[name];

				if (typeof route.controllers == 'undefined')
					return;


				for (var i in route.controllers)
					self.require(route.controllers[i]);
			}

			var makeRoute = function() {
				var hash = window.location.hash;

				if (hash.length < 1)
					return openRoute('home');

				var tmp = hash.split('/');
				var name = tmp[0].match(/^#(.*)$/)[1];
				var params = [];

				for (var i = 1; i < tmp.length; i++)
					params.push(tmp[i]);

				self.route.name = name;
				self.route.params = params;

				openRoute(name);
			}

			window.onpopstate = makeRoute;
			makeRoute();
		};

		this.findModule = function(name) {
			for (var i in this.scope.modules) {
				if (this.scope.modules[i].name == name)
					return this.scope.modules[i];
			}
			return null;
		};

		this.require = function(url, callback) {
			var self = this, url = url, callback = callback,
				script, d = null, modules = self.scope.modules, mod = null;

			if (typeof $ != 'undefined')
				d = $.Deferred();

			if (typeof url == 'undefined')
				return;

			if ((mod = self.findModule(url)) != null) {
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
				
				if (d != null)
					d.resolve(this);
			};

			script.onerror = function(e) {
				if (d != null)
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
			}

			var appendModule = function(params) {
				if (!hasModule(params.name))
					modules.push(params);
			};

			var loadDeps = function(loadDeps, callback) {
				var complete = function() {
					if (!hasModules(loadDeps) || typeof callback != 'function')
						return;

									
					var mods = new Object();
					for (var i in loadDeps) {
						mods[loadDeps[i]] = self.findModule(loadDeps[i]).module;	
					}

					callback(mods);
				}

				for (var i in loadDeps)
					this.require(loadDeps[i], complete);
			};

			var module = mod;

			if (typeof name != 'string')
				return;

			if (typeof module == 'undefined')
				module = deps;

			if (typeof deps == 'object' && (typeof mod == 'object' || typeof mod == 'function'))
				loadDeps.call(this, deps, mod);
			else if (typeof module == 'function')
				module();

			appendModule({name : name, deps : deps, module: module});
		};

		this.t = function(source, data) {
			var getSource = function(div) {
				return div
					.innerHTML
					.replace(/<!--\?/gi, '<?')
					.replace(/\?-->/gi, '?>')
				;
			};

			var parse = function(str, data) {
				var c = new Function("obj",
		        	"var p=[],print=function(){p.push.apply(p,arguments);};" +
		        	"with(obj){p.push('" + str
		          .replace(/[\r\t\n]/g, " ")
		          .split("<?").join("\t")
		          .replace(/((^|\?>)[^\t]*)'/g, "$1\r")
		          .replace(/\t=(.*?)\?>/g, "',$1,'")
		          .split("\t").join("');")
		          .split("?>").join("p.push('")
		          .split("\r").join("\\'")
		      + "');return p.join('');};");

				return c(data);
			};

			return parse(getSource(document.getElementById(source)), data);
		};

		initialize.call(this);
	};

	window.$c = new Module();
})();