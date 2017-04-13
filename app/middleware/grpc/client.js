process.env['GRPC_SSL_CIPHER_SUITES'] = 'HIGH+ECDSA';

import grpc from 'grpc';

import { getCert } from '../../config.js';
var services = require('../walletrpc/api_grpc_pb.js');

export function getWalletService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var client = new services.WalletServiceClient(address + ':' + port, creds);

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

export function getTicketBuyerService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var client = new services.TicketBuyerServiceClient(address + ':' + port, creds);

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

export function loader(request, cb) {
  var cert = getCert();
  var creds = grpc.credentials.createSsl(cert);
  var loader = new services.WalletLoaderServiceClient(request.address + ':' + request.port, creds);

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

export function seeder(request, cb) {
  var cert = getCert();
  var creds = grpc.credentials.createSsl(cert);
  var seeder = new services.SeedServiceClient(request.address + ':' + request.port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(seeder, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(seeder);
    }
  });
}

export function getVersionService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var version = new services.VersionServiceClient(address + ':' + port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(version, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(version);
    }
  });
}
export function getVotingService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var version = new services.VersionServiceClient(address + ':' + port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(version, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(version);
    }
  });
}
export function getAgendaService(address, port, cb) {
  var cert = getCert();
  if (cert == '') {
    return cb(null, 'Unable to load dcrwallet certificate.  dcrwallet not running?');
  }
  var creds = grpc.credentials.createSsl(cert);
  var version = new services.VersionServiceClient(address + ':' + port, creds);

  var deadline = new Date();
  var deadlineInSeconds = 2;
  deadline.setSeconds(deadline.getSeconds()+deadlineInSeconds);
  grpc.waitForClientReady(version, deadline, function(err) {
    if (err) {
      return cb(null, err);
    } else {
      return cb(version);
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
