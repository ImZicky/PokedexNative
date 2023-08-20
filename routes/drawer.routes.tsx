import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StackRoutes from "./stack.routes";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator
      initialRouteName="Pokedex"
      screenOptions={{ headerShown: true, headerTintColor: "#a30000" }}
    >
      <Drawer.Screen
        name="Pokedex"
        component={StackRoutes}
        options={{
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="image-multiple-outline"
              color={"#a30000"}
              size={size}
            />
          ),
          drawerLabel: "Pokedex",
          drawerLabelStyle: {
            color: "#a30000",
            textTransform: "capitalize",
          },
        }}
      ></Drawer.Screen>
    </Drawer.Navigator>
  );
}
