import { PokemonForBattle } from "./PokemonForBattle";

export type PokemonTrainer = {
  name: string;
  image: string | undefined;
  level: number,
  pokemons: PokemonForBattle[];
  favoritePokemons: PokemonForBattle[];
  money: number;
  items: PokemonTrainerItem[];  
};

export type PokemonTrainerItem = {
  name: string;
  quantity: number;
  category : "Pokeball" | "Heal";
  price: number
}
