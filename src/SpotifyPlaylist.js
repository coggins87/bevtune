import React from "react";
import API from "./api-helper";
import Config from "./config";

export default class SpotifyPlaylist extends React.Component {
  state = {
    searchResults: null,
    hasAccessToken: false,
    songList: null,
    playlistMade: false,
    playlist: null
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
      songList: null,
      playlist: null,
      playListMade: false
    });
  };
  checkIfPlaylistExists = name => {
    return fetch("https://api.spotify.com/v1/users/chiggins5/playlists", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.props.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        let output;
        data.items.forEach(item => {
          if (item.name === name) output = item;
        });
        return output;
      });
  };
  generatePlaylist = async () => {
    let playlist = await this.checkIfPlaylistExists(this.props.search);
    console.log(playlist);
    if (!playlist) {
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
        .then(data => {
          console.log(data);
          this.populatePlaylist(data.tracks.href, data.id);
        });
    } else if (playlist.tracks.total === 0) {
      //playlist exists but no songs
      this.populatePlaylist(playlist.tracks.href, playlist.id);
    } else {
      //playlist exists and has songs in it
      this.setState({
        songList: null,
        playlistMade: true,
        playlist: playlist.id
      });
    }
  };

  populatePlaylist = (playlistURI, playlistID) => {
    let songURIs = this.state.songList.map(uri => {
      return `${uri.key}`;
    });
    return fetch(playlistURI, {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
        Authorization: `Bearer ${this.props.token}`
      },
      body: JSON.stringify({ uris: songURIs })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          songList: null,
          playListMade: true,
          playlist: playlistID
        });
      });
  };
  render() {
    return (
      <div>
        {this.state.songList && (
          <div>
            {" "}
            <h2>Here are your songs! Would you like to generate a playlist?</h2>
            <button onClick={this.generatePlaylist}>Yes</button>
            <button onClick={this.clearResults}>No, clear these songs</button>
            <ul>{this.state.songList}</ul>
          </div>
        )}

        {this.state.playListMade && (
          <iframe
            title="bevtune playlist"
            src={`https://open.spotify.com/embed/playlist/${this.state.playlist}`}
            width="300"
            height="380"
            frameborder="0"
            allowtransparency="true"
            allow="encrypted-media"
          />
        )}
      </div>
    );
  }
}
