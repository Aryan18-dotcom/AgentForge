import multer from 'multer';

// Use memory storage to handle the file as a buffer
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // Limit 20MB
});

export default upload;