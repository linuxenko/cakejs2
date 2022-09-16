var h = require('../../').h;

exports.a = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  h(
    'div',
    null,
    'text'
  )
);

exports.a1 = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  'text'
);

exports.a2 = h(
  'div',
  { id: 'application', className: 'no-class' },
  h(
    'div',
    null,
    'changed'
  )
);

exports.b = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  'text'
);

exports.c = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  h(
    'div',
    null,
    'changed'
  )
);

exports.d = h(
  'div',
  null,
  h(
    'span',
    { id : 'text-node', className : 'text-node' },
    'node-text'
  )
);

exports.e = h(
  'div',
  { 'data-name' : 'to remove',  className : 'test-class' },
  h(
    'div',
    null,
    'changed'
  )
);

exports.f = h(
  'div',
  { id: 'app', className: 'changed-class' },
  h(
    'span',
    { className: 'changed-menu-item' },
    'Reorder me'
  ),
  h(
    'ul',
    null,
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 1'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'changed-menu-item' },
        'Item 2'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 3'
      )
    )
  )
);

exports.f1 = h(
  'div',
  { id: 'app', className: 'changed-class' },
  h(
    'ul',
    null,
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 1'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'changed-menu-item' },
        'Item 2'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 3'
      )
    )
  ),
  h(
    'span',
    { className: 'changed-menu-item' },
    'Reorder me'
  )
);
