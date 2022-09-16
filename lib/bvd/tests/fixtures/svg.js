var h = require('../../').h;

exports.a =
  h('svg', { id: 'app'},
    h(
      'g',
      null,
      h('rect', { x: '40', y: '80', fill: 'blue' }),
      h('rect', { x: '40', y: '80', fill: 'red' }),
      h('rect', { x: '40', y: '80', fill: 'green' })
      )
);

exports.a =
  h('svg', { id: 'app'},
    h(
      'g',
      null,
      h('rect', { x: '40', y: '80', fill: 'blue' }),
      h('text', { x: '40', y: '80' }, 'text node')
      )
);


