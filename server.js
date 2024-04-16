const http = require('http');
const https = require('https');
const { parse } = require('node-html-parser');

const server = http.createServer((req, res) => {
  if (req.url === '/getTimeStories') {
    res.writeHead( 200, { 'Content-Type': 'application/json' });
    https.get('https://time.com', (response) => {
      let data = "";
      response.on('data', (dataChunk) => {
        data += dataChunk;
      });
      response.on('end', () => {
        const root = parse(data);
         const latestStories = [];
        const latestStoriesDiv =root.querySelector('.latest-stories');
     const storyList = latestStoriesDiv.querySelector('ul');
        const storyItems =  storyList.querySelectorAll('li');
         storyItems.slice(0, 6).forEach(story=> {
           const titleElement = story.querySelector('a');
          const title = titleElement.text.trim();
         const link = titleElement.getAttribute('href');
          latestStories.push({ title, link });
        });

        res.end(JSON.stringify(latestStories));

      });
    }).on('error', (err) => {
     console.error('Error make request', err.message);
       res.writeHead(500, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify({ error: 'Error data not fetched' }));
    });

  } else {
     res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Error in fetching' }));
  }
});

 const PORT = 5432;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
