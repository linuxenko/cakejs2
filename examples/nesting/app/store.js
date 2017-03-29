import {Cream} from '../../../';

export default Cream.extend({
  byId: function(id) {
    return this.store[id];
  },

  store: [
    { title: 'First record', content: 'First record content' },
    { title: 'Second record', content: 'Second record content' },
    { title: 'Third record', content: 'Third record content' }
  ]
});
