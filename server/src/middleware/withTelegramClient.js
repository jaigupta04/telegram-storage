const { db } = require('../config/firebase');
const { createClient } = require('../config/telegram');
const { decrypt } = require('../utils/crypto');

const connectedClients = {};

async function withTelegramClient(req, res, next) {
  try {
    const { userId } = req.params;

    if (connectedClients[userId] && connectedClients[userId].connected) {
      req.telegramClient = connectedClients[userId];
      return next();
    }

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    const { sessionString } = userDoc.data();
    if (!sessionString) {
      return res.status(401).send({ error: 'User session not found.' });
    }

    const decryptedSession = decrypt(sessionString);
    const client = createClient(decryptedSession);
    
    await client.connect();
    
    connectedClients[userId] = client;
    req.telegramClient = client;
    next();

  } catch (error) {
    console.error('Middleware Error:', error);
    if (error.message.includes('DECRYPTION_ERROR')) {
        return res.status(500).send({ error: 'Failed to decrypt session. The encryption key may have changed.' });
    }
    res.status(500).send({ error: 'Failed to initialize Telegram client.' });
  }
}

module.exports = { withTelegramClient };
