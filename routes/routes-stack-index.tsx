import { NavigationContainer } from "@react-navigation/native";

import React from "react";
import { UserCredentials } from "../service/api/types/User";
import StackRoutesLogin from "./stack.routes";

export type RoutesStackLoginProps = {
  isAppLoading: boolean;
  handlerUser: (userLogin: UserCredentials) => void;
};

export default function RoutesStackLogin(props: RoutesStackLoginProps) {
  return (
    <NavigationContainer>
      <StackRoutesLogin
        handlerUser={(userLogin: UserCredentials) => props.handlerUser(userLogin)}
        isAppLoading={props.isAppLoading} 
      />
    </NavigationContainer>
  );
}
