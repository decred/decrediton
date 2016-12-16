// Available GRPC control client examples

export function getNextAddress(client, request, cb) {
    // NextAddress
  client.nextAddress(request, function(err, response) {
    if (err) {
      console.error('nextAddress', err);
      return cb(null, err);
    } else {
      console.log('nextAddress', response);
      return cb(response);
    }
  });
}


export function renameAccount(client, request, cb) {
    // RenameAccount

  client.renameAccount(request, function(err, response) {
    if (err) {
      console.error('renameAccount', err);
      return cb(null, err);
    } else {
      console.log('renameAccount', response);
      return cb(response);
    }
  });
}


export function rescan(client, request, cb) {
    // Rescan

  var rescanCall = client.rescan(request);
  rescanCall.on('data', function(response) {
    console.log('Rescanned thru', response.rescanned_through);
    return cb(response);
  });
  rescanCall.on('end', function() {
    console.log('Rescan done');
  });
  rescanCall.on('status', function(status) {
    console.log('Rescan status:', status);
  });
}

export function getNextAccount(client, request, cb) {
    // NextAccount

  client.nextAccount(request, function(err, response) {
    if (err) {
      console.error('nextAccount', err);
      return cb(null, err);
    } else {
      console.log('nextAccount', response);
      return cb(response);
    }
  });
}

export function importPrivateKey(client, request, cb) {
    // ImportPrivateKey

  client.importPrivateKey(request, function(err, response) {
    if (err) {
      console.error('importPrivateKey', err);
      return cb(null, err);
    } else {
      console.log('importePrivateKey', response);
      return cb(response);
    }
  });
}

export function importScript(client, request, cb) {
    // ImportScript

  client.importScript(request, function(err, response) {
    if (err) {
      console.error('importScript', err);
      return cb(null, err);
    } else {
      console.log('importScript', response);
      return cb(response);
    }
  });
}

export function changePassphrase(client, request, cb) {
    // ChangePassphrase

  client.changePassphrase(request, function(err, response) {
    if (err) {
      console.error('changePassphrase', err);
      return cb(null, err);
    } else {
      console.log('changePassphrase', response);
      return cb(response);
    }
  });
}

export function loadActiveDataFilters(client, request, cb) {
    // ChangePassphrase

  client.loadActiveDataFilters(request, function(err, response) {
    if (err) {
      console.error('loadActiveDataFilters', err);
      return cb(null, err);
    } else {
      console.log('loadActiveDataFilters', response);
      return cb(response);
    }
  });
}

// TODO add unsigned tx contruction which will then be
// sent to sign/publishTransaction
//

export function getFundTransaction(client, request, cb) {
    // FundTransaction

  client.fundTransaction(request, function(err, response) {
    if (err) {
      console.error('fundTransaction', err);
      return cb(null, err);
    } else {
      console.log('fundTransaction', response);
      return cb(response);
    }
  });
}

export function signTransaction(client, request, cb) {
    // SignTransaction

  client.signTransaction(request, function(err, response) {
    if (err) {
      console.error('signTransaction', err);
      return cb(null, err);
    } else {
      console.log('signTransaction', response);
      return cb(response);
    }
  });
}

export function publishTransaction(client, request, cb) {
    // PublishTransaction

  client.publishTransaction(request, function(err, response) {
    if (err) {
      console.error('publishTransaction', err);
      return cb(null, err);
    } else {
      console.log('publishTransaction', response);
      return cb(response);
    }
  });
}

export function purchaseTickets(client, request, cb) {
    // PurchaseTickets

  client.purchaseTickets(request, function(err, response) {
    if (err) {
      console.error('purchaseTickets', err);
      return cb(null, err);
    } else {
      console.log('purchaseTickets', response);
      return cb(response);
    }
  });
}


export function constructTransaction(client, request, cb) {
    // PurchaseTickets
  client.constructTransaction(request, function(err, response) {
    if (err) {
      console.error('constructTransaction', err);
      return cb(null, err);
    } else {
      console.log('constructTransaction', response);
      return cb(response);
    }
  });
}
