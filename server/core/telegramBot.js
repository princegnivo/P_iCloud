import axios from 'axios';
const sendToTelegram = (data) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: chatId,
    text: `⚠️ Nouvelle tentative:\n${JSON.stringify(data, null, 2)}`
  });
};
