var h = require('../../').h;

exports.tree1 = h(
  'div',
  { id: 'application', className: 'main-app' },
  h(
    'em',
    { className: 'em' },
    'Item 1'
  ),
  h(
    'div',
    null,
    'ffirett'
  ),
  h(
    'div',
    { className: '2to-remove' },
    '2removable div'
  ),
  h(
    'span',
    { className: 'menu-item' },
    'Item 1'
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
      ),
      h(
        'p',
        { className: 'redundant-item' },
        'new text Item 2'
      )
    ),
    h(
      'li',
      null,
      h(
        'div',
        { className: 'changed-menu-item' },
        'new text Item 2'
      ),
      h(
        'span',
        { className: 'menu-item' },
        'Item 2'
      )
    )
  )
);

exports.tree2 = h(
  'div',
  { id: 'app', className: 'changed-class' },
  h(
    'span',
    { className: 'menu-item' },
    'Item 1'
  ),
  h(
    'strong',
    null,
    'sttrong'
  ),
  h(
    'ul',
    { className : 'test test' },
    h(
      'li',
      null,
      h(
        'span',
        { className : 'llll', id : 'kkkkk' },
        'Item changed text 1'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'changed-menu-item' },
        'new text Item 2'
      ),
      h(
        'div',
        { className: 'changed-menu-item' },
        'new text Item 2'
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
    'div',
    { className: 'to-remove' },
    'removable div'
  )
);
