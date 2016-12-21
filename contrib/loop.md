**Run loop**

`Cake` does not render things when they are changed, there is a `run loop` that
checks namespaces for changes to be rendered.

Run loop is a `mixer` component of the `cake`'s internals, it uses brower's implementations
e.g `requestAnimationFrame` or implements its own with `settimeout`.

**Explicit actions**

Any calculations, anything that application do, is hidden from the render loop,
until you `set` the `namespace` property, then it will rerender `DOM` when next
iteration comes..
