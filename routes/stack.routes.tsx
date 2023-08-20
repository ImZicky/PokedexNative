import { createStackNavigator } from "@react-navigation/stack";
import PokePerfil from "../views/PokePerfil/PokePerfil";
import PokeList from "../views/PokeList/PokeList";

const Stack = createStackNavigator();

export default function StackRoutes() {
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

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PokeList"
        options={{
          ...headerOptions,
          title: "POKEDEX",
          headerShown: false,
        }}
      >
        {() => <PokeList />}
      </Stack.Screen>

      <Stack.Screen
        name="PokePerfil"
        options={{ ...headerOptions, title: "DETAILS" }}
      >
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
