import {
  newAddressPubKeyHash,
  newAddressScriptHashFromHash
} from "./addresses";
import {
  OP_0,
  OP_1,
  OP_16,
  OP_DUP,
  OP_HASH160,
  OP_DATA_20,
  OP_EQUAL,
  OP_EQUALVERIFY,
  OP_CHECKSIG,
  OP_SSTX,
  OP_SSGEN,
  OP_SSRTX,
  OP_SSTXCHANGE,
  OP_DATA_33,
  OP_DATA_65,
  OP_CHECKSIGALT,
  OP_PUSHDATA4,
  opcodeArray,
  OP_RETURN
} from "constants";

const MaxUint16 = 1 << (16 - 1);
const MaxUint32 = 1 << (32 - 1);

// sig script types
// const PubKeyTy = 1; // Pay pubkey.
const PubKeyHashTy = 2; // Pay pubkey hash.
const ScriptHashTy = 3; // Pay to script hash.
// const MultiSigTy = 4; // Multi signature.
// const NullDataTy = 5; // Empty data-only (provably prunable).
const StakeSubmissionTy = 6; // Stake submission.
const StakeGenTy = 7; // Stake generation
const StakeRevocationTy = 8; // Stake revocation.
const StakeSubChangeTy = 9; // Change for stake submission tx.
const PubkeyHashAltTy = 11;

// scriptHashToAddrs is a convenience function to attempt to convert the passed
// hash to a pay-to-script-hash address housed within an address slice.  It is
// used to consolidate common code.
const scriptHashToAddrs = (hash, params) => {
  // Skip the hash if it's invalid for some reason.
  const addr = newAddressScriptHashFromHash(hash, params);
  if (addr.error) {
    return addr.error;
  }
  return addr;
};

// extractUncompressedPubKey extracts an uncompressed public key from the
// passed script if it is a standard pay-to-uncompressed-secp256k1-pubkey
// script.  It will return nil otherwise.
const extractUncompressedPubKey = (script) => {
  // A pay-to-uncompressed-pubkey script is of the form:
  //  OP_DATA_65 <65-byte uncompressed pubkey> OP_CHECKSIG

  // All non-hybrid uncompressed secp256k1 public keys must start with 0x04.
  if (
    script.length === 67 &&
    script[66] == OP_CHECKSIG &&
    script[0] == OP_DATA_65 &&
    script[1] == 0x04
  ) {
    return script.slice(1, 66);
  }
  return null;
};

// extractCompressedPubKey extracts a compressed public key from the passed
// script if it is a standard pay-to-compressed-secp256k1-pubkey script.  It
// will return nil otherwise.
const extractCompressedPubKey = (script) => {
  // A pay-to-compressed-pubkey script is of the form:
  //  OP_DATA_33 <33-byte compressed pubkey> OP_CHECKSIG

  // All compressed secp256k1 public keys must start with 0x02 or 0x03.
  if (
    script.length === 35 &&
    script[34] === OP_CHECKSIG &&
    script[0] == OP_DATA_33 &&
    (script[1] === 0x02 || script[1] === 0x03)
  ) {
    return script.slice(1, 34);
  }

  return null;
};

// extractPubKey extracts either a compressed or uncompressed public key from the
// passed script if it is either a standard pay-to-compressed-secp256k1-pubkey
// or pay-to-uncompressed-secp256k1-pubkey script, respectively.  It will return
// nil otherwise.
const extractPubKey = (script) => {
  const pubKey = extractCompressedPubKey(script);
  if (pubKey) {
    return pubKey;
  }
  return extractUncompressedPubKey(script);
};

// isStandardAltSignatureType returns whether or not the provided opcode
// represents a push of a standard alt signature type.
const isStandardAltSignatureType = (op) => {
  if (!isSmallInt(op)) {
    return false;
  }

  const sigType = asSmallInt(op);
  //sigType == dcrec.STEd25519 || sigType == dcrec.STSchnorrSecp256k1
  return sigType == 1 || sigType == 2;
};

