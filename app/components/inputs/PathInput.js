class PathInput extends React.Component {
  render() {
    return (
      <input
        type="text"
        className="path-input"
        value={this.props.value}
        onChange={(e) => {
          this.props.onChange(e.target.value);
          this.setState({ path: e.target.value });
        }}
        placeholder={this.props.placeholder}
      />
    );
  }
}

export default PathInput;
