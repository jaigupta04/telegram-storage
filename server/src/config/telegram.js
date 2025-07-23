const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

const apiId = parseInt(process.env.API_ID);
const apiHash = process.env.API_HASH;

const createClient = (sessionString = '') => {
  const session = new StringSession(sessionString);
  return new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5,
  });
};

module.exports = { createClient, apiId, apiHash };
