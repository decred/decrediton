import Page from "./Page";

@autobind
class Proposals extends React.Component {
  render() {
    return (
      <Page
        {...this.props}
        {...this.state}
      />
    );
  }
}

export default Proposals;
