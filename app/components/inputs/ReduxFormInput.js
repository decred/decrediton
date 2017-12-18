import { createElement as h } from "react";
import { Field } from "redux-form";

export default class FormField extends React.Component {

  field = props => {
    console.log(props)
    return (
      <div>
        {props.label && <label htmlFor={props.id}>{props.label}</label>}
        {/* {h(props.componentToRender, props)} */}
        {props.touched && props.error && <div className="text-danger">{props.error}</div>}
      </div>
    );
  }

  render() {
    console.log(this.props)
    // const componentToRender = this.props.component;
    const {
      component,
      name,
      input,
      placeholder,
      label,
      type,
    } = this.props;
    return (
      <div className="message-form-group">
        <div className="message-label">
          {label}
        </div>
        <Field {...{input, name, component}} placeholder={placeholder} type={type} />
        {/* {touched && (error && <span className="error">{error}</span>)} */}
      </div>
    );
  }
}

// const inputField = ({
  // input,
  // placeholder,
  // label,
  // type,
  // meta: { touched, error },
// }) => 
