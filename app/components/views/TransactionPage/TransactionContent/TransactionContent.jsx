import { Balance, ExternalLink } from "shared";
import {
  KeyBlueButton,
  CopyToClipboardButton,
  PassphraseModalButton
} from "buttons";
import { addSpacingAroundText } from "helpers";
import { FormattedMessage as T } from "react-intl";
import { walletrpc as api } from "middleware/walletrpc/api_pb";
import {
  VOTE,
  REVOCATION,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_SENT,
  TICKET
} from "constants/decrediton";
import styles from "./TransactionContent.module.css";
import { classNames, Tooltip, Icon, getThemeProperty, useTheme } from "pi-ui";
import { MaxNonWalletOutputs } from "constants";

const { DecodedTransaction } = api;

function mapNonWalletOutput(output) {
  const address =
    output.decodedScript.address || `[script] - ${output.decodedScript.asm}`;

  const amount =
    output.decodedScript.scriptClass ===
    DecodedTransaction.Output.ScriptClass.NULL_DATA ? (
      "[null data]"
    ) : (
      <Balance amount={output.value} />
    );

  return { address, amount };
}

function mapNonWalletInput(input) {
  const address = `${input.prevTxId}:${input.outputIndex}`;
  const amount = input.amountIn ?? input.valueIn;

  return { address, amount };
}

