import SpotifyWebApi from 'spotify-web-api-js';
import React, { Component } from 'react';
import './App.css';
import * as Vibrant from 'node-vibrant';
import Autosuggest from 'react-autosuggest';


const spotifyApi = new SpotifyWebApi();

const getSuggestions = value => {
  return value
};

const onChange = (event, { newValue }) => {
  this.setState({
    value: newValue
  });
};

// const onSuggestionsFetchRequested = ({ value }) => {
//   this.setState({
//     suggestions: gewt(value)
//   });
// };

const onSuggestionsClearRequested = () => {
  this.setState({
    suggestions: []
  });
};

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
      suggestions: {title: '', uri: ''},
      background: [],
      search: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({search: event.target.value});
  }

  async handleSubmit (event) {
    event.preventDefault();
    this.searchSongs(this.state.search)
    this.sleep().then(() => {this.addSongToPlaylist()});
  }

  

  componentDidMount() {
    const intervalId = setInterval(this.getNowPlaying, 5000);
   // store intervalId in the state so it can be accessed later:
   this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }


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
  searchSongs = (input) => {
    spotifyApi.searchTracks(input)
      .then((data) => {
        this.setState({
          suggestions: {
            array: data.tracks.items[0].uri
          }
        });
        console.log(`Search by ${input}`, data.tracks.items);
      }, (err) => {
        console.error(err);
      });
  }

  addSongToPlaylist = () => {
    
    spotifyApi.addTracksToPlaylist('xs1iffq84e1qt8q547evm59xd', '3AjZgHa272XhpUYVWphUXP', [this.state.suggestions.array]) 
    .then(console.log('done'));
  }


  sleep = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 3000)
    })
}



  

  

  render() {
    
    document.body.style = this.state.background ? `background: rgb(${this.state.background[0]}, ${this.state.background[1]}, ${this.state.background[2]});`: 'background:white';

    return (
      <div className="App">
        <a href={`http://${window.location.hostname}:8888`} > Login to Spotify </a>
        <h1>
          Now Playing: { this.state.nowPlaying.name }
        </h1>
        <div>
          <img className="album" src={this.state.nowPlaying.albumArt} style={{ height: 500 }}/>
        </div>
        { this.state.loggedIn &&
        <form onSubmit={this.handleSubmit}>
          <label>
            <input className="" type="text" value={this.state.search} onChange={this.handleChange} />
          </label>
        <input type="submit" value="I'm feeling lucky"/>
        </form>   
        }
        <button>
          Skip
        </button>
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
