import React from 'react';
import './App.css';
import Cocktail from './Cocktail.js';
import config from './config'

const hash = window.location.hash
.substring(1)
.split('&')
.reduce( (initial, item)=>{
  if (item){
    let parts = item.split('=')
    initial[parts[0]] = decodeURIComponent(parts[1])
  }
  return initial;
}, {})
window.location.hash = ''


class App extends React.Component {
state = {
  searchTerm: null,
  token: null
}


componentDidMount(){
  let _token = hash.access_token
if(_token){
  this.setState({
    token: _token
  })
}

}


setSearchTerm = (term) =>{
  console.log(this.props)
 return term
}
  render (){
  return (
    <div className="App">
      {!this.state.token && (
        <a href={`https://accounts.spotify.com/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${config.REDIRECT_URI}&response_type=token&show_dialog=true`} >
          Log In to Spotify
        </a>
      )}
      {this.state.token && ( <div>
             <Cocktail token={this.state.token}/>

    </div>
      )}
    </div>
  );
  }
}

export default App;
