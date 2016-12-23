/** @jsx h */
import './index.html';
import {h, Cream, create, inject, _container } from '../../../';

var c =create({
  element : document.body,
  elementId : 'application',
  elementClass : 'cake-application'
})
.route('/', 'records.index')
.route('/:id', 'records.record');

Cream.extend({
  _namespace : 'records.data',
  store : [
    { title : 'First record', content : 'First record content' },
    { title : 'Second record', content : 'Second record content' }
  ]
});

function appWrapper(children) {
 return ( <div>
    <h3> Routes example </h3>
    { children }
  </div> );
}

Cream.extend({
  _namespace : 'records.record',

  store : inject('records.data.store'),

  record : function() {
    return this.get('store.' + this.get('props.id'));
  }.property(),

  component() {
    return ( <div>
      <strong>{ this.get('record').title }</strong>
      <p>{ this.get('record').content }</p>
      <a href="#/">back</a>
      </div> );
  },

  render() {
    return appWrapper(this.component());
  }

});

Cream.extend({
  _namespace : 'records.index',

  store : inject('records.data.store'),

  records : function() {
    return this.get('store').map(function(record, i) {
      record.idx = i;

      return record;
    });
  }.property(),

  component() {
    return (
      <table className="records">
        { this.get('records').map(function(record) {
            return (
              <tr>
                <td>
                  { record.title }
                </td>
                <td>
                  <a href={ '#/' + record.idx }>view</a>
                </td>
              </tr>
            );
          })
        }
      </table>
    );
  },
  render() {
    return appWrapper(this.component());
  }
});
