import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";
import React from "react";
import { UserCredentials } from "../service/api/types/User";
import { PokemonTrainer } from "../service/api/types/PokemonTrainer";
import { PokeballTypeEnum, PokemonForBattle } from "../service/api/types/PokemonForBattle";
import { MusicName } from "../service/api/types/Music";

export type RoutesProps = {
  handlerUser: (userLogin: UserCredentials) => void;
  playSoundDefault: (name: MusicName) => void;
  handleReward: (moneyReward: number) => void;
  handleHealBattlingPokemons: () => void;
  handleUsePokeball: (pokeballName : string) => void;
  handleSetPokemonBattling: (pokemon: PokemonForBattle, position: number) => void;
  handleHealPokemon: (position: number, potionName: string) => void;
  handleCapturePokemon: (pokemon: PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => void;
  handleChooseOtherPokemon: (pokemon: PokemonForBattle) => void;
  setIsBattling: (value: boolean) => void;
  handleBuyItemPokemon: (itemName: string, price: number) => void; 
  isBattling: boolean;
  isAppLoading: boolean;
  userPokemonTrainer: PokemonTrainer
};

export default function Routes(props: RoutesProps) {
  return (
    <NavigationContainer>
      <DrawerRoutes
        handleReward={(moneyReward: number) => props.handleReward(moneyReward)}
        handleBuyItemPokemon={(itemName: string, price: number) => props.handleBuyItemPokemon(itemName, price)}
        isBattling={props.isBattling}
        setIsBattling={props.setIsBattling}
        playSoundDefault={(name: MusicName) => props.playSoundDefault(name)}
        handleHealBattlingPokemons={() => props.handleHealBattlingPokemons()}
        handleCapturePokemon={(pokemon: PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => props.handleCapturePokemon(pokemon, moneyReward, chosenPokeball)} 
        handleChooseOtherPokemon={(pokemon: PokemonForBattle) => props.handleChooseOtherPokemon(pokemon)} 
        handleHealPokemon={(position: number, potionName: string) => props.handleHealPokemon(position, potionName)} 
        handleUsePokeball={(pokeballName: string) => props.handleUsePokeball(pokeballName)}
        handleSetPokemonBattling={(pokemon: PokemonForBattle, position: number) => props.handleSetPokemonBattling(pokemon, position)} 
        handlerUser={(userLogin: UserCredentials) => props.handlerUser(userLogin)} 
        userPokemonTrainer={props.userPokemonTrainer} 
        isAppLoading={props.isAppLoading} 
      />
    </NavigationContainer>
  );
}
