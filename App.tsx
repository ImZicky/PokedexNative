import "react-native-gesture-handler";
import { IconComponentProvider } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import PokeList from "./views/PokeList/PokeList";
import PokePerfil from "./views/PokePerfil/PokePerfil";
import PokeLogin from "./views/PokeLogin/PokeLogin";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PokeLoading from "./components/loader/PokeLoading";
import Routes from "./routes";
import { DeviceEventEmitter } from "react-native";
import { UserCredentials } from "./service/api/types/User";
import { UserContext } from "./contexts/UserContext";
import { PokemonTrainer } from "./service/api/types/PokemonTrainer";

const Stack = createStackNavigator();

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>();
  const [userPokemonTrainer, setUserPokemonTrainer] = useState<PokemonTrainer>({
    name: 'Lucas', // TODO: retirar isso dps de testar
    pokemons: []
  });

  const handlerUser = (userCredentials: UserCredentials) => {
    setUserCredentials(userCredentials);
    setUserPokemonTrainer({
      name: 'Lucas',
      pokemons: []
    })
  };

  DeviceEventEmitter.addListener("event.handleActivateNavigatorBar", (value) =>
    setIsAppLoading(value)
  );

  return (
    <>
      {userCredentials && userCredentials.isLogged ? (
        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          <UserContext.Provider value={userCredentials}>
            <Routes
                userPokemonTrainer={userPokemonTrainer}
                handlerUser={(userLogin: UserCredentials) =>
                  handlerUser(userLogin)
                }
                isAppLoading={isAppLoading}></Routes>
          </UserContext.Provider>
        </IconComponentProvider>
      ) : (
          // <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          //   <UserContext.Provider value={userCredentials}>
          //     <Routes userPokemonTrainer={userPokemonTrainer} handlerUser={() => handlerUser} isAppLoading={isAppLoading}></Routes>
          //   </UserContext.Provider>
          // </IconComponentProvider>

        <View style={styles.container}>
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <UserContext.Provider value={userCredentials}>
              <PokeLogin
                handlerUser={(userLogin: UserCredentials) =>
                  handlerUser(userLogin)
                }
              />
            </UserContext.Provider>
          </IconComponentProvider>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
