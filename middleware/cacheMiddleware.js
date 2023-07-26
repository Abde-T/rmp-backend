import NodeCache from 'node-cache';

const cache = new NodeCache();

const cacheMiddleware = (duration) => (req, res, next) => {
  if (req.method !== 'GET') {
    console.error('Cannot cache non-GET methods.');
    return next();
  }

  const key = req.originalUrl;
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

export default cacheMiddleware;