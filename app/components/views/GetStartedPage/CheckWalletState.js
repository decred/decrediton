import { ShowError } from "shared";
import "style/GetStarted.less";

export const CheckWalletStateBody = ({
  startupError
}) => (
  startupError && <ShowError className="get-started-error" error={startupError} />
);
