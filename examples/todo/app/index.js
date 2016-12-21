/** @jsx h */
import './index.html';
import {h, Cream, create, _container } from '../../../';

create({
  element : document.body,
  elementId : 'application',
  elementClass : 'cake-application'
})
.route('/', 'todo')
.route('/:filter', 'todo');

Cream.extend({
  _namespace : 'todo',

  render() {
    return (
      <div>Not implemented</div>
    );
  }
});
