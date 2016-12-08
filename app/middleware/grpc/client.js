process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import url from 'url';
import path from 'path';

import os from 'os';
import grpc from 'grpc';


//import Buffer from 'buffer';
var Buffer = require('buffer/').Buffer;

export function getCert() {
    var certPath = '';
    if (os.platform() == 'win32') {
        certPath = path.join(process.env.LOCALAPPDATA, 'Decrediton', 'rpc.cert');
    } else if (os.platform() == 'darwin') {
        certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'Decrediton', 'rpc.cert');
    } else {
        var certPath = path.join(process.env.HOME, '.decrediton', 'rpc.cert');
    }

    var cert = fs.readFileSync(certPath);
    return(cert)
}

export function client(address, port, cb) {
    var protoDescriptor = grpc.load('./app/api.proto');
    var walletrpc = protoDescriptor.walletrpc;

    var cert = getCert();
    var creds = grpc.credentials.createSsl(cert);
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

export function loader(address, port, cb) {
    var protoDescriptor = grpc.load('./app/api.proto');
    var walletrpc = protoDescriptor.walletrpc;

    var cert = getCert();
    var creds = grpc.credentials.createSsl(cert);
    var loader = new walletrpc.WalletLoaderService(address + ':' + port, creds);

    var deadline = new Date();
    var deadlineInSeconds = 2;
    deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
    grpc.waitForClientReady(loader, deadline, function(err) {
        if (err) {
            return cb(null, err);
        } else {
            return cb(loader);
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

export function walletExists(loader, cb) {
    var request = {};
   
    loader.walletExists(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(null, err);
        } else {
            return cb(response.exists, null);
        }
    });
}

export function createWallet(loader, pubPass, privPass, seed, cb) {
    var request = {
        public_passphrase: Buffer.from(pubPass),
        private_passphrase: Buffer.from(privPass),
        seed: Buffer.from(seed),
    };
   
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

export function openWallet(loader, publicPass, cb) {
    var request = {
        public_passphrase: Buffer.from(publicPass),
    };
   
    loader.openWallet(request, function(err, response) {
        if (err) {
            if (err.message.includes("wallet already loaded")) {
                return cb(response, null);
            } else {
                console.error(err.message);
                return cb(null, err);
            }
        } else {
            return cb(response, null);
        }
    });
}

export function closeWallet(loader, cb) {
    var request = {};
   
    loader.closeWallet(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(null, err);
        } else {
            return cb(response, null);
        }
    });
}

export function startConsensusRpc(loader, dcrd_network, username, password, cert, cb) {
    var request = {
        network_address: dcrd_network,
        username: username,
        password: password,
        certificate: cert,
    };
   
    loader.startConsensusRpc(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            return cb(response);
        }
    });
}

export function discoverAddresses(loader, discoverAccounts, privPass,  cb) {
    var request = {
        discover_accounts: discoverAccounts,
        private_passphrase: privPass,
    };
   
    loader.discoverAddresses(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            return cb(response);
        }
    });
}

export function subscribeBlockNtfns(loader, cb) {
    var request = {};
   
    loader.subscribeToBlockNotifications(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            return cb(response);
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

/*
random seed for dev: 
upshot paperweight billiard replica tactics hazardous 
retouch undaunted bluebird Norwegian ribcage enchanting 
brackish conformist hamlet bravado button undaunted 
Dupont voyager sentence dictator keyboard unify 
transit specialist regain insurgent spellbind consulting 
keyboard autopsy sawdust 

Hex: f4a51fc3de6da8ea249bac512735711b2dea52f7b9487aede7d5a47eca387a10
*/
