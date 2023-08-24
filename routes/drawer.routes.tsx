import { createDrawerNavigator } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import StackRoutes from "./stack.routes";
import PokeList from "../views/PokeList/PokeList";
import PokePerfil from "../views/PokePerfil/PokePerfil";

const Drawer = createDrawerNavigator();

export type DrawerRoutesProps = {
  isAppLoading: boolean;
};

const headerOptions = {
  headerStyle: {
    backgroundColor: "#fff",
  },
  headerTintColor: "#ed5463",
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: "center",
};

export default function DrawerRoutes(cProps: DrawerRoutesProps) {
  return (
    <Drawer.Navigator
      initialRouteName="PokeList"
      screenOptions={
        { ...headerOptions, headerShown: !cProps.isAppLoading } as any
      }
    >
      <Drawer.Screen
        name="PokeList"
        options={{
          headerTitle: "POKEDEX",
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="image-multiple-outline"
              color={"#ed5463"}
              size={size}
            />
          ),
          drawerLabel: "Pokedex",
          drawerLabelStyle: {
            color: "#ed5463",
            textTransform: "capitalize",
          },
        }}
      >
        {(props) => <PokeList navigation={props.navigation} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="PokePerfil"
        options={{
          headerTitle: "INFOS",
          drawerItemStyle: { display: "none" },
        }}
      >
        {(props) => (
          <PokePerfil navigation={props.navigation} route={props.route} />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}
