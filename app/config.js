import fs from 'fs';
import path from 'path';
import os from 'os';
import { stakePoolInfo } from './middleware/stakepoolapi';

export function getCfg() {
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
  if (!config.has('currency_display')) {
    config.set('currency_display','DCR');
  }
  if (!config.has('stakepools') || config.get('stakepools') == null) {
    stakePoolInfo(function(response, err) {
      if (response == null) {
        console.log(err)
      } else {
        var stakePoolNames = Object.keys(response.data);
        // Only add matching network stakepool info
        var foundStakePoolConfigs = Array();
        for (var i = 0; i < stakePoolNames.length; i++) {
            foundStakePoolConfigs.push({
              Host:response.data[stakePoolNames[i]].URL,
              Network: response.data[stakePoolNames[i]].Network,
            });
        }
        config.set('stakepools', foundStakePoolConfigs)}
      }
    )
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
