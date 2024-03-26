import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";
import React from "react";
import { UserCredentials } from "../service/api/types/User";
import { PokemonTrainer } from "../service/api/types/PokemonTrainer";

export type RoutesProps = {
  isAppLoading: boolean;
  handlerUser: (userLogin: UserCredentials) => void;
  userPokemonTrainer: PokemonTrainer
};

export default function Routes(props: RoutesProps) {
  return (
    <NavigationContainer >
      <DrawerRoutes userPokemonTrainer={props.userPokemonTrainer} handlerUser={(userLogin: UserCredentials) => props.handlerUser(userLogin)} isAppLoading={props.isAppLoading} />
    </NavigationContainer>
  );
}
