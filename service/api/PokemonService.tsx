import { PokemonClient } from "pokenode-ts";
import { useCommonService } from "../common/CommonService";

export function usePokemonService() {
  const api = new PokemonClient();
  const commonService = useCommonService();

  return {
    getRamdomPokemon: async () => {
      const ramdomId = commonService.getRandomInt(100);
      const result = await api.getPokemonById(ramdomId);
      if (result === undefined) throw new Error("something went wrong");
      return result;
    },
    getPokemonById: async (id: number) => {
      const result = await api.getPokemonById(id);
      if (result === undefined) throw new Error("something went wrong");
      return result;
    },
  };
}
