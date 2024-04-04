import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";
import React from "react";
import { UserCredentials } from "../service/api/types/User";
import { PokemonTrainer } from "../service/api/types/PokemonTrainer";
import { PokemonForBattle } from "../service/api/types/PokemonForBattle";

export type RoutesProps = {
  handlerUser: (userLogin: UserCredentials) => void;
  handleCureBattlingPokemons: () => void;
  handleSetPokemonBattling: (pokemon: PokemonForBattle, position: number) => void;
  handleCapturePokemon: (pokemon: PokemonForBattle) => void;
  isAppLoading: boolean;
  userPokemonTrainer: PokemonTrainer
};

export default function Routes(props: RoutesProps) {
  return (
    <NavigationContainer >
      <DrawerRoutes
        handleCureBattlingPokemons={() => props.handleCureBattlingPokemons()}
        handleCapturePokemon={(pokemon: PokemonForBattle) => props.handleCapturePokemon(pokemon)} 
        handleSetPokemonBattling={(pokemon: PokemonForBattle, position: number) => props.handleSetPokemonBattling(pokemon, position)} 
        handlerUser={(userLogin: UserCredentials) => props.handlerUser(userLogin)} 
        userPokemonTrainer={props.userPokemonTrainer} 
        isAppLoading={props.isAppLoading} 
      />
    </NavigationContainer>
  );
}
