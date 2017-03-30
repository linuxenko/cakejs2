/** @jsx h */
import {h, Cream} from '../../../';

export default Cream.extend({
  render: function() {
    return (
      <div>
      <h3>{this.props.title}</h3>
      <div>{this.props.children}</div>
      </div>
    );
  }
});
