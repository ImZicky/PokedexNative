import { Gender, Pokemon, PokemonSpeciesGender, PokemonSprites, PokemonType } from "pokenode-ts";

export type PokemonForBattle = {
  id: number;
  name: string;
  nickname: string | undefined;
  skills: PokemonForBattleSkills[];
  hp: number;
  hpTotal: number;
  level: number;
  type: PokemonType[];
  sprites: PokemonSprites,
  pokeball?: PokeballTypeEnum | undefined
};


export type PokeballTypeEnum = "Pokeball" | "Great Ball" | "Ultra Ball" | "Master Ball";

export type PokemonForBattleSkills = {
  name: string;
  ppNow: number;
  ppTotal: number;
  damage: number;
}



