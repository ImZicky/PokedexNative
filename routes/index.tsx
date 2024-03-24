import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";
import React from "react";
import { UserCredentials } from "../service/api/types/User";

export type RoutesProps = {
  isAppLoading: boolean;
  handlerUser: (userLogin: UserCredentials) => void;
};

export default function Routes(props: RoutesProps) {
  return (
    <NavigationContainer >
      <DrawerRoutes handlerUser={(userLogin: UserCredentials) => props.handlerUser(userLogin)} isAppLoading={props.isAppLoading} />
    </NavigationContainer>
  );
}
