process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import url from 'url';
import path from 'path';

import os from 'os';
import grpc from 'grpc';


//import Buffer from 'buffer';
var Buffer = require('buffer/').Buffer;

export function client(address, port, cb) {
    var protoDescriptor = grpc.load('./app/api.proto');
    var walletrpc = protoDescriptor.walletrpc;

    var certPath = path.join(process.env.HOME, '.dcrwallet', 'rpc.cert');
    if (os.platform == 'win32') {
        certPath = path.join(process.env.LOCALAPPDATA, 'Dcrwallet', 'rpc.cert');
    } else if (os.platform == 'darwin') {
        certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'Dcrwallet', 'rpc.cert');
    }

    var cert = fs.readFileSync(certPath);
    var creds = grpc.credentials.createInsecure();
    var client = new walletrpc.WalletService(address + ':' + port, creds);

    var deadline = new Date();
    var deadlineInSeconds = 2;
    deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
    grpc.waitForClientReady(client, deadline, function(err) {
        if (err) {
            return cb(null, err);
        } else { 
            return cb(client);
        }
    });
}

export function getBalance(client, accountNumber, requiredConf, cb) {
    if (client === undefined) {
        return cb(null, new Error("Client not available to getBalance"));
    }
    var request = {
        account_number: accountNumber,
        required_confirmations: requiredConf
    };

    client.balance(request, function(err, response) {
        if (err) {
            console.error(null, err);
            return cb(null, err);
        } else {
            console.log('balance:', response);
            return cb(response);
        }
    });
}

export function getAccountNumber(client, accountName) {
    // AccountNumber
    var request = {
        account_name: accountName
    };

    client.accountNumber(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('accountnumber{"default"} ==', response);
        }
    });
}

export function getStakeInfo(client) {
    // StakeInfo
    var request = {};

    client.stakeInfo(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('current stakeInfo', response);
        }
    });
}

export function getPing(client) {
    // Ping
    var request = {};

    client.ping(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('ping', response);
        }
    });
}

export function getNetwork(client) {
    // Network
    var request = {};

    client.network(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('network', response);
        }
    });
}

export function getAccounts(client) {
    // Accounts
    var request = {};

    client.accounts(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('accounts', response);
        }
    });
}

export function getTransactions(client, start, end) {
    // Currently not working due to too large of messages
    // known issue by jrick.
    // GetTransactions
    var request = {
        starting_block_height: start,
        ending_block_height: end
    };

    client.getTransactions(request, function(err, response) {
        if (err) {
            console.error("getTransactions", err);
        } else {
            console.log('getTransactions', response.mined_transactions.length);
        }
    });
}

export function getTicketPrice(client) {
    // TicketPrice 
    var request = {};

    client.ticketPrice(request, function(err, response) {
        if (err) {
            console.error("ticketPrice", err);
        } else {
            console.log('ticketPrice', response);
        }
    });
}
// Available GRPC control client examples

export function getNextAddress(client, acountNum) {
    console.log("getting new address")
        // NextAddress
    var request = {
        account: accountNum
    };

    client.nextAddress(request, function(err, response) {
        if (err) {
            console.error("nextAddress", err);
        } else {
            console.log('nextAddress', response);
        }
    });
}


export function renameAccount(client, accountNumber, newName) {
    // RenameAccount
    var request = {
        account_number: accountNum,
        new_name: newName
    };

    client.renameAccount(request, function(err, response) {
        if (err) {
            console.error("renameAccount", err);
        } else {
            console.log('renameAccount', response);
        }
    });
}


export function rescan(client, beginHeight) {
    // Rescan
    var request = {
        begin_height: beginHeight
    };

    var rescanCall = client.rescan(request);
    recanCall.on('data', function(response) {
        console.log("Rescanned thru", response.rescanned_through);
    });
    rescanCall.on('end', function() {
        console.log("Rescan done")
            // The server has finished sending
    });
    rescanCall.on('status', function(status) {
        console.log("Rescan status:", status)
    });
}

export function getNextAccount(client, passphrase, accountName) {
    // NextAccount
    var request = {
        passphrase: Buffer.from(passphrase),
        account_name: accountName
    };

    client.nextAccount(request, function(err, response) {
        if (err) {
            console.error("nextAccount", err);
        } else {
            console.log('nextAccount', response);
        }
    });
}

export function importPrivateKey(client, passphrase, accountNum, wif, rescan, scanFrom) {
    // ImportPrivateKey
    var request = {
        passphrase: Buffer.from(passphrase),
        account: accountNum,
        private_key_wif: wif,
        rescan: rescan,
        scan_from: scanFrom
    };

    client.importPrivateKey(request, function(err, response) {
        if (err) {
            console.error("importPrivateKey", err);
        } else {
            console.log('importePrivateKey', response);
        }
    });
}

export function importScript(client, passphrase, script, rescan, scanFrom) {
    // ImportScript
    var request = {
        passphrase: Buffer.from(passphrase),
        script: script,
        rescan: rescan,
        scan_from: scanFrom
    };

    client.importScript(request, function(err, response) {
        if (err) {
            console.error("importScript", err);
        } else {
            console.log('importScript', response);
        }
    });
}

