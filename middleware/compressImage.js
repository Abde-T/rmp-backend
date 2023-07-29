import multer from 'multer';
import sharp from 'sharp';
import NodeCache from 'node-cache';

const cache = new NodeCache();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 30 * 1024 * 1024, fieldSize: 1024 } });

const compressImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const { buffer } = req.file;

    // Generate a cache key using the hash of the image buffer
    const cacheKey = require('crypto').createHash('md5').update(buffer).digest('hex');

    // Check if the compressed image is already cached
    const compressedImageFromCache = cache.get(cacheKey);
    if (compressedImageFromCache) {
      req.file.buffer = compressedImageFromCache;
      return next();
    }

    // Compress the image and cache the result
    const compressedImage = await sharp(buffer)
      .resize(500)
      .jpeg({ quality: 80 }) // Change the format and quality as needed
      .toBuffer();

    cache.set(cacheKey, compressedImage);

    req.file.buffer = compressedImage;
    next();
  } catch (error) {
    console.error('Error compressing image:', error);
    next();
  }
};

export { upload, compressImage };