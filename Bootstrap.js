(function() {
	var Module = function() {
		this.scope = {
			libPath : '',
			appPath : '',
			modules : []
		}

		var vendors = [
			'jquery.js'
		];

		var initialize = function() {
			var self = this,
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

				//self.require(self.scope.appPath + 'app.js');
			};

			for (var i in vendors)
				self.require(self.scope.libPath + vendors[i], complete);

		};

		this.require = function(url, callback) {
			var self = this, url = url, callback = callback,
				script, d = null, modules = self.scope.modules, mod = null;

			var findModule = function(name) {
				for (var i in modules)
					if (modules[i].name == name)
						return modules[i];
				return null;
			};

			if (typeof $ != 'undefined')
				d = $.Deferred();

			if (typeof url == 'undefined')
				return;

			if (!url.match(/^.*\.js/))
				url = self.scope.appPath + url + '.js';

			if ((mod = findModule(url)) != null) {
				d.resolve(mod.module);
				if (typeof callback == 'function')
					callback(mod.module);
			}

			script = document.createElement('script');
			script.setAttribute('src', url);

			script.onload = script.onreadystatechange = function() {
				if (typeof callback == 'function')
					callback(this)
				
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
			var modules = this.scope.modules;

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

			var findModule = function(name) {
				for (var i in modules)
					if (modules[i].name == name)
						return modules[i];
				return null;
			};

			var loadDeps = function(deps, callback) {
				var complete = function() {
					if (!hasModules(deps))
						return;

					var mods = new Object();
					for (var i in deps)
						mods[deps[i]] = findModule(deps[i]).module;

					callback(mods);
				}

				for (var i in deps)
					this.require(deps[i], complete);
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

			appendModule({name : name, module: module});
		};

		initialize.call(this);
	};

	window.$c = new Module();
})();