(function() {
	var Module = function() {
		var modules = [];

		this.require = function(url, callback) {
			var url = url, callback = callback,
				script, d = null;

			if (typeof $ != 'undefined')
				d = $.Deferred();

			if (typeof url == 'undefined')
				return;

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

		this.test = function() {
			console.log(modules);
		};

		this.require('/cakejs/lib/cakejs/jquery.js');
		this.require('/cakejs/lib/cakejs/test.js');
	};

	window.$c = new Module();
})();