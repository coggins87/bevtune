import React from "react";
import API from "./api-helper";
import Config from "./config";

export default class SpotifyPlaylist extends React.Component {
  state = {
    searchResults: null,
    hasAccessToken: false,
    songList: null
  };

  componentDidMount() {
    if (this.props.token && this.props.search) {
      return fetch(
        `https://api.spotify.com/v1/search?q=${this.props.search}&type=track`,
        { headers: { Authorization: `Bearer ${this.props.token}` } }
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          let songList = data.tracks.items.map(songs => {
            console.log(songs);
            return (
              <li key={songs.uri}>
                {songs.name}, {songs.album.name}
              </li>
            );
          });
          this.setState({
            songList
          });
          return Promise.resolve();
        });
    }
  }

  clearResults = () => {
    this.setState({
      songList: null
    });
  };

  generatePlaylist = () => {
    return fetch("https://api.spotify.com/v1/users/chiggins5/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
        Authorization: `Bearer ${this.props.token}`
      },
      body: JSON.stringify({
        name: `${this.props.search}`,
        description: `Bevtune playlist for drinking ${this.props.search}`,
        public: true
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => this.populatePlaylist(data.id));
  };

  populatePlaylist = playlistID => {
    let songURIs = this.state.songList.map(uri => {
      return `${uri.key}`;
    });
    console.log(songURIs);
    return fetch(`https://api.spotify.com/vi/playlists/${playlistID}/tracks`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
        Authorization: `Bearer ${this.props.token}`
      },
      body: { uris: JSON.stringify(songURIs) }
    })
      .then(res => res.json())
      .then(data => console.log(data));
  };
  render() {
    return (
      <div>
        <h2>Here are your songs! Would you like to generate a playlist?</h2>
        {this.state.songList && <ul>{this.state.songList}</ul>}
        <button onClick={this.generatePlaylist}>Yes</button>
        <button onClick={this.clearResults}>No, clear these songs</button>
      </div>
    );
  }
}
