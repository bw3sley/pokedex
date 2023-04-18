import { ChangeEvent, useEffect, useState } from "react";

import classNames from "classnames";

import bgImage from "./assets/pokedex.png";

import style from "./App.module.css";

import { api } from "./lib/axios";

import "./global.css";

interface Pokemon {
  id: string | number,
  name: string,
  imageUrl: string
}

export function App() {
  const [pokemonName, setPokemonName] = useState("bulbasaur");
  const [pokemon, setPokemon] = useState<Pokemon>({
    id: "1",
    name: "Bulbasaur",
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif"
  })

  function handleSearchPokemon(event: ChangeEvent<HTMLInputElement>) {
    const lowercasedPokemonName = String(event?.target.value).toLocaleLowerCase();

    setPokemonName(lowercasedPokemonName);
  }

  function handlePreviousPokemon() {
    const previousPokemon = {
      id: String(Number(pokemon.id) - 1),
    }

    setPokemonName(previousPokemon.id);
  }

  function handleNextPokemon() {
    const nextPokemon = {
      id: String(Number(pokemon.id) + 1),
    }

    setPokemonName(nextPokemon.id);
  }

  async function fetchPokemon() {
    const response = await api.get(`pokemon/${pokemonName}`);
    const data = await response.data;

    const newPokemon = {
      id: data.id,
      name: data.name,
      imageUrl: data['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
    }

    setPokemon(newPokemon);
  }

  // I know it's not right

  useEffect(() => {
    fetchPokemon();
  }, [pokemonName]);

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

      <form action="" className={style.form}>
        <input 
          type="search"
          id=""
          className={style.searchInput}
          placeholder="Name or number"

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