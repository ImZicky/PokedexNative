import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useCommonService } from "../service/common/CommonService";
import { UserCredentials } from "../service/api/types/User";
import PokePerfilCreate from "../views/PokePerfilCreate/PokePerfilCreate";
import PokeLogin from "../views/PokeLogin/PokeLogin";
import PokePerfil from "../views/PokePerfil/PokePerfil";

const Stack = createStackNavigator();

export type StackRoutesProps = {
  isAppLoading: boolean;
  handlerUser: (userLogin: UserCredentials) => void;
};

export default function StackRoutesLogin(cProps: StackRoutesProps) {
  return (
    <Stack.Navigator 
      initialRouteName="PokeLogin"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PokeLogin"
      >
        {(props) => (
          <PokeLogin
            handlerUser={(userLogin: UserCredentials) => cProps.handlerUser(userLogin)}
            navigation={props.navigation} route={props.route}/>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="PokePerfilCreate"
      >
        {(props) => (
          <PokePerfilCreate
            handlerUser={(userLogin: UserCredentials) => cProps.handlerUser(userLogin)}
            navigation={props.navigation} route={props.route}/>
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
