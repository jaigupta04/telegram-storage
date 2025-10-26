const { db } = require('../config/firebase');
const { createClient, apiId, apiHash } = require('../config/telegram');
const { encrypt } = require('../utils/crypto');
const { Api } = require('telegram');

// Store QR login sessions in memory
const qrLoginSessions = new Map();

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
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //here
                path: '/', //here
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
  res.clearCookie('userId', { path: '/' });
  res.send({ success: true });
};

// QR Code Authentication Methods
const generateQRCode = async (req, res) => {
    try {
        const client = createClient();
        await client.connect();

        // Step 1: Export login token (following your example)
        const loginToken = await client.invoke(
            new Api.auth.ExportLoginToken({
                apiId: apiId,
                apiHash: apiHash,
                exceptIds: [],
            })
        );

        if (!(loginToken instanceof Api.auth.LoginToken)) {
            throw new Error("Failed to get login token");
        }

        // Step 2: Generate session ID and store the client
        const sessionId = Date.now().toString();
        qrLoginSessions.set(sessionId, {
            client: client,
            loginToken: loginToken,
            sessionString: client.session.save(),
            createdAt: new Date(),
        });

        // Clean up expired sessions after 5 minutes
        setTimeout(() => {
            const session = qrLoginSessions.get(sessionId);
            if (session && session.client) {
                session.client.destroy();
            }
            qrLoginSessions.delete(sessionId);
        }, 300000);

        // Step 3: Return QR data (base64url format like in your example)
        const tokenBase64 = loginToken.token.toString("base64url");
        
        res.send({
            success: true,
            sessionId: sessionId,
            token: tokenBase64,
            expires: loginToken.expires
        });

    } catch (err) {
        console.error('QR Code Generation Error:', err);
        res.status(500).send({ error: 'Failed to generate QR code: ' + (err.errorMessage || err.message) });
    }
};

const checkQRLogin = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId || !qrLoginSessions.has(sessionId)) {
            return res.status(400).send({ error: 'Invalid or expired session' });
        }

        const qrSession = qrLoginSessions.get(sessionId);
        const client = qrSession.client;

        // Check if QR authentication is already in progress
        if (!qrSession.authInProgress) {
            qrSession.authInProgress = true;
            
            // Start the QR authentication process
            qrSession.authPromise = client.signInUserWithQrCode(
                { apiId, apiHash },
                {
                    qrCode: async () => {
                        // QR already generated, this should not be called
                        console.log('QR code callback called unexpectedly');
                    },
                    password: async (hint) => {
                        // Store that 2FA is needed and return to waiting state
                        qrSession.needs2FA = true;
                        qrSession.passwordHint = hint;
                        // Return a promise that will be resolved when password is provided
                        return new Promise((resolve) => {
                            qrSession.passwordResolve = resolve;
                        });
                    },
                    onError: (err) => {
                        console.error("QR login error:", err);
                        throw err;
                    },
                }
            );
        }

        // Check if 2FA is needed
        if (qrSession.needs2FA && !qrSession.passwordProvided) {
            return res.send({ 
                success: false, 
                status: 'password_needed',
                sessionId: sessionId,
                hint: qrSession.passwordHint || ''
            });
        }

        // Check if authentication completed
        try {
            // Give the auth process a moment to complete
            const user = await Promise.race([
                qrSession.authPromise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 1000))
            ]);

            if (user && user.id) {
                // Authentication completed successfully
                const newSessionStr = client.session.save();
                const encryptedSessionStr = encrypt(newSessionStr);

                const userRef = db.collection('users').doc(user.id.toString());
                const userDoc = await userRef.get();

                if (userDoc.exists) {
                    await userRef.update({ sessionString: encryptedSessionStr });
                } else {
                    await userRef.set({
                        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                        username: user.username || '',
                        sessionString: encryptedSessionStr,
                        createdAt: new Date().toISOString(),
                        folders: ['root'],
                    });
                }

                // Clean up
                qrLoginSessions.delete(sessionId);

                res.cookie('userId', user.id.toString(), { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });

                return res.send({ 
                    success: true, 
                    status: 'approved',
                    userId: user.id,
                    user: {
                        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                        username: user.username || ''
                    }
                });
            }
        } catch (err) {
            if (err.message === 'TIMEOUT') {
                // Still waiting
                return res.send({ success: false, status: 'waiting' });
            }
            throw err;
        }

        // Still waiting for QR scan
        return res.send({ success: false, status: 'waiting' });

    } catch (err) {
        console.error('Check QR Login Error:', err);
        res.status(500).send({ error: 'Failed to check QR login status' });
    }
};

const completeQRLogin = async (req, res) => {
    try {
        const { sessionId, password } = req.body;
        
        if (!sessionId || !qrLoginSessions.has(sessionId)) {
            return res.status(400).send({ error: 'Invalid or expired session' });
        }

        const qrSession = qrLoginSessions.get(sessionId);

        if (!qrSession.needs2FA || !qrSession.passwordResolve) {
            return res.status(400).send({ error: 'No 2FA session in progress' });
        }

        try {
            // Provide the password to complete the authentication
            qrSession.passwordProvided = true;
            qrSession.passwordResolve(password);

            // Wait for the authentication to complete
            const user = await qrSession.authPromise;

            const newSessionStr = qrSession.client.session.save();
            const encryptedSessionStr = encrypt(newSessionStr);

            const userRef = db.collection('users').doc(user.id.toString());
            const userDoc = await userRef.get();

            if (userDoc.exists) {
                await userRef.update({ sessionString: encryptedSessionStr });
            } else {
                await userRef.set({
                    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    username: user.username || '',
                    sessionString: encryptedSessionStr,
                    createdAt: new Date().toISOString(),
                    folders: ['root'],
                });
            }

            // Clean up
            qrLoginSessions.delete(sessionId);

            res.cookie('userId', user.id.toString(), { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.send({ 
                success: true,
                userId: user.id,
                user: {
                    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    username: user.username || ''
                }
            });

        } catch (err) {
            console.error('QR 2FA completion failed:', err);
            if (err.errorMessage && err.errorMessage.includes('PASSWORD')) {
                return res.status(400).send({ error: 'Invalid 2FA password' });
            }
            return res.status(500).send({ error: 'Failed to complete QR login: ' + (err.errorMessage || err.message) });
        }

    } catch (err) {
        console.error('Complete QR Login Error:', err);
        res.status(500).send({ error: 'Failed to complete QR login' });
    }
};

module.exports = { 
    checkAuth, 
    sendCode, 
    verifyCode, 
    logout, 
    generateQRCode, 
    checkQRLogin, 
    completeQRLogin 
};
