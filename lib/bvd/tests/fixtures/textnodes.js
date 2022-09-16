var h = require('../../').h;
exports.a = h(
  'div',
  null,
  h(
    'div',
    null,
    h(
      'h3',
      null,
      'Counter'
    )
  )
);

exports.b = h(
  'div',
  null,
  h(
    'div',
    null,
    h(
      'h3',
      null,
      'Day Countdown'
    )
  ),
  h(
    'div',
    { className: 'clock' },
    h(
      'strong',
      null,
      '1'
    ),
    ' :',
    h(
      'strong',
      null,
      '2'
    ),
    ' :',
    h(
      'strong',
      null,
      '3'
    )
  )
);

