const readline = require('readline');
const { startBot } = require('./lib/bot');
const { readConfig, saveConfig } = require('./lib/utils');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Membaca konfigurasi
const config = readConfig();
let { token, igUsername, igPassword } = config;

// Fungsi untuk meminta input pengguna
function promptInput(query) {
  return new Promise((resolve) => {
    rl.question(query, (input) => resolve(input));
  });
}

// Fungsi utama untuk menjalankan bot
async function run() {
  if (!token) {
    console.error('Token tidak ditemukan dalam konfigurasi.');
    token = await promptInput('Masukkan token Telegram bot: ');
  }

  if (!igUsername || !igPassword) {
    console.error('Username atau password Instagram tidak ditemukan dalam konfigurasi.');
    igUsername = await promptInput('Masukkan username Instagram: ');
    igPassword = await promptInput('Masukkan password Instagram: ');
  }

  // Simpan kembali konfigurasi yang sudah diperbarui
  saveConfig({ token, igUsername, igPassword });

  // Menutup input
  rl.close();

  // Memulai bot
  startBot(token, igUsername, igPassword);
}

run().catch(error => {
  console.error('Gagal menjalankan bot:', error.message);
  process.exit(1);
});
