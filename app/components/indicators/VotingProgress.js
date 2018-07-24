export default ({ voteCounts }) => {

  // TODO: support options other than yes/no/abstain (currently not used on
  // politeia)
  // TODO: support quorum/total ticket count/abstain (not currently returned by
  // the voteresults endpoint)

  const yesCount = voteCounts.yes;
  const noCount = voteCounts.no;
  // const abstainCount = voteCounts.abstain;

  const totalCount = yesCount + noCount; // + abstainCount;
  const yesPerc = (yesCount / totalCount) * 100;
  const noPerc = (noCount / totalCount) * 100;
  // const abstainPerc = (abstainCount / totalCount) * 100;

  return (
    <div className="voting-progress-indicator">
      <div className="voting-progress-yes" style={{ width: yesPerc + "%" }} />
      <div className="voting-progress-no" style={{ width: noPerc + "%" }} />

      {/* <div className="voting-progress-abstain" style={{ width: abstainPerc + "%" }} /> */}
    </div>
  );
};
