import React from "react";
import API from "./api-helper.js";
import SpotifyPlaylist from "./SpotifyPlaylist.js";

export default class Cocktail extends React.Component {
  state = {
    error: "",
    searchTerm: "",
    cocktailResults: "",
    cocktailResultsDisplay: true,
    drinkName: "",
    drinkToMake: []
  };

  handleSearchInput = term => {
    this.setState({
      searchTerm: term
    });
  };

  submitSearch = e => {
    e.preventDefault();
    if (this.state.searchTerm === "") {
      this.setState({
        error: "Search term is required"
      });
    }
    API.doFetch(
      `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${this.state.searchTerm}`
    ).then(res => {
      this.setState({
        cocktailResults: res.drinks,
        searchTerm: ""
      });
    });
  };
  setDrink = drinkName => {
    let drinkToMake = this.state.cocktailResults.filter(
      drink => drink.strDrink === drinkName
    );
    this.setState({
      drinkName: drinkName,
      drinkToMake: drinkToMake,
      cocktailResultsDisplay: false
    });
  };

  render() {
    let results = this.state.cocktailResults;

    if (results == null) {
      results = "No cocktails found :(";
    } else if (results === "") {
      results = "";
    } else if (this.state.cocktailResultsDisplay === true) {
      results = this.state.cocktailResults.map((drink, index) => {
        return (
          <li key={index} id={drink.strDrink}>
            {drink.strDrink}
            <button
              onClick={e => this.setDrink(e.currentTarget.parentElement.id)}
            >
              Choose this Drink
            </button>
          </li>
        );
      });
    } else results = "";

    let drinkIngredients = [];
    let drinkMeasures = [];
    let drink = this.state.drinkToMake;
    if (drink.length === 0) {
      drinkIngredients.push("No ingredients");
    } else {
      for (let [key, value] of Object.entries(drink[0])) {
        if (key.includes("strIngredient") && value !== null) {
          drinkIngredients.push(value);
        } else if (key.includes("strMeasure") && value !== null) {
          drinkMeasures.push(value);
        }
      }
    }

    for (let i = 0; i < drinkIngredients.length; i++) {
      drinkIngredients[i] += `, ${drinkMeasures[i]}`;
    }
    return (
      <div>
        {this.state.error && <p>{this.state.error}</p>}
        <form>
          <label htmlFor="cocktail">Search for a Cocktail by Name:</label>
          <input
            required="required"
            type="text"
            id="cocktail"
            value={this.state.searchTerm}
            onChange={e => this.handleSearchInput(e.target.value)}
          />
          <button htmlFor="cocktail" onClick={e => this.submitSearch(e)}>
            Search
          </button>
        </form>
        {this.state.cocktailResults && (
          <div>
            <ul>{results}</ul>
          </div>
        )}
        {this.state.drinkName && (
          <div>
            <h2>Sweet! You're Making a {this.state.drinkName}</h2>
            <h3>You'll Need:</h3>
            <ul>
              {drinkIngredients.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
            <h3>Here's How:</h3>
            <p>{this.state.drinkToMake[0].strInstructions}</p>
            
          </div>
        )}
        <SpotifyPlaylist
              token={this.props.token}
              search={this.state.drinkName}
            />
      </div>
    );
  }
}
