// politeiaMarkdownIndexMd returns markdown text from the payload of a politeia
// proposal file that corresponds to its index.md). This was extracted from the
// helpers.js file of politeia. Assumes the payload has been converted from
// base64 into bytes.
export function politeiaMarkdownIndexMd(payload) {
  const text = decodeURIComponent(escape(payload));
  return text.substring(text.indexOf("\n") + 1);
}
