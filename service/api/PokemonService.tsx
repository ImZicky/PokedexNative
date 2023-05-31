import { Pokemon, PokemonClient } from "pokenode-ts";
import { useCommonService } from "../common/CommonService";

export function usePokemonService() {
  const api = new PokemonClient();
  const commonService = useCommonService();

  return {
    getRamdomPokemon: async () => {
      const ramdomId = commonService.getRandomInt(1010);
      const result = await api.getPokemonById(ramdomId);
      if (result === undefined) throw new Error("something went wrong");
      return result;
    },
    getPokemonById: async (id: number) => {
      const result = await api.getPokemonById(id);
      if (result === undefined) throw new Error("something went wrong");
      return result;
    },
    getPokemonListPagination: async (pageNumber: number, pageSize: number) => {
      let pokemonList: Pokemon[] = [];
      const initialPokemonIdPages: number[] = [1];

      for (let i = 1; i <= 1010; i++) {
        if (i % 50 === 0) initialPokemonIdPages.push(i);
      }

      let initialPokemonId = initialPokemonIdPages[pageNumber];

      const finalPokemonId = initialPokemonId + pageSize;

      for (let id = initialPokemonId; id < finalPokemonId; id++) {
        if (id <= 1010) {
          const result = await api.getPokemonById(id);
          if (result === undefined) throw new Error("something went wrong");
          else pokemonList.push(result);
        }
      }
      return pokemonList;
    },
  };
}
