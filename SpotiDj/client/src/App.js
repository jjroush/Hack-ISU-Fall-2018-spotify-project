import SpotifyWebApi from 'spotify-web-api-js';
import React, { Component } from 'react';
import './App.css';
import * as Vibrant from 'node-vibrant';
import Autosuggest from 'react-autosuggest';


const spotifyApi = new SpotifyWebApi();

// setInterval(() => getNowPlaying(), 8000);

// function getNowPlaying(){
//   spotifyApi.getMyCurrentPlaybackState()
//     .then((response) => {
//       setState({
//         nowPlaying: { 
//             name: response.item.name, 
//             albumArt: response.item.album.images[0].url
//           }
//       });
//       Vibrant.from(response.item.album.images[0].url).getPalette().then((palette) => console.log(palette))
//     })    
// };

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.refresh;
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      background: []
    }
  }

  componentDidMount() {
    const intervalId = setInterval(this.getNowPlaying, 8000);
   // store intervalId in the state so it can be accessed later:
   this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  // getNowPlaying = () => {
  //   spotifyApi.getMyCurrentPlaybackState()
  //     .then((response) => {
  //       this.setState({
  //         nowPlaying: { 
  //             name: response.item.name, 
  //             albumArt: response.item.album.images[0].url
  //           }
  //       });
  //       Vibrant.from(response.item.album.images[0].url).getPalette().then((palette) => console.log(palette))
  //     })    
  // }


  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
        Vibrant.from(response.item.album.images[0].url).getPalette().then((palette) => 
        this.setState({
          background: palette.Vibrant._rgb
        }))
      })    
  }

  searchSongs(input) {
    spotifyApi.searchTracks(input = 'coldplay')
      .then((data) => {
        console.log(`Search by ${input}`, data);
      }, (err) => {
        console.error(err);
      });
  }

  

  render() {
    document.body.style = `background: rgb(${this.state.background[0]}, ${this.state.background[1]}, ${this.state.background[2]});`;
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 500 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.searchSongs()}>
            Check Now Playing
          </button>
        }
        {/* <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      /> */}
      </div>
    );
  }
}

export default App;