// asSmallInt returns the passed opcode, which must be true according to
// isSmallInt(), as an integer.
const asSmallInt = (op) => {
  if (op === OP_0) {
    return 0;
  }

  return op - (OP_1 - 1);
};

// isSmallInt returns whether or not the opcode is considered a small integer,
// which is an OP_0, or OP_1 through OP_16.
//
// NOTE: This function is only valid for version 0 opcodes.
const isSmallInt = (op) => op == OP_0 || (op >= OP_1 && op <= OP_16);

// extractPubKeyHashAltDetails extracts the public key hash and signature type
// from the passed script if it is a standard pay-to-alt-pubkey-hash script.  It
// will return nil otherwise.
const extractPubKeyHashAltDetails = (script) => {
  // A pay-to-alt-pubkey-hash script is of the form:
  //  DUP HASH160 <20-byte hash> EQUALVERIFY SIGTYPE CHECKSIG
  //
  // The only two currently supported alternative signature types are ed25519
  // and schnorr + secp256k1 (with a compressed pubkey).
  //
  //  DUP HASH160 <20-byte hash> EQUALVERIFY <1-byte ed25519 sigtype> CHECKSIG
  //  DUP HASH160 <20-byte hash> EQUALVERIFY <1-byte schnorr+secp sigtype> CHECKSIG
  //
  //  Notice that OP_0 is not specified since signature type 0 disabled.

  if (
    script.length === 26 &&
    script[0] === OP_DUP &&
    script[1] === OP_HASH160 &&
    script[2] === OP_DATA_20 &&
    script[23] === OP_EQUALVERIFY &&
    isStandardAltSignatureType(script[24]) &&
    script[25] == OP_CHECKSIGALT
  ) {
    return {
      script: script.slice(3, 23),
      signatureType: asSmallInt(script[24])
    };
  }

  return { script: null };
};

// extractStakePubKeyHash extracts the public key hash from the passed script if
// it is a standard stake-tagged pay-to-pubkey-hash script with the provided
// stake opcode.  It will return nil otherwise.
const extractStakePubKeyHash = (script, stakeOpcode) => {
  // A stake-tagged pay-to-pubkey-hash is of the form:
  //   <stake opcode> <standard-pay-to-pubkey-hash script>

  // The script can't possibly be a stake-tagged pay-to-pubkey-hash if it
  // doesn't start with the given stake opcode.  Fail fast to avoid more work
  // below.
  if (script.length < 1 || script[0] != stakeOpcode) {
    return null;
  }

  return extractPubKeyHash(script.slice(1));
};

// extractStakeScriptHash extracts the script hash from the passed script if it
// is a standard stake-tagged pay-to-script-hash script with the provided stake
// opcode.  It will return nil otherwise.
const extractStakeScriptHash = (script, stakeOpcode) => {
  // A stake-tagged pay-to-script-hash is of the form:
  //   <stake opcode> <standard-pay-to-script-hash script>

  // The script can't possibly be a stake-tagged pay-to-script-hash if it
  // doesn't start with the given stake opcode.  Fail fast to avoid more work
  // below.
  if (script.length < 1 || script[0] != stakeOpcode) {
    return null;
  }

  return extractScriptHash(script.slice(1));
};

// extractPubKeyHash extracts the public key hash from the passed script if it
// is a standard pay-to-pubkey-hash script.  It will return nil otherwise.
const extractPubKeyHash = (script) => {
  // A pay-to-pubkey-hash script is of the form:
  //  OP_DUP OP_HASH160 <20-byte hash> OP_EQUALVERIFY OP_CHECKSIG
  if (
    script.length === 25 &&
    script[0] == OP_DUP &&
    script[1] == OP_HASH160 &&
    script[2] == OP_DATA_20 &&
    script[23] == OP_EQUALVERIFY &&
    script[24] == OP_CHECKSIG
  ) {
    return script.slice(3, 23);
  }

  return null;
};

// pubKeyHashToAddrs is a convenience function to attempt to convert the
// passed hash to a pay-to-pubkey-hash address housed within an address
// slice.  It is used to consolidate common code.

