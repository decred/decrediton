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
  onClearRenameAccountError
}) => {
  const message = getNextAccountSuccess || getNextAccountError || renameAccountError || renameAccountSuccess;
  const error = !!renameAccountError || !!getNextAccountError;
  const onClick = () => {
    onClearNewAccountSuccess();
    onClearRenameAccountSuccess();
    onClearNewAccountError();
    onClearRenameAccountError();
  };
  return (
    <Message {...{ error, onClick }}>
      { message }
    </Message>
  );
};

export default messageBanner(MessageBanner);
