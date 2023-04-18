import { ChangeEvent, FormEvent, useState } from "react";

import { AxiosError } from "axios";

import { debounce } from "lodash";

import classNames from "classnames";

import bgImage from "./assets/pokedex.png";

import style from "./App.module.css";

import { api } from "./lib/axios";

import "./global.css";

interface Pokemon {
  id: string,
  name: string,
  imageUrl: string
}

export function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemon, setPokemon] = useState({
    id: "1",
    name: "Bulbasaur",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif"
  })

  const handleDebouncedSearch = debounce((searchValue: string) => {
    fetchPokemon(searchValue);
  }, 300)

  async function handleSearchPokemon(event: ChangeEvent<HTMLInputElement>) {
    const lowercasedPokemonName = event?.target.value?.toLowerCase();

    setPokemonName(lowercasedPokemonName || "");

    if(lowercasedPokemonName) {
      await handleDebouncedSearch(lowercasedPokemonName);
    }
  }

  async function handlePreviousPokemon() {
    const previousPokemonId = Number(pokemon.id) - 1;

    setPokemonName(String(previousPokemonId));

    await handleDebouncedSearch(pokemonName);
  }

  async function handleNextPokemon() {
    const nextPokemonId = Number(pokemon.id) + 1;

    setPokemonName(String(nextPokemonId));

    await handleDebouncedSearch(pokemonName);
  }

  async function fetchPokemon(pokemonName: string) {
    try {
      const response = await api.get(`pokemon/${pokemonName}`);
      const data = response.data;

      const newPokemon: Pokemon = {
        id: data.id,
        name: data.name,
        imageUrl: data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"],
      }

      setPokemon(newPokemon);
    }

    catch (error) {
      console.error("Failed to fetch Pokemon: ", error);
      
      const errorResponse = error as AxiosError;

      if(errorResponse.response && errorResponse.response.status === 404) {
        console.log("404 - Not found")
      }
    }
  }

  function preventFormSubmission(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <main>
      <img 
        src={pokemon.imageUrl} 
        alt=""
        className={style.pokemonImage}
      />

      <div className={style.pokemonData}>
        <strong className={style.pokemonNumber}>{pokemon.id}</strong>
        <span>-</span>
        <strong className={style.pokemonName}>{pokemon.name}</strong>
      </div>

      <form action="" className={style.form} onSubmit={preventFormSubmission}>
        <input 
          type="search"
          id=""
          className={style.searchInput}
          placeholder="Pokemon name"

          onChange={handleSearchPokemon}

          required 
        />
      </form>

      <div className={style.buttonWrapper}>
        <button 
          type="button" 
          className={classNames(style.button, style.buttonPrev)}
          onClick={handlePreviousPokemon}
        >
          &lt; Prev
        </button>
        
        <button 
          type="button" 
          className={classNames(style.button, style.buttonNext)}
          onClick={handleNextPokemon}
        >
          Next &gt;
        </button>
      </div>

      <img src={bgImage} alt="" />
    </main>
  )
}