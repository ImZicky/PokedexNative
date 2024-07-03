import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useCommonService } from "../service/common/CommonService";
import { UserCredentials } from "../service/api/types/User";
import PokeSignUp from "../views/PokeSignUp/PokeSignUp";
import PokeSignIn from "../views/PokeSignIn/PokeSignIn";

const Stack = createStackNavigator();

export type StackRoutesProps = {
  isAppLoading: boolean;
  handlerUser: (userLogin: UserCredentials) => void;
};

export default function StackRoutesLogin(cProps: StackRoutesProps) {
  return (
    <Stack.Navigator 
      initialRouteName="PokeSignIn"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="PokeSignIn"
      >
        {(props) => (
          <PokeSignIn
            handlerUser={(userLogin: UserCredentials) => cProps.handlerUser(userLogin)}
            navigation={props.navigation} route={props.route}/>
        )}
      </Stack.Screen>

      <Stack.Screen
        name="PokeSignUp"
      >
        {(props) => (
          <PokeSignUp
            handlerUser={(userLogin: UserCredentials) => cProps.handlerUser(userLogin)}
            navigation={props.navigation} route={props.route}/>
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
