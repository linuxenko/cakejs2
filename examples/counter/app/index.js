/** @jsx h */
import './index.html';
import {h, Cream, create, _container } from '../../../';

create({
  element : document.body,
  elementId : 'application',
  elementClass : 'cake-application'
})
.route('/', 'counter');

Cream.extend({
  _namespace : 'counter',

  clicked : 0,

  increment() {
    this.set('clicked', this.get('clicked') + 1);
  },

  render() {
    return (
      <button onClick={this.increment}>Clicked {this.clicked}</button>
    );
  }
});
