import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import styles from "./shared.module.css";

const LoadingError = ({ errorMessage, errorMessageDescription, reload }) => {
  return (
    <div className={styles.loadingError}>
      <T
        id="loadingError.errorMessage"
        m="{errorMessage} {errorMessageDescription}"
        values={{
          errorMessage: errorMessage || "Something went wrong, please reload",
          errorMessageDescription: errorMessageDescription && (
            <span className={styles.messageDescription}>
              <T
                id="loadingError.errorMessageDescription"
                m="{errorMessageDescription}"
                values={{ errorMessageDescription }}
              />
            </span>
          )
        }}
      />
      <div className={styles.reloadButton}>
        <KeyBlueButton
          onClick={() => reload()}
          disabled={false}
          loading={false}>
          <T id="loadingError.reloadBtn" m="Reload" />
        </KeyBlueButton>
      </div>
    </div>
  );
};

export default LoadingError;
