import React from "react";
import { PokemonSprites } from "pokenode-ts";
import { DeviceEventEmitter } from "react-native";

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
    getPokemonMainImageBackForBattle: (sprites: PokemonSprites, isShiny: boolean) => {
      if(isShiny) {
        return sprites.versions["generation-v"]["black-white"].animated.back_shiny ?
        sprites.versions["generation-v"]["black-white"].animated.back_shiny : 
        sprites.other?.["official-artwork"].front_default;
      }
      else{
        return sprites.versions["generation-v"]["black-white"].animated.back_default ?
        sprites.versions["generation-v"]["black-white"].animated.back_default : 
        sprites.other?.["official-artwork"].front_default;
      }
    },
    getPokemonMainImageFrontForBattle: (sprites: PokemonSprites, isShiny : boolean) => {
      if(isShiny) {
        return sprites.versions["generation-v"]["black-white"].animated.front_shiny ?
        sprites.versions["generation-v"]["black-white"].animated.front_shiny : 
        sprites.other?.["official-artwork"].front_default;
      }
      else{
        return sprites.versions["generation-v"]["black-white"].animated.front_default ?
        sprites.versions["generation-v"]["black-white"].animated.front_default : 
        sprites.other?.["official-artwork"].front_default;
      }
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
        ? `${(wheightGram * 0.001).toFixed(1)} kg`
        : `${wheightGram} g`;
    },
    getColorFromType: (type: string) => {
      switch (type) {
        case "menuGreen":
          return "#4E6648"
        case "invisible":
          return "#FFFFFF00"
        case "primary":
          return "#a30000";
        case "secondary":
          return "#000000";
        case "bug":
          return "#1C4B26";
        case "dark":
          return "#030603";
        case "dragon":
          return "#448B95";
        case "electric":
          return "#F7AD2B";
        case "fairy":
          return "#971944";
        case "fighting":
          return "#993F23";
        case "fire":
          return "#AA1F22";
        case "flying":
          return "#49677D";
        case "ghost":
          return "#30336B";
        case "grass":
          return "#137B3C";
        case "ground":
          return "#A9702B";
        case "ice":
          return "#86D2F5";
        case "normal":
          return "#75515B";
        case "poison":
          return "#5E2C88";
        case "psychic":
          return "#A4296C";
        case "rock":
          return "#481706";
        case "steel":
          return "#5F756D";
        case "water":
          return "#1352E2";
        case "white":
          return "#FFFFFF";
        default:
          return "#a30000";
      }
    },
    getLighterColorFromType: (type: string) => {
      switch (type) {
        case "menuGreen":
          return "#758f6e"
        case "invisible":
          return "#FFFFFF00"
        case "primary":
          return "#a32e2e";
        case "secondary":
          return "#000000";
        case "bug":
          return "#3e6d48";
        case "dark":
          return "#252825";
        case "dragon":
          return "#66adb7";
        case "electric":
          return "#f9ce4d";
        case "fairy":
          return "#b93b66";
        case "fighting":
          return "#bb5f45";
        case "fire":
          return "#cc2f44";
        case "flying":
          return "#6b899f";
        case "ghost":
          return "#52558d";
        case "grass":
          return "#359d5f";
        case "ground":
          return "#cb924d";
        case "ice":
          return "#a8f4f7";
        case "normal":
          return "#97737d";
        case "poison":
          return "#7f4eaa";
        case "psychic":
          return "#c64b8f";
        case "rock":
          return "#6a3928";
        case "steel":
          return "#7f978f";
        case "water":
          return "#3574f4";
        case "white":
          return "#FFFFFF";
        default:
          return "#c52222";
      }
    },
    handleInactivateNavigatorBar: (value: boolean) => {
      DeviceEventEmitter.emit("event.handleActivateNavigatorBar", value);
    },
    stringToCapitalLetters: (text: string) =>  {
      return `${text[0].toUpperCase()}${text.substring(1, text.length)}`
    },
  };
}
