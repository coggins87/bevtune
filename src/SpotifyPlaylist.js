import React from "react";
import API from "./api-helper";
import Config from "./config";

export default class SpotifyPlaylist extends React.Component {
  state = {
    searchResults: null,
    hasAccessToken: false,
    accessToken: this.props.token
  };


  render() {
    if (this.props.token && this.props.search) {
      return fetch(
        `https://api.spotify.com/v1/search?q=${this.props.search}&type=track`,
        { headers: { Authorization: `Bearer ${this.props.token}` } }
      ).then(response => {
        return response.json()})
        .then(data => {
          console.log(data.tracks.items)
        })

    }
    return (
      <div>
        <h2>Your Playlist Will Display here</h2>
       
      </div>
    );
  }
}
