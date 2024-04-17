const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  if(req.url=== '/getTimeStories') {
     res.writeHead(200, { 'Content-Type': 'application/json' });
    https.get('https://time.com', (response) => {
      let data = '';
      response.on('data', (dataChunk) => {
        data += dataChunk;
      });
       response.on('end', () => {
        const latestStories = [];
         const regex = /<a\s+href="([^"]*)">\s*<h3[^>]*>(.*?)<\/h3>\s*<\/a>/g;
        let match;
       let count = 0;
   while ((match = regex.exec(data)) !== null && count < 6) {
          const link = match[1];
           const title = match[2].trim();
            latestStories.push({ title, link });
           count++;
        }
        res.end(JSON.stringify(latestStories));
      });
    }).on('error', (err) => {
      console.log('Error making request', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'error data not fetching' }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'error data not fetched' }));
  }
});
const PORT = 5432;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
