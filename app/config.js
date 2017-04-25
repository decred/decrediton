import fs from 'fs';
import path from 'path';
import os from 'os';
import { stakePoolInfo } from './middleware/stakepoolapi';
var ini = require('ini');

export function getCfg(update) {
  const Config = require('electron-config');
  const config = new Config();
  // If value is missing (or no config file) write the defaults.
  if (!config.has('network')) {
    config.set('network', 'mainnet');
  }
  if (!config.has('wallet_port_testnet')) {
    config.set('wallet_port_testnet', '19112');
  }
  if (!config.has('wallet_port')) {
    config.set('wallet_port', '9112');
  }
  if (!config.has('cert_path')) {
    config.set('cert_path','');
  }
  if (!config.has('daemon_port')) {
    config.set('daemon_port','9109');
  }
  if (!config.has('daemon_port_testnet')) {
    config.set('daemon_port_testnet','19109');
  }
  if (!config.has('daemon_cert_path')) {
    config.set('daemon_cert_path','');
  }
  if (!config.has('rpc_user')) {
    config.set('rpc_user','USER');
  }
  if (!config.has('rpc_pass')) {
    config.set('rpc_pass','PASSWORD');
  }
  if (!config.has('enableticketbuyer')) {
    config.set('enableticketbuyer','0');
  }
  if (!config.has('balancetomaintain')) {
    config.set('balancetomaintain','0');
  }
  if (!config.has('maxfee')) {
    config.set('maxfee','0.1');
  }
  if (!config.has('maxpricerelative')) {
    config.set('maxpricerelative','1.25');
  }
  if (!config.has('maxpriceabsolute')) {
    config.set('maxpriceabsolute','0');
  }
  if (!config.has('maxperblock')) {
    config.set('maxperblock','5');
  }
  if (!config.has('currency_display')) {
    config.set('currency_display','DCR');
  }
  if (!config.has('stakepools') || config.get('stakepools') == null) {
    stakePoolInfo(function(response, err) {
      if (response == null) {
        console.log(err);
      } else {
        var stakePoolNames = Object.keys(response.data);
        // Only add matching network stakepool info
        var foundStakePoolConfigs = Array();
        for (var i = 0; i < stakePoolNames.length; i++) {
          if (response.data[stakePoolNames[i]].APIEnabled) {
            foundStakePoolConfigs.push({
              Host:response.data[stakePoolNames[i]].URL,
              Network: response.data[stakePoolNames[i]].Network,
              APIVersionsSupported: response.data[stakePoolNames[i]].APIVersionsSupported,
            });
          }
        }
        config.set('stakepools', foundStakePoolConfigs);}
    });
  } else if (!update) {
    var currentStakePoolConfigs = config.get('stakepools');
    stakePoolInfo(function(response, err) {
      if (response == null) {
        console.log(err);
      } else {
        var stakePoolNames = Object.keys(response.data);
        // Only add matching network stakepool info
        var foundStakePoolConfigs = Array();
        for (var i = 0; i < stakePoolNames.length; i++) {
          var found = false;
          for (var k = 0; k < currentStakePoolConfigs.length; k++) {
            if (response.data[stakePoolNames[i]].URL == currentStakePoolConfigs[k].Host) {
              found = true;
              if (response.data[stakePoolNames[i]].APIEnabled) {
                currentStakePoolConfigs[k].Host = response.data[stakePoolNames[i]].URL;
                currentStakePoolConfigs[k].APIVersionsSupported = response.data[stakePoolNames[i]].APIVersionsSupported,
                currentStakePoolConfigs[k].Network = response.data[stakePoolNames[i]].Network,
                foundStakePoolConfigs.push(currentStakePoolConfigs[k]);
              }
              break;
            }
          }
          if (!found) {
            if (response.data[stakePoolNames[i]].APIEnabled) {
              foundStakePoolConfigs.push({
                Host:response.data[stakePoolNames[i]].URL,
                Network: response.data[stakePoolNames[i]].Network,
                APIVersionsSupported: response.data[stakePoolNames[i]].APIVersionsSupported,
              });
            }
          }
        }
      }
      config.set('stakepools', foundStakePoolConfigs);
    });
  }
  return(config);
}

export function getCfgPath() {
  const Config = require('electron-config');
  const config = new Config();
  return config.path;
}

