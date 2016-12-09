process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import url from 'url';
import path from 'path';
import { getCert } from './client';
import os from 'os';
import grpc from 'grpc';

var Buffer = require('buffer/').Buffer;

export function loader(request, cb) {
    var protoDescriptor = grpc.load('./app/api.proto');
    var walletrpc = protoDescriptor.walletrpc;

    var cert = getCert();
    var creds = grpc.credentials.createSsl(cert);
    var loader = new walletrpc.WalletLoaderService(request.address + ':' + request.port, creds);

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

export function walletExists(loader, request, cb) {
    loader.walletExists(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(null, err);
        } else {
            return cb(response);
        }
    });
}

export function createWallet(loader, request, cb) {
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

export function openWallet(loader, request, cb) {
    loader.openWallet(request, function(err, response) {
        if (err) {
            if (err.message.includes("wallet already loaded")) {
                return cb(response, null);
            } else {
                console.error(err.message);
                return cb(null, err);
            }
        } else {
            return cb();
        }
    });
}

export function closeWallet(loader,request, cb) {
    loader.closeWallet(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(null, err);
        } else {
            return cb(response, null);
        }
    });
}

export function startConsensusRpc(loader, request, cb) {
    loader.startConsensusRpc(request, function(err, response) {
        if (err) {
            if (err.message.includes("RPC client already created")) {
                return cb();
            } else {
                console.error(err);
                return cb(err);
            }
        } else {
            return cb();
        }
    });
}

export function discoverAddresses(loader, request, cb) {
    loader.discoverAddresses(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            return cb();
        }
    });
}

export function subscribeBlockNtfns(loader, request, cb) {
    loader.subscribeToBlockNotifications(request, function(err, response) {
        if (err) {
            console.error(err);
            return cb(err);
        } else {
            return cb();
        }
    });
}
