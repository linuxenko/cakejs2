var h = require('../../').h;

exports.a = h(
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
  )
);

exports.b = h(
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
        'Item 3 added text'
      )
    )
  )
);


exports.a1 = h(
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
  )
);

exports.b1 = h(
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
        'Item 3 added text'
      )
    )
  )
);

