import {
    isValidAddress, 
    ERR_INVALID_ADDR_EMPTY, 
    ERR_INVALID_ADDR_TOOSHORT, 
    ERR_INVALID_ADDR_TOOLONG, 
    ERR_INVALID_ADDR_NETWORKPREFIX,
    ERR_INVALID_ADDR_CHECKSUM
} from "../../../app/helpers/addresses";

const MAINNET_ADDR = "DsdyVKiVuS6hpaaTtV2tBq1CqUK9ya38kwK";
const TESTNET_ADDR = "TsWoR2B5QhqBas1pR4YmptEKcKBJoxpTBmB";
const MAINNET = "mainnet";
const TESTNET = "testnet";

//TESTNET
test('Empty address should return ERR_INVALID_ADDR_EMPTY', () => {
    expect(isValidAddress("", TESTNET)).toBe(ERR_INVALID_ADDR_EMPTY);
  });

test('Address with length < 25 should return ERR_INVALID_ADDR_TOOSHORT', () => {
    expect(isValidAddress("12345678901234567890", TESTNET)).toBe(ERR_INVALID_ADDR_TOOSHORT);
});  

test('Address with length > 36 should return ERR_INVALID_ADDR_TOOLONG', () => {
    expect(isValidAddress("1234567890123456789012345678901234567890", TESTNET)).toBe(ERR_INVALID_ADDR_TOOLONG);
});

test('Address with prefix of T on mainnet should return ERR_INVALID_ADDR_NETWORKPREFIX', () => {
    expect(isValidAddress(TESTNET_ADDR, MAINNET)).toBe(ERR_INVALID_ADDR_NETWORKPREFIX);
});

test('Valid testnet address on testnet should return null', () => {
    expect(isValidAddress(TESTNET_ADDR, TESTNET)).toBe(null);
});

test('Invalid testnet address on testnet should return ERR_INVALID_ADDR_CHECKSUM', () => {
    expect(isValidAddress(TESTNET_ADDR.replace('B', 'b'), TESTNET)).toBe(ERR_INVALID_ADDR_CHECKSUM);
});

//MAINNET
test('Empty address should return ERR_INVALID_ADDR_EMPTY', () => {
    expect(isValidAddress("", MAINNET)).toBe(ERR_INVALID_ADDR_EMPTY);
  });

test('Address with length < 25 should return ERR_INVALID_ADDR_TOOSHORT', () => {
    expect(isValidAddress("12345678901234567890", MAINNET)).toBe(ERR_INVALID_ADDR_TOOSHORT);
});  

test('Address with length > 36 should return ERR_INVALID_ADDR_TOOLONG', () => {
    expect(isValidAddress("1234567890123456789012345678901234567890", MAINNET)).toBe(ERR_INVALID_ADDR_TOOLONG);
});

test('Address with prefix of M on testnet should return ERR_INVALID_ADDR_NETWORKPREFIX', () => {
    expect(isValidAddress(MAINNET_ADDR, TESTNET)).toBe(ERR_INVALID_ADDR_NETWORKPREFIX);
});

test('Valid mainnet address on mainnet should return null', () => {
    expect(isValidAddress(MAINNET_ADDR, MAINNET)).toBe(null);
});

test('Invalid mainnet address on mainnet should return ERR_INVALID_ADDR_CHECKSUM', () => {
    expect(isValidAddress(MAINNET_ADDR.replace('B', 'b'), MAINNET)).toBe(ERR_INVALID_ADDR_CHECKSUM);
});