// return  []dcrutil.Address
const pubKeyHashToAddrs = (hash, params) => {
  // Skip the pubkey hash if it's invalid for some reason.
  // algo type STEcdsaSecp256k1 = 0;
  const addr = newAddressPubKeyHash(hash, params, 0);
  if (addr.error) {
    return addr.error;
  }
  return addr;
};

const extractScriptHash = (script) => {
  // A pay-to-script-hash script is of the form:
  //  OP_HASH160 <20-byte scripthash> OP_EQUAL
  if (
    script.length === 23 &&
    script[0] == OP_HASH160 &&
    script[1] == OP_DATA_20 &&
    script[22] == OP_EQUAL
  ) {
    return script.slice(2, 22);
  }

  return null;
};

// ExtractPkScriptAddrs returns the type of script, addresses and required
// signatures associated with the passed PkScript.  Note that it only works for
// 'standard' transaction script types.  Any data such as public keys which are
// invalid are omitted from the results.
//
// NOTE: This function only attempts to identify version 0 scripts.  The return
// value will indicate a nonstandard script type for other script versions along
// with an invalid script version error.

// return (ScriptClass, []dcrutil.Address, int, error)
export const extractPkScriptAddrs = (version, pkScript, chainParams) => {
  if (version != 0) {
    return { error: "invalid script version" };
  }

  const parsedScript = parseScript(pkScript);
  let pops;
  let disbuf = "";
  if (parsedScript) {
    const { error, retScript } = parsedScript;
    if (error) return { error };
    pops = retScript;
    for (let i = 0; i < retScript.length; i++) {
      disbuf += printPop(retScript[i]);
      disbuf += " ";
    }
    // remove last space (" ").
    if (disbuf.length > 0) {
      disbuf = disbuf.slice(0, -1);
    }
  }
  // console.log(pkScript)
  // console.log(pops)

  const asm = disbuf;

  let hash;
  hash = extractPubKeyHash(pkScript);
  // Check for pay-to-pubkey-hash script.
  if (hash) {
    return {
      scriptClass: PubKeyHashTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  // Check for pay-to-script-hash.
  hash = extractScriptHash(pkScript);
  if (hash) {
    return {
      scriptClass: ScriptHashTy,
      address: scriptHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  const { script, sigType } = extractPubKeyHashAltDetails(pkScript);
  // Check for pay-to-alt-pubkey-hash script.
  if (script) {
    const addr = newAddressPubKeyHash(script, chainParams, sigType);
    if (addr.error) {
      return addr.error;
    }
    return {
      scriptClass: PubkeyHashAltTy,
      address: addr,
      requiredSig: 1,
      asm
    };
  }
  // TODO finish importing this methods so decrediton can support decoding
  // other scripts types.

  // Check for pay-to-pubkey script.
  const data = extractPubKey(pkScript);
  if (data) {
    // pk, err := secp256k1.ParsePubKey(data)
    // if err == nil {
    // 	addr, err := dcrutil.NewAddressSecpPubKeyCompressed(pk, chainParams)
    // 	if err == nil {
    // 		addrs = append(addrs, addr)
    // 	}
    // }
    // return PubKeyTy, addrs, 1, nil
  }

  // // Check for pay-to-alt-pubkey script.
  // if pk, sigType := extractPubKeyAltDetails(pkScript); pk != nil {
  // 	var addrs []dcrutil.Address
  // 	switch sigType {
  // 	case dcrec.STEd25519:
  // 		addr, err := dcrutil.NewAddressEdwardsPubKey(pk, chainParams)
  // 		if err == nil {
  // 			addrs = append(addrs, addr)
  // 		}

  // 	case dcrec.STSchnorrSecp256k1:
  // 		addr, err := dcrutil.NewAddressSecSchnorrPubKey(pk, chainParams)
  // 		if err == nil {
  // 			addrs = append(addrs, addr)
  // 		}
  // 	}

  // 	return PubkeyAltTy, addrs, 1, nil
  // }

  // // Check for multi-signature script.
  // details := extractMultisigScriptDetails(version, pkScript, true)
  // if details.valid {
  // 	// Convert the public keys while skipping any that are invalid.
  // 	addrs := make([]dcrutil.Address, 0, details.numPubKeys)
  // 	for i := 0; i < details.numPubKeys; i++ {
  // 		pubkey, err := secp256k1.ParsePubKey(details.pubKeys[i])
  // 		if err == nil {
  // 			addr, err := dcrutil.NewAddressSecpPubKeyCompressed(pubkey,
  // 				chainParams)
  // 			if err == nil {
  // 				addrs = append(addrs, addr)
  // 			}
  // 		}
  // 	}
  // 	return MultiSigTy, addrs, details.requiredSigs, nil
  // }

  // Check for stake submission script.  Only stake-submission-tagged
  // pay-to-pubkey-hash and pay-to-script-hash are allowed.
  hash = extractStakePubKeyHash(pkScript, OP_SSTX);
  if (hash) {
    return {
      scriptClass: StakeSubmissionTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakeScriptHash(pkScript, OP_SSTX);
  if (hash) {
    return {
      scriptClass: StakeSubmissionTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakeScriptHash(pkScript, OP_SSTX);
  if (hash) {
    return {
      scriptClass: StakeSubmissionTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakePubKeyHash(pkScript, OP_SSGEN);
  if (hash) {
    return {
      scriptClass: StakeGenTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakeScriptHash(pkScript, OP_SSGEN);
  if (hash) {
    return {
      scriptClass: StakeGenTy,
      address: scriptHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakePubKeyHash(pkScript, OP_SSRTX);
  if (hash) {
    return {
      scriptClass: StakeRevocationTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakeScriptHash(pkScript, OP_SSRTX);
  if (hash) {
    return {
      scriptClass: StakeRevocationTy,
      address: scriptHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakePubKeyHash(pkScript, OP_SSTXCHANGE);
  if (hash) {
    return {
      scriptClass: StakeSubChangeTy,
      address: pubKeyHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  hash = extractStakeScriptHash(pkScript, OP_SSTXCHANGE);
  if (hash) {
    return {
      scriptClass: StakeSubChangeTy,
      address: scriptHashToAddrs(hash, chainParams),
      requiredSig: 1,
      asm
    };
  }

  // Check for null data script.
  if (isNullData(pops)) {
    // Null data transactions have no addresses or required signatures.
    return {
      // scriptclass NullDataTy
      scriptClass: 0,
      address: [],
      requiredSig: 0,
      asm
    };
  }

  // Don't attempt to extract addresses or required signatures for nonstandard
  // transactions.
  return {
    scriptClass: 0,
    address: [],
    requiredSig: 0,
    asm
  };
};

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

// isNullData returns true if the passed script is a null data transaction,
// false otherwise.
const isNullData = (pops) => {
  if (!pops) return;
  // A nulldata transaction is either a single OP_RETURN or an
  // OP_RETURN SMALLDATA (where SMALLDATA is a data push up to
  // MaxDataCarrierSize bytes).
  const MaxDataCarrierSize = 256;
  const l = pops.length;
  if (l === 1 && pops[0].opcode.value === OP_RETURN) {
    return true;
  }

  return (
    l === 2 &&
    pops[0].opcode.value == OP_RETURN &&
    (isSmallInt(pops[1].opcode.value) ||
      pops[1].opcode.value <= OP_PUSHDATA4) &&
    pops[1].data.length <= MaxDataCarrierSize
  );
};

// parseScript parses a script getting all of its opcodes and which data they
// may have. This code was removed from dcrd due to Zero alloc optimization
// refactor optmization at txscript, but it is fine for decrediton as for now we
// dont decode big scripts on it.
// source: https://github.com/decred/dcrd/pull/1656/commits/fcb1f3a7a137f3d69091c23c0f349d35df6c1ee6
const parseScript = (script, opcodes = opcodeArray) => {
  if (!script) return;
  const retScript = [];
  for (let i = 0; i < script.length; i++) {
    const instr = script[i];
    const op = opcodes[instr];
    const pop = { opcode: op };

    if (op.length == 1) {
      retScript.push(pop);
      continue;
    } else if (op.length > 1) {
      if (script.slice(i).length < op.length) {
        return {
          retScript,
          error: `opcode ${op.name} requires ${
            op.length
          } bytes, but script only has ${script.slice(i).length} remaining.`
        };
      }
      pop.data = script.slice(i + 1, i + op.length);
      i += op.length - 1;
    } else if (op.legnth < 0) {
      let l;
      let off = i + 1;

      // negativeLengthHelper is an aux method to help get data and move the offset
      // of a script with negative length (little endian length) so we can get the
      // data. This way we can avoid code repetition.
      const negativeLengthHelper = () => {
        // Move offset to beginning of the data.
        off += -op.length;

        // Disallow entries that do not fit script or were
        // sign extended.
        if (l > script.slice(off).length || l < 0) {
          return {
            retScript,
            error: `opcode ${op.name} pushes ${l} bytes, but script only has ${
              script.slice(off).length
            } remaining`
          };
        }

        pop.data = script.slice(off, off + l);
        i += 1 - op.length + l;
      };
      if (script.slice(off).length < -op.length) {
        return {
          retScript,
          error: `opcode ${
            op.name
          } requires ${-op.length} bytes, but script only has ${
            script.slice(off).length
          } remaining.`
        };
      }

      // Next -length bytes are little endian length of data.
      switch (op.length) {
        case -1:
          l = script[off];
          negativeLengthHelper();
          break;
        case -2:
          l = (script[off + 1] << 8) | script[off];
          negativeLengthHelper();
          break;
        case -4:
          l =
            (script[off + 3] << 24) |
            (script[off + 2] << 16) |
            (script[off + 1] << 8) |
            script[off];
          negativeLengthHelper();
          break;
        default:
          return {
            retScript,
            error: `invalid opcode length ${op.length}`
          };
      }
    }

    retScript.push(pop);
  }

  return { retScript };
};

// // DisasmString formats a disassembled script for one line printing.  When the
// // script fails to parse, the returned string will contain the disassembled
// // script up to the point the failure occurred along with the string '[error]'
// // appended.  In addition, the reason the script failed to parse is returned
// // if the caller wants more information about the failure.
// const DisasmString = (buf) => {
//   let disbuf = "";
//   const parsedScript = parseScript(buf);
//   if (parsedScript) {
//     const { error, retScript } = parsedScript;
//     if (error) {
//       return { error };
//     }
//     for (let i = 0; i < retScript.length; i++) {
//       disbuf += printPop(retScript[i])
//     }
//   }

//   return disbuf;

// 	// for _, pop := range opcodes {
// 	// 	disbuf.WriteString(pop.print(true))
// 	// 	disbuf.WriteByte(' ')
// 	// }
// 	// if disbuf.Len() > 0 {
// 	// 	disbuf.Truncate(disbuf.Len() - 1)
// 	// }
// 	// if err != nil {
// 	// 	disbuf.WriteString("[error]")
// 	// }
// 	// return disbuf.String(), err
// }

// print returns a human-readable string representation of the opcode for use
// in script disassembly.
const printPop = (pop, oneline) => {
 	// The reference implementation one-line disassembly replaces opcodes
	// which represent values (e.g. OP_0 through OP_16 and OP_1NEGATE)
	// with the raw value.  However, when not doing a one-line dissassembly,
	// we prefer to show the actual opcode names.  Thus, only replace the
	// opcodes in question when the oneline flag is set.
	let dataString = pop.opcode.name;

  // Nothing more to do for non-data push opcodes.
  if (pop.opcode.length === 1) {
    return dataString;
  }
  dataString += " ";


  pop.data.map(buff => {
    dataString += ("00" + buff.toString(16)).slice(-2);
  });

  return dataString;
};
