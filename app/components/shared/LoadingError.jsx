import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { FormattedMessage as T } from "react-intl";
import * as cli from "actions/ClientActions";
import { KeyBlueButton, InvisibleButton } from "buttons";
import styles from "./shared.module.css";

const LoadingError = ({
  errorMessage,
  errorMessageDescription,
  reload,
  cancelButton
}) => {
  const dispatch = useDispatch();
  const goBackHistory = useCallback(() => dispatch(cli.goBackHistory()), [
    dispatch
  ]);

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
      {cancelButton && (
        <div className={styles.cancelButton}>
          <InvisibleButton onClick={goBackHistory}>
            <T id="loadingError.cancelBtn" m="Cancel" />
          </InvisibleButton>
        </div>
      )}
    </div>
  );
};

export default LoadingError;
