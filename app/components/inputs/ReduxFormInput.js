import { createElement as h } from "react";

export default class FormField extends React.Component {

  field = props => {
    return (
      <div>
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {h(props.componentToRender, props)}
        {props.touched && props.error && <div className="text-danger">{props.error}</div>}
      </div>
    );
  }

  render() {
    const componentToRender = this.props.component;
    return <Field {...this.props} {...componentToRender} component={this.field} />;
  }
}
