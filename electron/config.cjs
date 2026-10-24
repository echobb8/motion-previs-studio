'use strict';

const os = require('node:os');
const path = require('node:path');

function pathApi(platform) {
  return platform === 'win32' ? path.win32 : path.posix;
}

function motionConfigDir(options = {}) {
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  const home = options.home || os.homedir();
  const override = env.MOTION_PREVIS_CONFIG_DIR || env.MPS_CONFIG_DIR;
  if (override) return pathApi(platform).resolve(override);
  if (platform === 'win32') {
    const appData = env.APPDATA || path.win32.join(home, 'AppData', 'Roaming');
    return path.win32.join(appData, 'Motion Previs Studio Kids 3D', 'v4');
  }
  return path.posix.join(home, '.config', 'motion-previs-kids-3d');
}

function motionDiscoveryFile(options = {}) {
  const platform = options.platform || process.platform;
  return pathApi(platform).join(motionConfigDir(options), 'control.json');
}

function blockoutControlFiles(options = {}) {
  const platform = options.platform || process.platform;
  const env = options.env || process.env;
  const home = options.home || os.homedir();
  const p = pathApi(platform);
  const candidates = [];
  if (env.BLOCKOUT_CONFIG_DIR) candidates.push(p.join(p.resolve(env.BLOCKOUT_CONFIG_DIR), 'control.json'));
  if (platform === 'win32') {
    const appData = env.APPDATA || path.win32.join(home, 'AppData', 'Roaming');
    for (const folder of options.distribution?.blockoutConfigFolders || []) {
      candidates.push(path.win32.join(appData, folder, 'control.json'));
    }
    candidates.push(
      path.win32.join(appData, 'blockout-kids-3d', 'control.json'),
      path.win32.join(appData, 'blockout-kids-3d', 'control.json')
    );
  }
  candidates.push(path.posix.join(home, '.config', 'blockout-kids-3d', 'control.json'));
  return [...new Set(candidates)];
}

module.exports = { motionConfigDir, motionDiscoveryFile, blockoutControlFiles };
