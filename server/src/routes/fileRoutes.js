const express = require('express');
const { getFolders, getFiles, uploadFileMeta, downloadFile, viewFile, createFolder, renameItem, deleteItem, uploadFile } = require('../controllers/fileController');
const { withTelegramClient } = require('../middleware/withTelegramClient');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/folders/:userId', withTelegramClient, getFolders);
router.get('/files/:userId/:folder', withTelegramClient, getFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:userId/:msgId', withTelegramClient, downloadFile);
router.get('/view/:userId/:msgId', withTelegramClient, viewFile);
router.post('/folder', createFolder);
router.put('/item/:userId', withTelegramClient, renameItem);
router.delete('/item/:userId', withTelegramClient, deleteItem);

module.exports = router;
