const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  reßs.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

function getNowPlaying() {
  spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {
      this.setState({
        nowPlaying: { 
            name: response.item.name, 
            albumArt: response.item.album.images[0].url
          }
      });
      Vibrant.from(response.item.album.images[0].url).getPalette().then((palette) => console.log(palette))
    })    
};

setInterval(getNowPlaying(), 5000)