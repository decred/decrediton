process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

var fs = require('fs');
var url = require('url');
var path = require('path');

var os = require('os');
var grpc = require('grpc');
var Buffer = require('buffer/').Buffer;
var protoDescriptor = grpc.load('./api.proto');
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

var resultText = document.createElement('div')
document.body.appendChild(resultText)

var getBalanceBtn = document.createElement('button')
getBalanceBtn.textContent = 'Get Balance'
getBalanceBtn.addEventListener('click', getBalance, false)
document.getElementById('buttonArea').appendChild(getBalanceBtn)

var getTicketPriceBtn = document.createElement('button')
getTicketPriceBtn.textContent = 'Get Ticket Price'
getTicketPriceBtn.addEventListener('click', getTicketPrice, false)
document.getElementById('buttonArea').appendChild(getTicketPriceBtn)

var getStakeInfoBtn = document.createElement('button')
getStakeInfoBtn.textContent = 'Get Stake Info'
getStakeInfoBtn.addEventListener('click', getStakeInfo, false)
document.getElementById('buttonArea').appendChild(getStakeInfoBtn)

var getNextAddressBtn = document.createElement('button')
getNextAddressBtn.textContent = 'Get Next Address'
getNextAddressBtn.addEventListener('click', getNextAddress(resultText), false)
document.getElementById('buttonArea').appendChild(getNextAddressBtn)

function getBalance() {
    // Balance
    var request = {
        account_number: 0,
        required_confirmations: 1
    };

    client.balance(request, function(err, response) {
        if (err) {
            console.error(err);
        } else {
            resultText.children
            console.log('balance:', response);
        }
    });
}



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

function getNextAddress(resultText) {
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


// TODO rescan looks a little off
function rescan() {
    // Rescan
    var request = {
        begin_height: 0
    };

    client.rescan(request, function(err, response) {
        if (err) {
            console.error("rescan", err);
        } else {
            console.log('rescan', response);
        }
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