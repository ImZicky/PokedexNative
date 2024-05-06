import { Gender, LocationAreaEncounter, Pokemon, PokemonAbility, PokemonClient, PokemonEncounter, PokemonMove } from "pokenode-ts";
import { useCommonService } from "../common/CommonService";
import { PokemonForBattle, PokemonForBattleSkills } from "./types/PokemonForBattle";
import { apiPokemon } from "../common/Api";

const pokemonService = usePokemonService();

export function usePokemonService() {
  const apiPokemonLib = new PokemonClient();
  const commonService = useCommonService();

  return {
    getRamdomPokemon: async () => {
      const ramdomId = commonService.getRandomInt(1010);
      const result = await apiPokemonLib.getPokemonById(ramdomId);
      if (result === undefined) throw new Error("something went wrong");
      return result;
    },
    getPokemonById: async (id: number) => {
      const result = await apiPokemonLib.getPokemonById(id);
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
          const result = await apiPokemonLib.getPokemonById(id);
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
      await pokemonService.getPokemonById(133)
      .then(eevee => {
        pokemonInitialList.push(eevee);
      });
      await pokemonService.getPokemonById(52)
      .then(meowth => {
        pokemonInitialList.push(meowth);
      });
      return pokemonInitialList;
    },

    getAbilityDescription: async (name: string) => {
      const ability = await apiPokemonLib.getAbilityByName(name);
      return ability.effect_entries.find((x) => x.language.name === "en")
        ?.short_effect;
    },
    getRamdomLevelBasedOnPlayer: (playersPokemonLevel: number) : number => {    
      const shouldBeHigher = (Math.random() * 10) > 5;
      if(shouldBeHigher) {
        return parseInt(`${playersPokemonLevel + (Math.random() * 5)}`)
      }
      const nr = parseInt(`${playersPokemonLevel - (Math.random() * 5)}`);
      return nr > 3 ? nr : 3;
    },  
    getPokemonSkills: (abilities: PokemonAbility[], moves: PokemonMove[], level: number ) : PokemonForBattleSkills[] => {
      let pokemonSkillList : PokemonForBattleSkills[] = [];

      abilities.forEach((a) => {
        let ppTotal = parseInt(`${Math.random() * level}`);
        if (ppTotal <= 7) ppTotal = 8; 
        const pDamage = parseInt(`${Math.random() * level}`);
        const pokemonSkill : PokemonForBattleSkills = {
          name: a.ability.name,
          damage: pDamage < 10 ? 10 : pDamage,
          ppNow: ppTotal,
          ppTotal: ppTotal
        }
        pokemonSkillList.push(pokemonSkill)
      })  

      const remaining = 4 - pokemonSkillList.length;

      for(let i = 0; i < remaining; i++){
        let ppTotal = parseInt(`${Math.random() * 30}`);
        if (ppTotal <= 7) ppTotal = 8; 
        const pDamage = parseInt(`${Math.random() * 20}`);

        const rand = parseInt(`${Math.random() * moves.length}`);
        const randomMove = moves[rand];

        const pokemonSkill : PokemonForBattleSkills = {
          name: randomMove.move.name,
          damage: pDamage < 10 ? 10 : pDamage,
          ppNow: ppTotal,
          ppTotal: ppTotal
        }
        pokemonSkillList.push(pokemonSkill)
      }

      return pokemonSkillList;
    },
    getIsShiny : () : boolean => {    
      return parseInt(`${Math.random() * 100}`) > 75;
    },
    getPokemonForBattle : async (pokemonApi: Pokemon, playersPokemonLevel: number, nickname: string | undefined, forceShiny ?: boolean ) => {
      const pokemonLevel = pokemonService.getRamdomLevelBasedOnPlayer(playersPokemonLevel);

      const pokemonForBattle : PokemonForBattle = {
          hp: pokemonLevel * 10,
          hpTotal: pokemonLevel * 10,
          id: pokemonApi.id,
          level: pokemonLevel,
          levelXp: (pokemonLevel * 100),
          name: pokemonApi.name,
          type: pokemonApi.types,
          skills: pokemonService.getPokemonSkills(pokemonApi.abilities, pokemonApi.moves, pokemonLevel),
          nickname: nickname ?? '',
          sprites: pokemonApi.sprites,
          pokeball: undefined,
          shiny: forceShiny ?? pokemonService.getIsShiny() 
        }
      return pokemonForBattle;
    },
    getAreaEnconters: async (pokemonId : number) : Promise<string[]> => {
      const result = await apiPokemon.get(`pokemon/${pokemonId}/encounters`)
      if(result !== undefined){
        const enconters : LocationAreaEncounter[] = result.data;
        return enconters.map(x => x.location_area.name);
      }
      return ["Not a single place"];
    }
  };
}
