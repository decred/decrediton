import { classNames, Tooltip } from "pi-ui";
import { InfoDocFieldModalButton } from "buttons";
import { CreatePassPhrase } from "shared";
import {
  ConfirmSeedMsg,
  CreateWalletMsg,
  GoBackMsg,
  CreateNewWalletTitle
} from "../../../messages";
import {
  Container,
  TitleWrapper,
  Section,
  SeedArea,
  SeedWord,
  ButtonsBar
} from "../../helpers";
import { BackButton } from "../../../helpers";
import styles from "./Form.module.css";

export const ConfirmSeedForm = ({
  seedWords,
  onChangeSeedWord,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  isCreatingWallet
}) => (
  <Container>
    <TitleWrapper title={<CreateNewWalletTitle />}>
      {sendBack && (
        <Tooltip content={<GoBackMsg />}>
          <BackButton onClick={sendBack} />
        </Tooltip>
      )}
    </TitleWrapper>
    <Section className="flex-row">
      <Section className={classNames(styles.confirmSeedLabel, "flex-row")}>
        <InfoDocFieldModalButton document="SeedInfo" />
        <ConfirmSeedMsg />
      </Section>
      <SeedArea>
        {seedWords.map((seedWord, index) => (
          <SeedWord
            seedWord={{ ...seedWord, index }}
            onChangeSeedWord={onChangeSeedWord}
          />
        ))}
      </SeedArea>
    </Section>
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <ButtonsBar
      disabled={!isValid}
      message={<CreateWalletMsg />}
      loading={isCreatingWallet}
      onClick={onCreateWallet}
      onBackClick={sendBack}
    />
  </Container>
);

export default ConfirmSeedForm;