// In all the functions below the Windows path is constructed based on
// os.homedir() rather than using process.env.LOCALAPPDATA because in my tests
// that was available when using the standalone node but not there when using
// electron in production mode.
export function appDataDirectory() {
  if (os.platform() == 'win32') {
    return path.join(os.homedir(), 'AppData', 'Local', 'Decrediton');
  } else if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library','Application Support','decrediton');
  } else {
    return path.join(os.homedir(),'.config','decrediton');
  }
}

export function getCert() {
  var cert = '';
  var cfg = getCfg();
  if (cfg.get('cert_path') != '') {
    return(cfg.get('cert_path'));
  }
  var certPath = '';
  if (os.platform() == 'win32') {
    certPath = path.join(os.homedir(), 'AppData', 'Local', 'Decrediton', 'rpc.cert');
  } else if (os.platform() == 'darwin') {
    certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'decrediton', 'rpc.cert');
  } else {
    certPath = path.join(process.env.HOME, '.config', 'decrediton', 'rpc.cert');
  }

  try {
    cert = fs.readFileSync(certPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(certPath + ' does not exist');
    } else if (err.code === 'EACCES') {
      console.log(certPath + ' permission denied');
    } else {
      console.error(certPath + ' ' + err);
    }
  }

  return(cert);
}

export function getDcrdCert() {
  var cfg = getCfg();
  if (cfg.get('daemon_cert_path') != '') {
    return(cfg.get('daemon_cert_path'));
  }
  var certPath = '';
  if (os.platform() == 'win32') {
    certPath = path.join(os.homedir(), 'AppData', 'Local', 'Dcrd', 'rpc.cert');
  } else if (os.platform() == 'darwin') {
    certPath = path.join(process.env.HOME, 'Library', 'Application Support',
            'Dcrd', 'rpc.cert');
  } else {
    certPath = path.join(process.env.HOME, '.dcrd', 'rpc.cert');
  }

  var cert = fs.readFileSync(certPath);
  return(cert);
}

export function GRPCWalletPort() {
  var cfg = getCfg();
  if (cfg.get('network') == 'mainnet') {
    return cfg.get('wallet_port');
  }
  return cfg.get('wallet_port_testnet');
}

export function RPCDaemonPort() {
  var cfg = getCfg();
  if (cfg.get('network') == 'mainnet') {
    return cfg.get('daemon_port');
  }
  return cfg.get('daemon_port_testnet');
}

export function dcrdCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, 'dcrd.conf');
}

export function dcrwCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, 'dcrwallet.conf');
}

export function dcrctlCfg() {
  var cfgLoc = appDataDirectory();
  return path.join(cfgLoc, 'dcrctl.conf');
}

export function writeCfgs() {
  var cfg = getCfg();
  var net = 0;
  var autobuy = 0;
  if (cfg.get('network') === 'testnet') {
    net = 1;
  }
  if (cfg.get('enableticketbuyer') === '1') {
    autobuy = 1;
  }
  var dcrdConf = {
    'Application Options':
    {
      testnet: net,
      rpcuser: cfg.get('rpc_user'),
      rpcpass: cfg.get('rpc_pass'),
      rpclisten: '127.0.0.1:' + RPCDaemonPort(),
    }
  };
  fs.writeFileSync(dcrdCfg(), ini.stringify(dcrdConf));

  var dcrwConf = {
    'Application Options':
    {
      testnet: net,
      username: cfg.get('rpc_user'),
      password: cfg.get('rpc_pass'),
      appdata: appDataDirectory(),
      experimentalrpclisten: '127.0.0.1:' + GRPCWalletPort(),
      tlscurve: 'P-256',
      noinitialload: '1',
      onetimetlskey: '1',
      enableticketbuyer: autobuy,
    },
    'Ticket Buyer Options':
    {
      'ticketbuyer.balancetomaintainabsolute': cfg.get('balancetomaintain'),
      'ticketbuyer.maxfee': cfg.get('maxfee'),
      'ticketbuyer.maxpricerelative': cfg.get('maxpricerelative'),
      'ticketbuyer.maxpriceabsolute': cfg.get('maxpriceabsolute'),
      'ticketbuyer.maxperblock': cfg.get('maxperblock'),
    }
  };
  fs.writeFileSync(dcrwCfg(), ini.stringify(dcrwConf));

  var dcrctlConf = {
    'Application Options':
    {
      testnet: net,
      rpcuser: cfg.get('rpc_user'),
      rpcpass: cfg.get('rpc_pass'),
      rpcserver: '127.0.0.1:' + RPCDaemonPort(),
    }
  };
  fs.writeFileSync(dcrctlCfg(), ini.stringify(dcrctlConf));
}
