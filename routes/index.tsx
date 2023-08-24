import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./drawer.routes";

export type RoutesProps = {
  isAppLoading: boolean;
};

export default function Routes(props: RoutesProps) {
  return (
    <NavigationContainer>
      <DrawerRoutes isAppLoading={props.isAppLoading} />
    </NavigationContainer>
  );
}
