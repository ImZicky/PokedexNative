import { Gender, Pokemon, PokemonAbility, PokemonClient } from "pokenode-ts";
import { useCommonService } from "../common/CommonService";
import { PokemonForBattle, PokemonForBattleSkills } from "./types/PokemonForBattle";

const pokemonService = usePokemonService();

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
        if (i % (pageSize + 1) === 0) initialPokemonIdPages.push(i);
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
    getPokemonInitials: async () => {
      let pokemonInitialList : Pokemon[] = [];
      await pokemonService.getPokemonById(1)
      .then(bulba => {
        pokemonInitialList.push(bulba);
      });
      await pokemonService.getPokemonById(7)
      .then(squirtle => {
        pokemonInitialList.push(squirtle);
        
      });
      await pokemonService.getPokemonById(4)
      .then(charmander => {
        pokemonInitialList.push(charmander);
      });
      await pokemonService.getPokemonById(25)
      .then(pikachu => {
        pokemonInitialList.push(pikachu);    
      });
      return pokemonInitialList;
    },

    getAbilityDescription: async (name: string) => {
      const ability = await api.getAbilityByName(name);
      return ability.effect_entries.find((x) => x.language.name === "en")
        ?.short_effect;
    },
    getRamdomLevelBasedOnPlayer: (playersPokemonLevel: number) : number => {    
      const shouldBeHigher = (Math.random() * 10) > 5;
      if(shouldBeHigher) {
        return parseInt(`${playersPokemonLevel + (Math.random() * 5)}`)
      }
      return parseInt(`${playersPokemonLevel - (Math.random() * 5)}`)
    },  
    getPokemonSkills: (abilities: PokemonAbility[]) : PokemonForBattleSkills[] => {
      let pokemonSkillList : PokemonForBattleSkills[] = [];


      abilities.forEach((a) => {
        let ppTotal = parseInt(`${Math.random() * 30}`);
        if (ppTotal <= 7) ppTotal = 8; 
        const pDamage = parseInt(`${Math.random() * 20}`);
        const pokemonSkill : PokemonForBattleSkills = {
          name: a.ability.name,
          damage: pDamage < 10 ? 10 : pDamage,
          ppNow: ppTotal,
          ppTotal: ppTotal
        }
        pokemonSkillList.push(pokemonSkill)
      })  
      return pokemonSkillList;
    },
    getPokemonForBattle : async (pokemonApi: Pokemon, playersPokemonLevel: number, nickname: string | undefined) => {
      const pokemonLevel = pokemonService.getRamdomLevelBasedOnPlayer(playersPokemonLevel);

      const pokemonForBattle : PokemonForBattle = {
          hp: pokemonLevel * 10,
          hpTotal: pokemonLevel * 10,
          id: pokemonApi.id,
          level: pokemonLevel,
          name: pokemonApi.name,
          type: pokemonApi.types,
          skills: pokemonService.getPokemonSkills(pokemonApi.abilities),
          nickname: nickname ?? '',
          sprites: pokemonApi.sprites,
          pokeball: undefined
        }
      return pokemonForBattle;
    }
  };
}
