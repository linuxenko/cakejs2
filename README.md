## CakeJS
======

![alt tag](https://raw.githubusercontent.com/linuxenko/linuxenko.github.io/master/assets/files/cakejs.png)

*Lightweight Front-end Framework with:*

 * Routing 
 * DOM Templating
 * DI/AMD Support


Enabling script tag:
```html
<script data-main="/assets/js/app/" src="/assets/js/cake.js" async ></script>
```
   
Example of application (app.js):
```javascript
$c.define('App', function() {
  $c.router({
			'home' : {controllers : ['Controller/Home']}
	});
});
```

Example of module ('Controller/Home.js'):
```javascript
/* 
  Common AMD module, with only difference : dependecies is coming as an Array ([]) of names,
  Therefore we can use dynamically created lists of dependencies (! requirejs can't )
*/
$c.define('Controller/Home', function() {
  var Module = function() {	
    /*
       Templating example
    */
		document.body.innerHTML = $c.t('document-template', {data : {time : new Date()});
	};

	return Module;
});
```

