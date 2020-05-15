const MaxUint16 = 1 << (16 - 1);
const MaxUint32 = 1 << (32 - 1);

// VarIntSerializeSize returns the number of bytes it would take to serialize
// val as a variable length integer.
const VarIntSerializeSize = (val) => {
  // The value is small enough to be represented by itself, so it's
  // just 1 byte.
  if (val < 0xfd) {
    return 1;
  }

  // Discriminant 1 byte plus 2 bytes for the uint16.
  if (val <= MaxUint16) {
    return 3;
  }

  // Discriminant 1 byte plus 4 bytes for the uint32.
  if (val <= MaxUint32) {
    return 5;
  }

  // Discriminant 1 byte plus 8 bytes for the uint64.
  return 9;
};

// EstimateInputSize returns the worst case serialize size estimate for a tx input
//   - 32 bytes previous tx
//   - 4 bytes output index
//   - 1 byte tree
//   - 8 bytes amount
//   - 4 bytes block height
//   - 4 bytes block index
//   - the compact int representation of the script size
//   - the supplied script size
//   - 4 bytes sequence
const EstimateInputSize = (scriptSize) =>
  32 + 4 + 1 + 8 + 4 + 4 + VarIntSerializeSize(scriptSize) + scriptSize + 4;

// EstimateOutputSize returns the worst case serialize size estimate for a tx output
//   - 8 bytes amount
//   - 2 bytes version
//   - the compact int representation of the script size
//   - the supplied script size
const EstimateOutputSize = (scriptSize) =>
  8 + 2 + VarIntSerializeSize(scriptSize) + scriptSize;

// EstimateSerializeSizeFromScriptSizes returns a worst case serialize size
// estimate for a signed transaction that spends len(inputSizes) previous
// outputs and pays to len(outputSizes) outputs with scripts of the provided
// worst-case sizes. The estimated size is incremented for an additional
// change output if changeScriptSize is greater than 0. Passing 0 does not
// add a change output.
export const EstimateSerializeSizeFromScriptSizes = (
  inputSizes,
  outputSizes,
  changeScriptSize
) => {
  // Generate and sum up the estimated sizes of the inputs.
  let txInsSize = 0;
  inputSizes.forEach(
    (inputSize) => (txInsSize += EstimateInputSize(inputSize))
  );

  // Generate and sum up the estimated sizes of the outputs.
  let txOutsSize = 0;
  outputSizes.forEach(
    (outputSize) => (txOutsSize += EstimateOutputSize(outputSize))
  );

  const inputCount = inputSizes.length;
  let outputCount = outputSizes.length;
  let changeSize = 0;
  if (changeScriptSize > 0) {
    changeSize = EstimateOutputSize(changeScriptSize);
    outputCount++;
  }

  // 12 additional bytes are for version, locktime and expiry.
  return (
    12 +
    2 * VarIntSerializeSize(inputCount) +
    VarIntSerializeSize(outputCount) +
    txInsSize +
    txOutsSize +
    changeSize
  );
};
