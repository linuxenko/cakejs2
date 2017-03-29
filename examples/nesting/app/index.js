/** @jsx h */
import './index.html';
import {h, Cream, create, inject, _container } from '../../../';
import Store from './store';
import Record from './record';

var c =create({
  element : document.body,
  elementId : 'application',
  elementClass : 'cake-application'
})
.route('/', 'records.index')

Cream.extend({
  _namespace: 'records.index',

  render: function() {
    return (
      <div>
        <h2>List of Records</h2>
        {Store.store.map(function(r, i) {
          return (
            <Record title={i + '. ' + r.title}>
              <em>{r.content}</em>
            </Record>
          );
        })
       }
      </div>
    );
  }
});

