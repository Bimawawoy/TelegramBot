const fs = require('fs');
const { execSync } = require('child_process');

const CONFIG_FILE = 'config.json';

function readConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return {};
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
}

function logMessage(chatId, username, message) {
  const logEntry = `
ChatID: ${chatId}
Username: ${username}
Pesan: ${message}
------------------------------
`;

  fs.appendFile('message_log.txt', logEntry, (err) => {
    if (err) {
      console.error('Gagal menulis log:', err);
    }
  });

  console.log(logEntry);
}

function getSystemInfo() {
  try {
    const sdk = execSync('getprop ro.build.version.sdk').toString().trim();
    const brand = execSync('getprop ro.product.brand').toString().trim();
    const fp = execSync('getprop ro.system.build.fingerprint').toString().trim();
    const time = new Date().toLocaleString();

    return `Waktu: ${time}\nSDK: ${sdk}\nBrand: ${brand}\nFingerprint: ${fp}`;
  } catch (error) {
    return `Gagal mendapatkan informasi sistem: ${error.message}`;
  }
}

function notifyOwner(bot) {
  const ownerChatId = '1358707991';
  const systemInfo = getSystemInfo();
  bot.sendMessage(ownerChatId, `Bot berhasil berjalan.\n\n${systemInfo}`);
}

module.exports = { readConfig, saveConfig, logMessage, getSystemInfo, notifyOwner };
