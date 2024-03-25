import { Gender, Pokemon, PokemonSpeciesGender, PokemonSprites, PokemonType } from "pokenode-ts";

export type PokemonForBattle = {
  id: number;
  name: string;
  nickname: string | undefined;
  skills: PokemonForBattleSkills[];
  hp: number;
  level: number;
  type: PokemonType[];
  sprites: PokemonSprites,
};

export type PokemonForBattleSkills = {
  name: string;
  ppNow: number;
  ppTotal: number;
  damage: number;
}



