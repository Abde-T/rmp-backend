import NodeCache from 'node-cache';

const cache = new NodeCache();

const cacheMiddleware = (duration) => (req, res, next) => {
  if (req.method !== 'GET') {
    console.error('Cannot cache non-GET methods.');
    return next();
  }

  const key = generateCacheKey(req);
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);

  res.originalSend = res.send;
  res.send = (body) => {
    res.originalSend(body);
    cache.set(key, body, duration);
  };

  next();
};

const generateCacheKey = (req) => {
  // Customize the cache key generation based on your requirements.
  // For example, you can include specific parts of the request URL, headers, or query parameters.

  const baseUrl = req.baseUrl; // The base URL of the request (excluding the host and port)
  const path = req.path; // The path of the request URL
  
  // Combine the parts you want in the cache key
  const cacheKey = `${baseUrl}${path}`;

  return cacheKey;
};

export default cacheMiddleware;