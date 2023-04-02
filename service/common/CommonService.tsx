import React from "react";

export function useCommonService() {
  return {
    getRandomInt: (max: number) => {
      return Math.floor(Math.random() * max);
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
