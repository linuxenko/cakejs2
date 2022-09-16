**Run loop**

`CakeJS2` renders changes using `run loop` iterations in case namesapaces or
properties were changed.

`Run loop` is a `mixer` component of the `cake`'s internals, it uses brower's implementations
e.g `requestAnimationFrame` or implements its own using plain old `settimeout` function.

**Explicit actions**

Any calculations, anything that application do, is hidden from the render loop,
until you call `set`. Only then it will rerender `DOM` when next iteration comes..
