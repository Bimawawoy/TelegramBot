const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const { getInstagramInfo } = require('./instagram');
const { logMessage, notifyOwner } = require('./utils');
const { sendSpam } = require('./spam');

async function startBot(token, igUsername, igPassword) {
  const bot = new TelegramBot(token, { polling: true });

  // Cek token
  bot.getMe().catch(error => {
    console.error('Token tidak valid atau terjadi kesalahan jaringan:', error.message);
    process.exit(1);
  });

  // Mengirim pesan notifikasi ke pemilik bot
  notifyOwner(bot);

  // Handler untuk pesan yang masuk
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || 'Tanpa Username';
    const message = msg.text;

    // Log pesan
    logMessage(chatId, username, message);


  if (message === '/start') {
    bot.sendPhoto(chatId, './welcome.jpeg', { caption: `Hallo, ${username}! Selamat datang di Bimz Telebot` });
  } else if (message.startsWith('/igstalk ')) {
    const usernameToSearch = message.split(' ')[1];
    if (usernameToSearch) {
      bot.sendMessage(chatId, 'Tunggu bentar bro...');
      const result = await getInstagramInfo(usernameToSearch, igUsername, igPassword);
      bot.sendMessage(chatId, 'Done');
      if (result.picPath) {
        bot.sendPhoto(chatId, result.picPath, { caption: result.data });
      } else {
        bot.sendMessage(chatId, result.data);
      }
    } else {
      bot.sendMessage(chatId, 'Penggunaan: /igstalk <username>');
    }
  } else if (message === '/menu') {
    bot.sendMessage(chatId, '/spam - Ayoo preng temanmu dengan spam OTP yang mantabb ini\n/igstalk - useless.');
  } else if (message.startsWith('/spam ')) {
    const phoneNumber = message.split(' ')[1];
    if (phoneNumber) {
      bot.sendMessage(chatId, `Mulai spam ke nomor ${phoneNumber}...`);
      sendSpam(phoneNumber)
        .then(() => {
          bot.sendMessage(chatId, 'Done');
        })
        .catch(error => {
          bot.sendMessage(chatId, `Terjadi kesalahan saat spam: ${error.message}`);
        });
    } else {
      bot.sendMessage(chatId, 'Penggunaan: /spam <nomor_telepon>');
    }
  } else {
  }
});


  console.log('Bot successfully running...');
}

module.exports = { startBot };
