import "style/GetStarted.less";

const CreateWalletPage = ({ StateComponent }) => (
  <div className="getstarted content">
    {StateComponent &&
      (React.isValidElement(StateComponent) ? (
        StateComponent
      ) : (
        <StateComponent />
      ))}
  </div>
);

export default CreateWalletPage;
