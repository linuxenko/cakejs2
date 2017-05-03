/** @jsx h */
import './index.html';
import { h, Cream, create, _container } from '../../../';

create({
  element: document.body,
  elementId: 'application',
  elementClass: 'cake-application'
})
  .route('/', 'counter');

Cream.extend({
  _namespace: 'counter',

  selected: 'None',
  data: [{
    id: 1,
    text: "Bella"
  }, {
    id: 2,
    text: "Kitty"
  }, {
    id: 3,
    text: "Loki"
  }, {
    id: 4,
    text: "Milo"
  }, {
    id: 5,
    text: "Missy"
  }],

  changeSelect(event) {
    this.set('selected', this.get('data').filter(i => i.id == event.target.value)[0].text);
  },

  render() {
    return (
      <div>
        <strong>{this.selected}</strong>
        <br />
        <select onChange={this.changeSelect}>
          {
            this.data.map(it => {
              return (
                <option value={it.id + ''}>
                  {it.text}
                </option>
              )
            })
          }
        </select>
      </div>
    );
  }
});
