//process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import url from 'url';
import path from 'path';

import os from 'os';
import grpc from 'grpc';


import Buffer from 'buffer';
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
var client = new walletrpc.WalletService('localhost:19112', creds);

console.log("here!");
    var request = {
        account_number: 0,
        required_confirmations: 1
    };

    client.balance(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('balance:', response);
        }
    });
/*
function getAccountNumber() {
    // AccountNumber
    var request = {
        account_name: "default"
    };

    client.accountNumber(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            console.log('accountnumber{"default"} ==', response);
        }
    });
}

function getStakeInfo() {
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

function getPing() {
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

function getNetwork() {
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

function getAccounts() {
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

function getTransactions() {
    // Currently not working due to too large of messages
    // known issue by jrick.
    // GetTransactions
    var request = {
        starting_block_height: 120000,
        ending_block_height: 130000
    };

    client.getTransactions(request, function(err, response) {
        if (err) {
            console.error("getTransactions", err);
        } else {
            console.log('getTransactions', response.mined_transactions.length);
        }
    });
}

function getTicketPrice() {
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

function getNextAddress() {
    console.log("getting new address")
        // NextAddress
    var request = {
        account: 0
    };

    client.nextAddress(request, function(err, response) {
        if (err) {
            console.error("nextAddress", err);
        } else {
            console.log('nextAddress', response);
        }
    });
}


function renameAccount(accountNumber, newName) {
    // RenameAccount
    var request = {
        account_number: accountNumber,
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


function rescan() {
    // Rescan
    var request = {
        begin_height: 0
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

function getNextAccount(accountName) {
    // NextAccount
    var request = {
        passphrase: Buffer.from('password1'),
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

function importPrivateKey() {
    // ImportPrivateKey
    var request = {
        passphrase: Buffer.from('password1'),
        account: 0,
        private_key_wif: "< wif string >",
        rescan: true,
        scan_from: 133700
    };

    client.importPrivateKey(request, function(err, response) {
        if (err) {
            console.error("importPrivateKey", err);
        } else {
            console.log('importePrivateKey', response);
        }
    });
}

function importScript() {

    // ImportScript
    var request = {
        passphrase: Buffer.from('password1'),
        script: "< script hash >",
        rescan: true,
        scan_from: 133700
    };

    client.importScript(request, function(err, response) {
        if (err) {
            console.error("importScript", err);
        } else {
            console.log('importScript', response);
        }
    });
}

function changePassphrase() {
    // ChangePassphrase 
    var request = {
        old_passphrase: Buffer.from('password'),
        new_passphrase: Buffer.from('password1')
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

function getFundingTransaction() {
    // FundTransaction
    var request = {
        account: 0,
        target_amount: 1,
        required_confirmations: 1
    };

    client.fundTransaction(request, function(err, response) {
        if (err) {
            console.error("fundTransaction", err);
        } else {
            console.log('fundTransaction', response);
        }
    });
}

function signTransction(rawTx) {
    // SignTransaction
    var request = {
        passphrase: Buffer.from('password1'),
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

function publishTransaction(txId) {
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

function purchaseTickets() {
    // PurchaseTickets
    var request = {
        passphrase: Buffer.from('password1'),
        account: 0,
        spend_limit: 5000000000000,
        required_confirmations: 1,
        ticket_address: "",
        num_tickets: 10,
        pool_address: "",
        pool_fees: 0,
        expiry: 0,
        tx_fee: 0.01,
        ticket_fee: 0.01
    };

    client.purchaseTickets(request, function(err, response) {
        if (err) {
            console.error("purchaseTickets", err);
        } else {
            console.log('purchaseTickets', response);
        }
    });
}

function transactionNtfs() {
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

function spentnessNtfs() {
var request = {
	account: 0
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

function accountNtfs() {
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
*/
