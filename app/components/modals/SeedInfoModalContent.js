import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <T id="seedEntry.info.message" m="This 33 word seed is what is used to derive everything about your particular wallet.  With this seed you can regenerate this wallet from anywhere in the world.  While this does offer flexibility and easy back ups, it also means that this seed should be handled with the utmost security.  We recommend only having seeds written by hand in the most secure location you have. " />
      </span>
    </p>
  </Aux>
);
