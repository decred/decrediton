import { GetTicketsResponse } from "../middleware/walletrpc/api_pb";
import { OP_RETURN, SStxPKHMinOutSize, ripemd160Size } from "constants";
import { checkEncode } from "./addresses";

export const TicketTypes = new Map([
  [GetTicketsResponse.TicketDetails.TicketStatus.UNKNOWN, "unknown"],
  [GetTicketsResponse.TicketDetails.TicketStatus.UNMINED, "unmined"],
  [GetTicketsResponse.TicketDetails.TicketStatus.IMMATURE, "immature"],
  [GetTicketsResponse.TicketDetails.TicketStatus.LIVE, "live"],
  [GetTicketsResponse.TicketDetails.TicketStatus.VOTED, "voted"],
  [GetTicketsResponse.TicketDetails.TicketStatus.MISSED, "missed"],
  [GetTicketsResponse.TicketDetails.TicketStatus.EXPIRED, "expired"],
  [GetTicketsResponse.TicketDetails.TicketStatus.REVOKED, "revoked"]
]);

// decodeVoteScript decodes the output script of a vote transaction into the
// voted choice. Must be passed an array with the binary script. Returns null
// if the script is not a vote script. Network is the network for which the
// vote was cast.
// Testing whether the provided script is a vote script is really basic right
// now.
// Reference for what a voting script looks like (as of this writing):
// https://github.com/decred/dcrd/blob/3f3174c987091b03bb34f1fdf4614d10ce6fbfc5/blockchain/stake/staketx.go#L458
export function decodeVoteScript(network, outputScript) {
  if (outputScript.length < 4 || outputScript[0] !== OP_RETURN) {
    // 0x6a == OP_RETURN
    return null;
  }
  if (outputScript.length > 8) {
    console.log("Vote script with extended bits not yet supported");
    return null;
  }

  const vote = outputScript
    .slice(2, 4)
    .reduce((a, v, i) => a | (v << (i * 8), 0));
  const version =
    outputScript.length > 4
      ? outputScript.slice(4, 8).reduce((a, v, i) => a | (v << (i * 8)), 0)
      : 0;

  // TODO: currently hard coded because dcrwallet doesn't return all
  // agendas (only the active ones). All agendas are needed for historical
  // votes.
  const agendas = {
    testnet: {
      5: [
        {
          mask: 0x06,
          name: "DCP0001",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ],
      6: [
        {
          mask: 0x06,
          name: "DCP0002&3",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ],
      7: [
        {
          mask: 0x06,
          name: "DCP0004",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ],
      8: [
        {
          mask: 0x06,
          name: "DCP0005",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ]
    },
    mainnet: {
      4: [
        {
          mask: 0x06,
          name: "DCP0001",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        },
        {
          mask: 0x18,
          name: "lnsupport",
          choices: { 0x08: "no", 0x10: "yes" },
          defaultChoice: "abstain"
        }
      ],
      5: [
        {
          mask: 0x06,
          name: "DCP0002&3",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ],
      6: [
        {
          mask: 0x06,
          name: "DCP0004",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ],
      7: [
        {
          mask: 0x06,
          name: "DCP0005",
          choices: { 0x02: "no", 0x04: "yes" },
          defaultChoice: "abstain"
        }
      ]
    }
  };

  if (!(version in agendas[network])) {
    console.log(`Error: unknown agenda ${version}`);
    return null;
  }

  const voteAgendas = agendas[network][version];
  const voteChoices = {};

  for (let i = 0; i < voteAgendas.length; i++) {
    const voteItem = voteAgendas[i];
    const itemValue = vote & voteItem.mask;
    if (itemValue in voteItem.choices) {
      voteChoices[voteItem.name] = voteItem.choices[itemValue];
    } else {
      voteChoices[voteItem.name] = voteItem.defaultChoice;
    }
  }

  return voteChoices;
}

// addrFromSStxPkScrCommitment extracts a P2SH or P2PKH address from a ticket
// commitment pkScript.
export const addrFromSStxPkScrCommitment = (pkScript, params) => {
  if (pkScript.length < SStxPKHMinOutSize) {
    return { error: `pkScript must be ${SStxPKHMinOutSize} bytes` };
  }

  // The MSB of the encoded amount specifies if the output is P2SH.  Since
  // it is encoded with little endian, the MSB is in final byte in the encoded
  // amount.
  //
  // This is a faster equivalent of:
  //
  //	amtBytes := script[22:30]
  //	amtEncoded := binary.LittleEndian.Uint64(amtBytes)
  //	isP2SH := (amtEncoded & uint64(1<<63)) != 0

  const isP2SH = pkScript[29] & (0x80 != 0);
  // The 20 byte PKH or SH.
  const hashBytes = pkScript.slice(2, 22);

  // Return the correct address type.
  if (isP2SH) {
    return { address: newAddressScriptHashFromHash(hashBytes, params) };
  }
  return { address: newAddressPubKeyHash(hashBytes, params, 0) };
};

// newAddressScriptHashFromHash is the internal API to create a script hash
// address with a known leading identifier byte for a network, rather than
// looking it up through its parameters.  This is useful when creating a new
// address structure from a string encoding where the identifier byte is already
// known.
const newAddressScriptHashFromHash = (scriptHash, netId) => {
  if (scriptHash.length !== ripemd160Size) {
    return { error: "pkHash must be 20 bytes" };
  }

  return checkEncode(scriptHash.slice(0, 20), netId);
};

// newAddressPubKeyHash returns a new AddressPubKeyHash.  pkHash must
// be 20 bytes.
const newAddressPubKeyHash = (scriptHash, net, algo) => {
  // Ensure the provided signature algo is supported.
  let addrID;
  switch (algo) {
    // when extracting address from a SStxPkScrCommitment script, the algo used
    // is dcrec.STEcdsaSecp256k1 equals 0.
    case 0:
      addrID = net.PubKeyHashAddrID;
      break;
    // TODO finish getting address from pubkeyHash to add support to decrediton.
    // case dcrec.STEd25519:
    // 	addrID = net.AddrIDPubKeyHashEd25519V0()
    // case dcrec.STSchnorrSecp256k1:
    // 	addrID = net.AddrIDPubKeyHashSchnorrV0()
    default:
      return null;
  }

  // Ensure the provided pubkey hash length is valid.
  if (scriptHash.length !== ripemd160Size) {
    return { error: "pkHash must be 20 bytes" };
  }

  const addr = { netID: addrID };
  addr.hash = scriptHash.slice(0, ripemd160Size);

  return checkEncode(scriptHash.slice(0, 20), addrID);
};