export function changePassphrase(client, oldP, newP) {
    // ChangePassphrase 
    var request = {
        old_passphrase: Buffer.from(oldP),
        new_passphrase: Buffer.from(newP)
    };

    client.changePassphrase(request, function(err, response) {
        if (err) {
            console.error("changePassphrase", err);
        } else {
            console.log('changePassphrase', response);
        }
    });
}


// TODO add unsigned tx contruction which will then be 
// sent to sign/publishTransaction
//

export function getFundingTransaction(client, accountNum, targetAmount, requiredConf) {
    // FundTransaction
    var request = {
        account: accountNum,
        target_amount: targetAmount,
        required_confirmations: requiredConf
    };

    client.fundTransaction(request, function(err, response) {
        if (err) {
            console.error("fundTransaction", err);
        } else {
            console.log('fundTransaction', response);
        }
    });
}

export function signTransction(client, passphrase, rawTx) {
    // SignTransaction
    var request = {
        passphrase: Buffer.from(passphrase),
        serialized_transaction: rawTx
    };

    client.signTransaction(request, function(err, response) {
        if (err) {
            console.error("signTransaction", err);
        } else {
            console.log("signTransaction", response);
        }
    });
}

export function publishTransaction(client, txId) {
    // PublishTransaction
    var request = {
        signed_transaction: txId
    };

    client.publishTransaction(request, function(err, response) {
        if (err) {
            console.error("publishTransaction", err);
        } else {
            console.log("publishTransaction", response);
        }
    });
}

export function purchaseTickets(client, passphrase, accountNum, spendLimit, requiredConf,
ticketAddress, numTickets, poolAddress, poolFees, expiry, txFee, ticketFee) {
    // PurchaseTickets
    var request = {
        passphrase: Buffer.from(passphrase),
        account: accountNum,
        spend_limit: spendLimit,
        required_confirmations: requiredConf,
        ticket_address: ticketAddress,
        num_tickets: numTickets,
        pool_address: poolAddress,
        pool_fees: poolFees,
        expiry: expiry,
        tx_fee: txFee,
        ticket_fee: ticketFee
    };

    client.purchaseTickets(request, function(err, response) {
        if (err) {
            console.error("purchaseTickets", err);
        } else {
            console.log('purchaseTickets', response);
        }
    });
}

export function createWallet(client, pubPass, privPass, seed, cb) {
    console.log(pubPass, privPass, seed);
    var request = {
        public_passphrase: Buffer.from(pubPass),
        private_passphrase: Buffer.from(privPass),
        seed: Buffer.from(seed),
    };
    console.log(request);
    var protoDescriptor = grpc.load('./app/api.proto');
    var walletrpc = protoDescriptor.walletrpc;

    var certPath = path.join(process.env.HOME, '.dcrwallet', 'rpc.cert');
    if (os.platform == 'win32') {
        certPath = path.join(process.env.LOCALAPPDATA, 'Dcrwallet', 'rpc.cert');
    } else if (os.platform == 'darwin') {
        certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'Dcrwallet', 'rpc.cert');
    }
    /*
    reform certify stagnate dictator dashboard telephone 
    deckhand vagabond breadline decadence frighten Wichita 
    playhouse microscope puppy aftermath eightball pharmacy 
    commence bottomless southward decadence absurd Orlando 
    pheasant revival rocker chambermaid hockey replica 
    Geiger aggregate topmost 
    */
    //a329d04847de49f2284168fb938d9b0257af3d19c64101a091cbaf2a73c36a03
    var cert = fs.readFileSync(certPath);
    var creds = grpc.credentials.createInsecure();
    var loader = new walletrpc.WalletLoaderService("127.0.0.1:19113", creds);
    loader.createWallet(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            console.log('created wallet');
            return cb();
        }
    });
}

export function transactionNtfs(client) {
    // Register Notification Streams from Wallet
    var request = {};
    var transactionNtfns = client.transactionNotifications(request);
    transactionNtfns.on('data', function(response) {
        console.log("Transaction received:", response);
    });
    transactionNtfns.on('end', function() {
        console.log("Transaction notifications done")
        // The server has finished sending
    });
    transactionNtfns.on('status', function(status) {
        console.log("Transaction notifications status:", status)
    });
}

export function spentnessNtfs(client, accountNum) {
    var request = {
	    account: accountNum
    };
    var spentnessNtfns = client.spentnessNotifications(request);
    spentnessNtfns.on('data', function(response) {
        console.log("Spentness notification received:", response);
    });
    spentnessNtfns.on('end', function() {
        console.log("Spentness notifications done")
        // The server has finished sending
    });
    spentnessNtfns.on('status', function(status) {
        console.log("Spentness notifications status:", status)
    });
}

export function accountNtfs(client) {
    var request = {};
    var accountNtfns = client.accountNotifications(request);
    accountNtfns.on('data', function(response) {
        console.log("Account notification received:", response);
    });
    accountNtfns.on('end', function() {
        console.log("Account notifications done")
        // The server has finished sending
    });
    accountNtfns.on('status', function(status) {
        console.log("Account notifications status:", status)
    });
}
