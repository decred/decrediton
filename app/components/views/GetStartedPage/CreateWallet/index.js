import CreateForm from "./CreateForm";

@autobind
class CreateWallet extends React.Component {

  render() {
    return (
      <div className="page-body getstarted">
        <CreateForm {...{ ...this.props }}/>
      </div>);
  }

}

export default CreateWallet;
