const { db } = require('../config/firebase');
const { createClient } = require('../config/telegram');
const { decrypt } = require('../utils/crypto');
const fs = require('fs');
const path = require('path');

const getFolders = async (req, res) => {
  const userDoc = await db.collection('users').doc(req.params.userId).get();
  const { folders } = userDoc.data();
  const filteredFolders = folders.filter(folder => folder !== 'root');
  res.send(filteredFolders);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const getIconForFile = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'Image';
  if (['pdf'].includes(extension)) return 'FileText';
  if (['mp4', 'mov', 'avi'].includes(extension)) return 'Video';
  if (['pptx', 'ppt'].includes(extension)) return 'Presentation';
  return 'File'; // Default icon
};

const getFiles = async (req, res) => {
  // Decode the folder parameter to handle paths with slashes
  const folder = decodeURIComponent(req.params.folder);
  
  const filesSnap = await db
    .collection('users')
    .doc(req.params.userId)
    .collection('files')
    .where('folder', '==', folder)
    .get();
  const files = filesSnap.docs.map(doc => {
    const data = doc.data();
    return { 
      id: doc.id, 
      ...data,
      size: formatFileSize(data.size),
      lastModified: new Date(data.uploadedAt).toISOString().split('T')[0],
      icon: getIconForFile(data.name)
    }
  });
  res.send(files);
};

const uploadFileMeta = async (req, res) => {
  const { userId, msgId, name, size, folder, extension, type } = req.body;
  const fileRef = db.collection('users').doc(userId).collection('files').doc(msgId.toString());
  await fileRef.set({ name, size, folder, extension, type, uploadedAt: new Date().toISOString(), downloadCount: 0 });

  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const folders = userDoc.data().folders || [];
  if (!folders.includes(folder)) {
    await userRef.update({ folders: [...folders, folder] });
  }
  res.send({ success: true });
};

const downloadFile = async (req, res) => {
  const { msgId } = req.params;
  const client = req.telegramClient;

  try {
    const messages = await client.getMessages("me", { ids: [parseInt(msgId)] });
    if (!messages || messages.length === 0 || !messages[0].media) {
      return res.status(404).send({ error: 'File not found in Telegram.' });
    }

    const fileDoc = await db.collection('users').doc(req.params.userId).collection('files').doc(msgId).get();
    const fileName = fileDoc.data().name;
    const fileType = fileDoc.data().type;

    const buffer = await client.downloadMedia(messages[0].media);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', fileType);
    res.send(buffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).send({ error: 'Failed to download file.' });
  }
};

const viewFile = async (req, res) => {
  const { msgId } = req.params;
  const client = req.telegramClient;

  try {
    const messages = await client.getMessages("me", { ids: [parseInt(msgId)] });
    if (!messages || messages.length === 0 || !messages[0].media) {
      return res.status(404).send({ error: 'File not found in Telegram.' });
    }

    const fileDoc = await db.collection('users').doc(req.params.userId).collection('files').doc(msgId).get();
    const fileName = fileDoc.data().name;
    const fileType = fileDoc.data().type;

    const buffer = await client.downloadMedia(messages[0].media);

    // Set Content-Disposition to inline so browser tries to display it
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Type', fileType);
    res.send(buffer);

  } catch (error) {
    console.error('View error:', error);
    res.status(500).send({ error: 'Failed to view file.' });
  }
};

const uploadFile = async (req, res) => {
  const { userId, folder } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ error: 'No file uploaded.' });
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    const { sessionString } = userDoc.data();
    const decryptedSession = decrypt(sessionString);
    const client = createClient(decryptedSession);
    await client.connect();

    const result = await client.sendFile('me', {
      file: file.buffer,
      caption: file.originalname,
      workers: 1,
    });

    const message = result;
    const fileId = message.id.toString();
    const fileName = file.originalname;
    const fileSize = file.size;
    const fileType = file.mimetype;
    const extension = fileName.split('.').pop();

    const fileRef = db.collection('users').doc(userId).collection('files').doc(fileId);
    await fileRef.set({
      name: fileName,
      size: fileSize,
      folder: folder,
      extension: extension,
      type: fileType,
      uploadedAt: new Date().toISOString(),
      downloadCount: 0,
    });

    res.send({ success: true, fileId: fileId });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).send({ error: 'Failed to upload file to Telegram.' });
  }
};

const createFolder = async (req, res) => {
  const { userId, folderName } = req.body;
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  const folders = userDoc.data().folders || [];
  if (!folders.includes(folderName)) {
    await userRef.update({ folders: [...folders, folderName] });
  }
  res.send({ success: true });
};

const renameItem = async (req, res) => {
  const { userId } = req.params;
  const { itemId, newName, itemType } = req.body;
  const client = req.telegramClient;

  try {
    if (itemType !== 'folder') { // It's a file
      await client.editMessage('me', { message: parseInt(itemId), text: newName });
      const fileRef = db.collection('users').doc(userId).collection('files').doc(itemId);
      await fileRef.update({ name: newName });
    } else { // It's a folder
      const userRef = db.collection('users').doc(userId);
      const filesRef = userRef.collection('files');
      const batch = db.batch();

      const userDoc = await userRef.get();
      const folders = userDoc.data().folders.map(f => (f === itemId ? newName : f));
      batch.update(userRef, { folders });

      const filesToUpdateSnap = await filesRef.where('folder', '==', itemId).get();
      filesToUpdateSnap.forEach(doc => {
        const docRef = filesRef.doc(doc.id);
        batch.update(docRef, { folder: newName });
      });

      await batch.commit();
    }
    res.send({ success: true });
  } catch (error) {
    console.error('Rename error:', error);
    res.status(500).send({ error: 'Failed to rename item.' });
  }
};

const deleteItem = async (req, res) => {
  const { userId } = req.params;
  const { itemId, itemType } = req.body;
  const client = req.telegramClient;

  try {
    if (itemType !== 'folder') { // It's a file
      await client.deleteMessages('me', [parseInt(itemId)], { revoke: true });
      const fileRef = db.collection('users').doc(userId).collection('files').doc(itemId);
      await fileRef.delete();
    } else { // This is a folder
      const userRef = db.collection('users').doc(userId);
      const filesRef = userRef.collection('files');
      const batch = db.batch();

      const userDoc = await userRef.get();
      const folders = userDoc.data().folders.filter(f => f !== itemId);
      batch.update(userRef, { folders });

      const filesToDeleteSnap = await filesRef.where('folder', '==', itemId).get();
      const messageIdsToDelete = filesToDeleteSnap.docs.map(doc => parseInt(doc.id));
      
      if (messageIdsToDelete.length > 0) {
        await client.deleteMessages('me', messageIdsToDelete, { revoke: true });
      }

      filesToDeleteSnap.forEach(doc => {
        batch.delete(filesRef.doc(doc.id));
      });

      await batch.commit();
    }
    res.send({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).send({ error: 'Failed to delete item.' });
  }
};

module.exports = { getFolders, getFiles, uploadFileMeta, downloadFile, viewFile, createFolder, renameItem, deleteItem, uploadFile };
