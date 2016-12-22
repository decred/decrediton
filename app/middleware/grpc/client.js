process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import fs from 'fs';
import path from 'path';

import os from 'os';
import grpc from 'grpc';

import { getCfg } from '../../config.js';

export function getCert() {
  var cfg = getCfg();
  if (cfg.cert_path != '') {
    return(cfg.cert_path);
  }
  var certPath = '';
  if (os.platform() == 'win32') {
    certPath = path.join(process.env.LOCALAPPDATA, 'Decrediton', 'rpc.cert');
  } else if (os.platform() == 'darwin') {
    certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'decrediton', 'rpc.cert');
  } else {
    certPath = path.join(process.env.HOME, '.decrediton', 'rpc.cert');
  }

  var cert = fs.readFileSync(certPath);
  return(cert);
}

export function getApi() {
  var apiPath = '';
  if (os.platform() == 'win32') {
    apiPath = path.join(process.env.LOCALAPPDATA, 'Decrediton', 'api.proto');
  } else if (os.platform() == 'darwin') {
    apiPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'decrediton', 'api.proto');
  } else {
    apiPath = path.join(process.env.HOME, '.decrediton', 'api.proto');
  }

  return(apiPath);
}

export function getDcrdCert() {
  var cfg = getCfg();
  if (cfg.daemon_cert_path != '') {
    return(cfg.daemon_cert_path);
  }
  var certPath = '';
  if (os.platform() == 'win32') {
    certPath = path.join(process.env.LOCALAPPDATA, 'Decrediton', 'rpc.cert');
  } else if (os.platform() == 'darwin') {
    certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'decrediton', 'rpc.cert');
  } else {
    certPath = path.join(process.env.HOME, '.dcrd', 'rpc.cert');
  }

  var cert = fs.readFileSync(certPath);
  return(cert);
}

export function getWalletService(address, port, cb) {
  var protoDescriptor = grpc.load(getApi());
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

export function getBalance(client, request, cb) {
  if (client === undefined) {
    return cb(null, new Error('Client not available to getBalance'));
  }

  client.balance(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      return cb(response);
    }
  });
}

export function getAccountNumber(client, request, cb) {
  client.accountNumber(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      console.log('accountnumber{"default"} ==', response);
      return cb(response);
    }
  });
}

export function getStakeInfo(client, request, cb) {
  client.stakeInfo(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      console.log('current stakeInfo', response);
      return cb(response);
    }
  });
}

export function getPing(client, request, cb) {
  client.ping(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      console.log('ping', response);
      return cb(response);
    }
  });
}

export function getNetwork(client, request, cb) {
  client.network(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      console.log('network', response);
      return cb(response);
    }
  });
}

export function getAccounts(client, request, cb) {
    // Accounts
  var request = {};

  client.accounts(request, function(err, response) {
    if (err) {
      console.error(err);
      return cb(null, err);
    } else {
      console.log('accounts', response);
      return cb(response);
    }
  });
}

export function getTransactions(client, request, cb) {
  var getTx = client.getTransactions(request);
  getTx.on('data', function(response) {
    return cb(false, response);
  });
  getTx.on('end', function() {
    return cb(true);
  });
  getTx.on('status', function(status) {
    console.log('GetTx status:', status);
  });
  getTx.on('error', function(err) {
    return cb(false, null, err);
  });
}

export function getTicketPrice(client, request, cb) {
  client.ticketPrice(request, function(err, response) {
    if (err) {
      console.error('ticketPrice', err);
      return cb(null, err);
    } else {
      console.log('ticketPrice', response);
      return cb(response);
    }
  });
}

export function transactionNtfs(client, request, cb) {
    // Register Notification Streams from Wallet
  var transactionNtfns = client.transactionNotifications(request);
  transactionNtfns.on('data', function(response) {
    return cb(response);
  });
  transactionNtfns.on('end', function() {
    console.log('Transaction notifications done');
        // The server has finished sending
  });
  transactionNtfns.on('status', function(status) {
    console.log('Transaction notifications status:', status);
  });
}

export function spentnessNtfs(client, request, cb) {
  var spentnessNtfns = client.spentnessNotifications(request);
  spentnessNtfns.on('data', function(response) {
    return cb(response);
  });
  spentnessNtfns.on('end', function() {
    console.log('Spentness notifications done');
        // The server has finished sending
  });
  spentnessNtfns.on('status', function(status) {
    console.log('Spentness notifications status:', status);
  });
}

export function accountNtfs(client, request, cb) {
  var accountNtfns = client.accountNotifications(request);
  accountNtfns.on('data', function(response) {
    return cb(response);
  });
  accountNtfns.on('end', function() {
    console.log('Account notifications done');
        // The server has finished sending
  });
  accountNtfns.on('status', function(status) {
    console.log('Account notifications status:', status);
  });
}

/*
random seed for dev:
upshot paperweight billiard replica tactics hazardous retouch undaunted bluebird Norwegian ribcage enchanting brackish conformist hamlet bravado button undaunted Dupont voyager sentence dictator keyboard unify transit specialist regain insurgent spellbind consulting keyboard autopsy sawdust

Hex: f4a51fc3de6da8ea249bac512735711b2dea52f7b9487aede7d5a47eca387a10
     f4a51fc3de6da8ea249bac512735711b2dea52f7b9487aede7d5a47eca387a10
     */
