const { db } = require('../config/firebase');
const { createClient, apiId, apiHash } = require('../config/telegram');
const { encrypt } = require('../utils/crypto');
const { Api } = require('telegram');

const checkAuth = async (req, res) => {
    try {
        const { userId } = req.cookies;
        if (!userId) {
            return res.status(401).send({ error: 'Not authenticated' });
        }

        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.clearCookie('userId');
            return res.status(404).send({ error: 'User not found' });
        }

        res.send({ success: true, userId: userDoc.id, ...userDoc.data() });

    } catch (err) {
        console.error('Check Auth Error:', err);
        res.status(500).send({ error: 'An error occurred during authentication check' });
    }
};

const sendCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        const client = createClient();
        await client.connect();

        await client.invoke(
            new Api.auth.SendCode({
                phoneNumber,
                apiId,
                apiHash,
                settings: new Api.CodeSettings(),
            })
        );

        const loginAttemptRef = db.collection('loginAttempts').doc(phoneNumber);
        await loginAttemptRef.set({
            sessionString: client.session.save(),
            createdAt: new Date(),
        });

        res.send({ success: true });
    } catch (err) {
        console.error('Send Code Error:', err);
        res.status(500).send({ error: 'Failed to send code' });
    }
};

const verifyCode = async (req, res) => {
    const { phoneNumber, code, password } = req.body;
    const loginAttemptRef = db.collection('loginAttempts').doc(phoneNumber);

    try {
        const loginAttemptDoc = await loginAttemptRef.get();

        if (!loginAttemptDoc.exists) {
            return res.status(400).send({ error: 'Session not found or expired. Please send code again.' });
        }

        const { sessionString } = loginAttemptDoc.data();
        const client = createClient(sessionString);
        await client.connect();

        try {
            await client.start({
                phoneNumber: async () => phoneNumber,
                phoneCode: async () => code,
                password: async () => password,
                onError: (err) => {
                    if (err.errorMessage === 'PHONE_CODE_INVALID') {
                        throw new Error('PHONE_CODE_INVALID');
                    }
                    if (err.errorMessage === 'SESSION_PASSWORD_NEEDED') {
                        throw new Error('SESSION_PASSWORD_NEEDED');
                    }
                    throw err;
                },
            });

            const me = await client.getMe();
            const newSessionStr = client.session.save();
            const encryptedSessionStr = encrypt(newSessionStr);

            const userRef = db.collection('users').doc(me.id.toString());
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                await userRef.update({ sessionString: encryptedSessionStr });
            } else {
                await userRef.set({
                    fullName: `${me.firstName || ''} ${me.lastName || ''}`.trim(),
                    username: me.username || '',
                    sessionString: encryptedSessionStr,
                    createdAt: new Date().toISOString(),
                    folders: ['root'],
                });
            }

            await loginAttemptRef.delete();

            res.cookie('userId', me.id.toString(), { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.send({ success: true, userId: me.id });

        } catch (err) {
            if (err.message === 'PHONE_CODE_INVALID') {
                await loginAttemptRef.delete();
                return res.status(400).send({ error: 'PHONE_CODE_INVALID' });
            }
            if (err.message === 'SESSION_PASSWORD_NEEDED') {
                await loginAttemptRef.update({ sessionString: client.session.save() });
                return res.status(401).send({ error: 'SESSION_PASSWORD_NEEDED' });
            }
            console.error('Login failed:', err);
            await loginAttemptRef.delete();
            return res.status(500).send({ error: 'Login failed: ' + (err.errorMessage || 'Unknown error') });
        }
    } catch (err) {
        console.error('Verify Code Error:', err);
        if (loginAttemptRef) await loginAttemptRef.delete().catch(e => console.error("Failed to cleanup login attempt:", e));
        return res.status(500).send({ error: 'Unexpected server error' });
    }
};

const logout = (req, res) => {
  res.clearCookie('userId');
  res.send({ success: true });
};

module.exports = { checkAuth, sendCode, verifyCode, logout };
