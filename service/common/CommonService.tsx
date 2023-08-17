import { PokemonSprites } from "pokenode-ts";
import React from "react";

export function useCommonService() {
  return {
    getRandomInt: (max: number) => {
      return Math.floor(Math.random() * max);
    },
    getPokemonMainPerfil: (sprites: PokemonSprites) => {
      return sprites.other?.home.front_default !== undefined
        ? sprites.other?.home.front_default
        : sprites.front_default;
    },
    getPokemonMainImage: (sprites: PokemonSprites) => {
      return sprites.other?.["official-artwork"].front_default !== undefined
        ? sprites.other?.["official-artwork"].front_default
        : sprites.front_default;
    },
    getPokemonHeight: (height: number) => {
      const heightCm = height * 10;
      return heightCm >= 100
        ? `${(heightCm * 0.01).toFixed(2)} m`
        : `${heightCm} cm`;
    },
    getPokemonWheight: (wheight: number) => {
      const wheightGram = wheight * 100;
      return wheightGram >= 1000
        ? `${(wheightGram * 0.001).toFixed(2)} kg`
        : `${wheightGram} g`;
    },
    getColorFromType: (type: string) => {
      switch (type) {
        case "primary":
          return "#a30000";
        case "secondary":
          return "#000000";
        case "bug":
          return "#97c220";
        case "dark":
          return "#50495f";
        case "dragon":
          return "#0969c2";
        case "electric":
          return "#f4d543";
        case "fairy":
          return "#ed8fe5";
        case "fighting":
          return "#cf4068";
        case "fire":
          return "#ffa053";
        case "flying":
          return "#92acdf";
        case "ghost":
          return "#606dbb";
        case "grass":
          return "#5fba58";
        case "ground":
          return "#dc8658";
        case "ice":
          return "#6ccdbf";
        case "normal":
          return "#959ca1";
        case "poison":
          return "#a765c8";
        case "psychic":
          return "#f86e74";
        case "rock":
          return "#cbbd8d";
        case "steel":
          return "#548f9f";
        case "water":
          return "#5398d8";
        default:
          return "#a30000";
      }
    },
  };
}
