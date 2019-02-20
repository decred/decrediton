import Input from "./Input";
import { defineMessages, injectIntl } from "react-intl";

const messages = defineMessages({
  enterSeedPlaceholder: {
    id: "createWallet.enterSeed.placeholder",
    defaultMessage: "Enter your seed..."
  },
  enterHexSeedPlaceholder: {
    id: "createWallet.enterHexSeed.placeholder",
    defaultMessage: "Enter the hex representation of your seed..."
  }
});

const SeedHexEntry = ({ onChange, seed, ...props }) => <Input
  onChange={onChange}
  value={seed}
  name='hexInput'
  placeholder={props.intl.formatMessage(messages.enterHexSeedPlaceholder)}
/>;

export default injectIntl(SeedHexEntry);
