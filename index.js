const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');



const token = '7214138008:AAFoTXgfsEQL5AUmxlEbLQZLRP4BwuxEZMY';

const bot = new TelegramBot(token, { polling: true });

let intervals = {};



bot.onText(/\/start/,async (msg) => {
    const chatId = msg.chat.id;
    if (!intervals[chatId]) {
      intervals[chatId] = setInterval(async () => {
        try {
            const response = await axios.get('http://34.93.102.172:8000/bybitdata');
            const res_data = response.data.result.list[0].volume24h
            bot.sendMessage(chatId, 
                `[24 Hr Volume]
               
                 Bybit: ${res_data}`);
          } catch (error) {
            bot.sendMessage(chatId, 'Sorry, I could not fetch the data at the moment.');
            console.error(error);
          }
        
      }, 2000);
      bot.sendMessage(chatId, 'Started greeting every 2 seconds.');
    } else {
      bot.sendMessage(chatId, 'Already greeting every 2 seconds.');
    }
  });

console.log('Bot is running...');