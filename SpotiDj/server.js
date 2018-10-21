const express = require('express');
const bodyParser = require('body-parser')
const got = require('got');
const app = express();
const port = process.env.PORT || 5000;
let skipCount = 0;

app.use(bodyParser.json({
  limit: '100mb',
  type: 'application/json'
}));


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.post('/vote', async (req, res) => {
  skipCount++
  console.log('skipCount', skipCount);
  if(skipCount > 2) {
    const post = await got.post('https://api.spotify.com/v1/me/player/next', { 
      headers: {
        Authorization: `Bearer ${req.body.token}`
    }});
    console.log(post.body);
  }
});