const TransactionContent = ({
  transactionDetails,
  decodedTransaction,
  abandonTransaction,
  publishUnminedTransactions,
  currentBlockHeight,
  agendas,
  getAgendaSelectedChoice,
  getVSPTicketStatus,
  getVSPTicketStatusAttempt,
  VSPTicketStatus,
  isSigningMessage
}) => {
  const {
    txHash,
    txUrl,
    height,
    txType,
    txInputs,
    txOutputs,
    blockHash,
    txBlockUrl,
    txFee,
    ticketTxFee,
    txDirection,
    rawTx,
    isPending,
    voteScript,
    ticketTx
  } = transactionDetails;

  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "color-orange");
  const iconBgColor = getThemeProperty(theme, "alert-icon-bg-color");

  const isVote = txType === VOTE;
  const isRevocation = txType === REVOCATION;
  const agendaChoicesData =
    isVote &&
    Object.keys(voteScript.voteChoices).map((issueId) => {
      const agendaDetails = agendas.find((agenda) => agenda.name === issueId);
      return {
        issueId,
        description: agendaDetails?.description,
        voteChoice: voteScript.voteChoices[issueId],
        setVoteChoice: getAgendaSelectedChoice(issueId)
      };
    });

  let nonWalletInputs = [];
  let nonWalletOutputs = [];

  if (decodedTransaction) {
    const walletOutputIndices = txOutputs.map((v) => v.index);
    const walletInputIndices = txInputs.map((v) => v.index);

    nonWalletInputs = decodedTransaction.inputs
      .filter((v, i) => walletInputIndices.indexOf(i) === -1)
      .map(mapNonWalletInput);
    nonWalletOutputs = decodedTransaction.outputs
      .filter((v, i) => walletOutputIndices.indexOf(i) === -1)
      .map(mapNonWalletOutput);
  }

  return (
    <>
      <div className={styles.top}>
        <div className={styles.topRow}>
          <div className={styles.name}>
            <T id="txDetails.transactionLabel" m="Transaction" />:
          </div>
          <div className={styles.value}>
            <ExternalLink className={styles.value} href={txUrl}>
              {txHash}
            </ExternalLink>
          </div>
        </div>
        <div className={styles.topRow}>
          <div className={styles.name}>
            {!isPending ? (
              <div className={styles.indicatorConfirmed}>
                <T id="txDetails.indicatorConfirmed" m="Confirmed" />
              </div>
            ) : (
              <div className={styles.indicatorPending}>
                <T id="txDetails.indicatorPending" m="Pending" />
              </div>
            )}
          </div>
          <div className={styles.value}>
            {!isPending && (
              <span className={styles.valueText}>
                <T
                  id="transaction.confirmationHeight"
                  m="{confirmations, plural, =0 {Mined, block awaiting approval} one {# confirmation} other {# confirmations}}"
                  values={{
                    confirmations: !isPending ? currentBlockHeight - height : 0
                  }}
                />
              </span>
            )}
          </div>
        </div>
        {(isVote || isRevocation) && (
          <>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.ticketSpent" m="Ticket Spent" />:
              </div>
              <div className={styles.value}>
                <ExternalLink className={styles.value} href={ticketTx.txUrl}>
                  {ticketTx.txHash}
                </ExternalLink>
              </div>
            </div>
          </>
        )}
        {isVote ? (
          <>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.lastBlockValid" m="Last Block Valid" />:
              </div>
              <div className={styles.value}>
                {voteScript.isLastBlockValid ? (
                  <T id="txDetails.true" m="true" />
                ) : (
                  <T id="txDetails.false" m="false" />
                )}
              </div>
            </div>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.version" m="Vote Version" />:
              </div>
              <div className={styles.value}>{voteScript.version}</div>
            </div>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.bits" m="Vote Bits" />:
              </div>
              <div className={styles.value}>{voteScript.bits}</div>
            </div>
            <div className={styles.topRow}>
              <div className={classNames(styles.name, styles.agendaName)}>
                <T id="txDetails.agendaChoices" m="Agenda Choices" />:
              </div>
              <div className={styles.agendaGrid}>
                {agendaChoicesData?.map((agenda) => (
                  <React.Fragment key={agenda.issueId}>
                    <div>
                      <Tooltip
                        content={agenda.description}
                        contentClassName={styles.agendaDescTooltip}>
                        <span className={styles.issueId}>{agenda.issueId}</span>
                      </Tooltip>
                    </div>
                    <div
                      className={classNames(
                        styles.voteChoice,
                        styles[agenda.voteChoice]
                      )}>
                      {agenda.voteChoice}
                    </div>
                    <div className={styles.agendaAlert}>
                      {agenda.setVoteChoice !== undefined &&
                        agenda.setVoteChoice !== agenda.voteChoice && (
                          <>
                            <Icon
                              type="alert"
                              backgroundColor={iconColor}
                              iconColor={iconBgColor}
                            />
                            <T
                              id="txDetails.agendaAlert"
                              m="This doesn't align with what the wallet currently has set ({setVoteChoice})"
                              values={{
                                setVoteChoice: agenda.setVoteChoice
                              }}
                            />
                          </>
                        )}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.topRow}>
            <div className={styles.name}>
              <T id="txDetails.toAddress" m="To address" />:
            </div>
            <div className={classNames(styles.value, styles.nonFlex)}>
              {txOutputs.map(({ address }, i) => (
                <div key={i}>{addSpacingAroundText(address)}</div>
              ))}
              {nonWalletOutputs.length > MaxNonWalletOutputs ? (
                <T
                  id="txDetails.tooManyNonWalletOutputsAddresses"
                  m="Please use the txid link above to see all non-wallet addresses on dcrdata."
                />
              ) : (
                nonWalletOutputs.map(({ address }, i) => (
                  <div key={i}>{addSpacingAroundText(address)}</div>
                ))
              )}
            </div>
          </div>
        )}
        {txDirection !== TRANSACTION_DIR_RECEIVED && txType !== VOTE && (
          <div className={styles.topRow}>
            <div className={styles.name}>
              <T id="txDetails.transactionFeeLabel" m="Transaction fee" />:
            </div>
            <div className={styles.value}>
              <Balance amount={txFee ?? ticketTxFee} />
            </div>
          </div>
        )}
        {(txType == TICKET || txType == VOTE) && ticketTx.vspHost && (
          <>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.vspHost" m="VSP host" />:
              </div>
              <div className={styles.value}>{ticketTx.vspHost}</div>
            </div>
            {txType == TICKET &&
              (VSPTicketStatus ? (
                <>
                  <div className={styles.topRow}>
                    <div className={styles.name}>
                      <T id="txDetails.feeTxHashLabel" m="Fee tx hash" />:
                    </div>
                    <div className={styles.value}>
                      <ExternalLink
                        className={styles.value}
                        href={VSPTicketStatus.feetxUrl}>
                        {VSPTicketStatus.feetxhash}
                      </ExternalLink>
                    </div>
                  </div>
                  <div className={styles.topRow}>
                    <div className={styles.name}>
                      <T id="txDetails.feeTxStatusLabel" m="Fee tx status" />:
                    </div>
                    <div className={styles.value}>
                      {VSPTicketStatus.feetxstatus}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.topRow}>
                  <div className={styles.name}></div>
                  <div className={styles.value}>
                    <PassphraseModalButton
                      modalTitle={
                        <T
                          id="txDetails.signMessageModal"
                          m="Fetch VSP Ticket Status"
                        />
                      }
                      buttonLabel={
                        <T
                          id="txDetails.signMessageBtn"
                          m="Fetch VSP Ticket Status"
                        />
                      }
                      loading={getVSPTicketStatusAttempt || isSigningMessage}
                      disabled={getVSPTicketStatusAttempt || isSigningMessage}
                      onSubmit={getVSPTicketStatus}
                    />
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
      {isPending && (
        <div className={styles.buttonContainer}>
          <div className={styles.rebroadcastBtnContainer}>
            <KeyBlueButton
              className={styles.rebroadcastBtn}
              onClick={publishUnminedTransactions}>
              <T
                id="txDetails.rebroadcastTransactions"
                m="Rebroadcast Transaction"
              />
            </KeyBlueButton>
          </div>
          <div className={styles.abandonBtnContainer}>
            <KeyBlueButton
              className={styles.abandonBtn}
              onClick={() => abandonTransaction(txHash)}>
              <T id="txDetails.abandontTransaction" m="Abandon Transaction" />
            </KeyBlueButton>
          </div>
        </div>
      )}
      <div className={styles.io}>
        <div className={styles.title}>
          <T id="txDetails.io.title" m="I/O Details" />
        </div>
        <div className={styles.overview}>
          <div className={styles.inputs}>
            <div className={styles.inputArea}>
              <div
                className={
                  txInputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.walletInputs" m="Wallet Inputs" />
              </div>
              {txInputs.map(({ accountName, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div className={styles.address}>{accountName}</div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.inputArea}>
              <div
                className={
                  nonWalletInputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.nonWalletInputs" m="Non Wallet Inputs" />
              </div>
              {nonWalletInputs.map(({ address, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div className={styles.address}>
                    {addSpacingAroundText(address)}
                  </div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.inputArrow}></div>
          <div className={styles.outputs}>
            <div className={styles.outputArea}>
              <div
                className={
                  txOutputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.walletOutputs" m="Wallet Outputs" />
              </div>
              {txOutputs.map(({ accountName, decodedScript, amount }, idx) => (
                <div key={idx} className={styles.row}>
                  <div className={styles.address}>
                    {txDirection === TRANSACTION_DIR_SENT
                      ? "change"
                      : accountName
                      ? addSpacingAroundText(accountName)
                      : addSpacingAroundText(decodedScript.address)}
                  </div>
                  <div className={styles.amount}>
                    <Balance amount={amount} />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.outputArea}>
              <div
                className={
                  nonWalletOutputs.length > 0
                    ? styles.overviewTitleConsumed
                    : styles.overviewTitleEmpty
                }>
                <T id="txDetails.nonWalletOutputs" m="Non Wallet Outputs" />
              </div>
              {nonWalletOutputs.length > MaxNonWalletOutputs ? (
                <div className={styles.row}>
                  <T
                    id="txDetails.tooManyNonWalletOutputs"
                    m="Please use the txid link above to see all non-wallet outputs on dcrdata."
                  />
                </div>
              ) : (
                nonWalletOutputs.map(({ address, amount }, idx) => (
                  <div key={idx} className={styles.row}>
                    <div
                      className={classNames(styles.address, styles.nonWallet)}>
                      {addSpacingAroundText(address)}
                    </div>
                    <div className={styles.amount}>{amount}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.title}>
          <T id="txDetails.properties" m="Properties" />
        </div>
        {!isPending && (
          <>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.blockLabel" m="Block" />
              </div>
              <div className={styles.value}>
                <ExternalLink className={styles.value} href={txBlockUrl}>
                  {blockHash}
                </ExternalLink>
              </div>
            </div>
            <div className={styles.topRow}>
              <div className={styles.name}>
                <T id="txDetails.blockHeightLabel" m="Height" />
              </div>
              <div className={styles.value}>{height}</div>
            </div>
          </>
        )}
        <div className={classNames(styles.topRow, styles.rowTransaction)}>
          <div className={styles.name}>
            <T id="txDetails.rawTransactionLabel" m="Raw Transaction" />
          </div>
          <div className={styles.value}>
            <div className={styles.valueRawTx}>{rawTx}</div>
            <CopyToClipboardButton
              textToCopy={rawTx}
              className={styles.receiveContentNestCopyToClipboardIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionContent;
