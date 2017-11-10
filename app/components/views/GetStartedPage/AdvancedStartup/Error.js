import "style/LoginForm.less";

const ErrorMessage = () => {
  return (
    <div className="advanced-page">
      <div className="error">You have appdata path and remote credentials, please fix your config file</div>
    </div>
  );
};

export default ErrorMessage;
