import config from "./config";
export default class API {
  static doFetch(endpoint, method = "GET", body = null) {
    let url = "https://cors-anywhere.herokuapp.com/";
    let options = {
      method,
      headers: new Headers({ "Content-type": "application/json" })
    };
    if (body) options.body = JSON.stringify(body);
    return fetch(url + endpoint, options).then(res => {
      if (res.status !== 204) {
        return res.json();
      } else {
        return res.json().then(e => Promise.reject(e));
      }
    });
  }
/*   static async spotifyFetch(endpoint, method = "GET", token) {
    let url = "https://crossorigin.me/";
    let options = {
      method,
      headers: new Headers({
        "Origin": config.REDIRECT_URL,
        "Authorization": `Bearer ${token}`
      })
    };
    try {
      let response = await fetch(url + endpoint, options);
      let json = await response.json();
      console.log('RESPONSE')
      console.log(JSON.stringify(json));
    } catch (error) {
      console.log('ERROR', error);
    }
  } */
}
