import { PokemonForBattle } from "./PokemonForBattle";

export type PokemonTrainer = {
  name: string;  
  pokemons: PokemonForBattle[];
  money: number;
  items: PokemonTrainerItem[];  
};

export type PokemonTrainerItem = {
  name: string;
  quantity: number;
  category : "Pokeball" | "Heal"
}
