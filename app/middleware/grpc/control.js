// Available GRPC control client examples

export function getNextAddress(client, acountNum, cb) {
    console.log("getting new address")
        // NextAddress
    var request = {
        account: accountNum
    };

    client.nextAddress(request, function(err, response) {
        if (err) {
            console.error("nextAddress", err);
            return cb(null, err);
        } else {
            console.log('nextAddress', response);
            return cb(response);
        }
    });
}


export function renameAccount(client, accountNumber, newName, cb) {
    // RenameAccount
    var request = {
        account_number: accountNum,
        new_name: newName
    };

    client.renameAccount(request, function(err, response) {
        if (err) {
            console.error("renameAccount", err);
            return cb(null, err);
        } else {
            console.log('renameAccount', response);
            return cb(response);
        }
    });
}


export function rescan(client, beginHeight, cb) {
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

export function getNextAccount(client, passphrase, accountName, cb) {
    // NextAccount
    var request = {
        passphrase: Buffer.from(passphrase),
        account_name: accountName
    };

    client.nextAccount(request, function(err, response) {
        if (err) {
            console.error("nextAccount", err);
            return cb(null, err);
        } else {
            console.log('nextAccount', response);
            return cb(response);
        }
    });
}

export function importPrivateKey(client, passphrase, accountNum, wif, rescan, scanFrom, cb) {
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
            return cb(null, err);
        } else {
            console.log('importePrivateKey', response);
            return cb(response);
        }
    });
}

export function importScript(client, passphrase, script, rescan, scanFrom, cb) {
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
            return cb(null, err);
        } else {
            console.log('importScript', response);
            return cb(response);
        }
    });
}

export function changePassphrase(client, oldP, newP, cb) {
    // ChangePassphrase 
    var request = {
        old_passphrase: Buffer.from(oldP),
        new_passphrase: Buffer.from(newP)
    };

    client.changePassphrase(request, function(err, response) {
        if (err) {
            console.error("changePassphrase", err);
            return cb(null, err);
        } else {
            console.log('changePassphrase', response);
            return cb(response);
        }
    });
}


// TODO add unsigned tx contruction which will then be 
// sent to sign/publishTransaction
//

export function getFundTransaction(client, accountNum, targetAmount, requiredConf, cb) {
    // FundTransaction
    var request = {
        account: accountNum,
        target_amount: targetAmount,
        required_confirmations: requiredConf
    };

    client.fundTransaction(request, function(err, response) {
        if (err) {
            console.error("fundTransaction", err);
            return cb(null, err);
        } else {
            console.log('fundTransaction', response);
            return cb(response);
        }
    });
}

export function signTransction(client, passphrase, rawTx, cb) {
    // SignTransaction
    var request = {
        passphrase: Buffer.from(passphrase),
        serialized_transaction: rawTx
    };

    client.signTransaction(request, function(err, response) {
        if (err) {
            console.error("signTransaction", err);
            return cb(null, err);
        } else {
            console.log("signTransaction", response);
            return cb(response);
        }
    });
}

export function publishTransaction(client, txId, cb) {
    // PublishTransaction
    var request = {
        signed_transaction: txId
    };

    client.publishTransaction(request, function(err, response) {
        if (err) {
            console.error("publishTransaction", err);
            return cb(null, err);
        } else {
            console.log("publishTransaction", response);
            return cb(response);
        }
    });
}

export function purchaseTickets(client, passphrase, accountNum, spendLimit, requiredConf,
ticketAddress, numTickets, poolAddress, poolFees, expiry, txFee, ticketFee, cb) {
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
            return cb(null, err);
        } else {
            console.log('purchaseTickets', response);
            return cb(response);
        }
    });
}