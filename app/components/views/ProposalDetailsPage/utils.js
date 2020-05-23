// politeiaMarkdownIndexMd returns markdown text from the payload of a politeia
// proposal file that corresponds to its index.md). This was extracted from the
// helpers.js file of politeia. Assumes the payload has been converted from
// base64 into bytes.
export function politeiaMarkdownIndexMd(payload) {
  const text = decodeURIComponent(escape(payload));
  return text.substring(text.indexOf("\n") + 1);
}

/**
 * Converts the vote counts into an array of data
 * that can be used to render the StatusBar
 * @param {Object} voteSummary
 * @returns {Array} status bar data
 */
export const getStatusBarData = (voteCounts) => {
  return (
    voteCounts &&
    Object.entries(voteCounts)
      .map(([voteOption, votesReceived]) => ({
        label: voteOption,
        amount: votesReceived,
        color: voteOption === "yes" ? "#41BE53" : "#ED6D47"
      }))
      .sort((a) => (a.label === "yes" ? -1 : 1))
  );
};
