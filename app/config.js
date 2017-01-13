export function getCfg() {
  const Config = require('electron-config');
  const config = new Config();
  // If value is missing (or no config file) write the defaults.
  if (!config.has('network')) {
    config.set('network', 'testnet');
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

  var cfg = {
    'network' :config.get('network'),
    'wallet_port': config.get('wallet_port'),
    'wallet_port_testnet': config.get('wallet_port_testnet'),
    'cert_path': config.get('cert_path'),
    'daemon_port': config.get('daemon_port'),
    'daemon_port_testnet': config.get('daemon_port_testnet'),
    'daemon_cert_path': config.get('daemon_cert_path'),
    'rpc_user': config.get('rpc_user'),
    'rpc_pass': config.get('rpc_pass')
  };
  return(cfg);
}

export function getCfgPath() {
  const Config = require('electron-config');
  const config = new Config();
  return config.path;
}
