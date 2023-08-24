import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PokePerfil from "../views/PokePerfil/PokePerfil";
import PokeList from "../views/PokeList/PokeList";
import { useCommonService } from "../service/common/CommonService";

const Stack = createStackNavigator();

export default function StackRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PokeList" options={{ headerTitle: "TESTE" }}>
        {() => <PokeList />}
      </Stack.Screen>

      <Stack.Screen name="PokePerfil">
        {(props) => (
          <PokePerfil
            {...props}
            navigation={props.navigation}
            route={props.route}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
