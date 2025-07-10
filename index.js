const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Your bot token
const TELEGRAM_BOT_TOKEN = '8170764261:AAEaN4BNhNy7VADhbGXyT3lkEdNhfcJ2uCk';
// Your Telegram user/chat ID (or group ID)
const TELEGRAM_CHAT_ID = '6190190972'; // Replace with your Telegram user ID

app.post('/send', async (req, res) => {
  const { message } = req.body;

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
    res.status(200).send({ success: true });
  } catch (err) {
    console.error('Error sending to Telegram:', err);
    res.status(500).send({ error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
