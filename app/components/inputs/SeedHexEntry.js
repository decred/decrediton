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

const SeedHexEntry = ({onChange, seedWord, ...props }) => <Input
  onChange={onChange}
  value={seedWord}
  name='hexInput'
  placeholder={props.intl.formatMessage(messages.enterHexSeedPlaceholder)}
/>

export default injectIntl(SeedHexEntry);
