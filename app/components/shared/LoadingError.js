import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";

const LoadingError = ({ errorMessage, errorMessageDescription, reload }) => {
  return (
    <div className="loading-error">
      <T
        id="loadingError.errorMessage"
        m="{errorMessage} {errorMessageDescription}"
        values={{
          errorMessage: errorMessage || "Something went wrong, please reload",
          errorMessageDescription:
            errorMessageDescription &&
            (<span className="loading-error-message-description">
              <T id="loadingError.errorMessageDescription" m="{errorMessageDescription}" values={{ errorMessageDescription }} />
            </span>)
        }}
      />
      <div className="loading-error-reload">
        <KeyBlueButton
          onClick={() => reload()}
          disabled={false}
          className="content-send"
          loading={false}
        >
          <T id="send.sendBtn" m="Reload" />
        </KeyBlueButton>
      </div>
    </div >
  );
};

export default LoadingError;
