process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import url from 'url';
import path from 'path';
import { getCert } from './client';
import os from 'os';
import grpc from 'grpc';

var Buffer = require('buffer/').Buffer;

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
