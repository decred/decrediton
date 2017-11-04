import { messageBanner } from "connectors";
import Message from "./Message";

const MessageBanner = ({
  getNextAccountSuccess,
  getNextAccountError,
  renameAccountSuccess,
  renameAccountError,
  onClearNewAccountSuccess,
  onClearNewAccountError,
  onClearRenameAccountSuccess,
  onClearRenameAccountError,
  changePassphraseError,
  changePassphraseSuccess,
  onClearChangePassphraseSuccess,
  onClearChangePassphraseError,
}) => {
  const message = (
    getNextAccountSuccess   ||
    renameAccountSuccess    ||
    changePassphraseSuccess ||
    getNextAccountError     ||
    renameAccountError      ||
    changePassphraseError
  );
  const error = !!renameAccountError || !!getNextAccountError || changePassphraseError;
  const onClick = () => {
    onClearNewAccountSuccess();
    onClearRenameAccountSuccess();
    onClearNewAccountError();
    onClearRenameAccountError();
    onClearChangePassphraseSuccess();
    onClearChangePassphraseError();
  };
  return (
    <Message {...{ error, onClick }}>
      { message }
    </Message>
  );
};

export default messageBanner(MessageBanner);
