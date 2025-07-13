export default async function handler(req, res) {
  console.log('Test endpoint called');
  
  res.status(200).json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 