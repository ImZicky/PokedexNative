import { IconComponentProvider } from "@react-native-material/core";
import React, { createContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { UserCredentials } from "./service/api/types/User";
import PokeList from "./views/PokeList/PokeList";
import PokePerfil from "./views/PokePerfil/PokePerfil";
import PokeLogin from "./views/PokeLogin/PokeLogin";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PokeLoading from "./components/loader/PokeLoading";

const UserContext = createContext<UserCredentials | undefined>({
  user: undefined,
  token: undefined,
  isLogged: false,
});

const Stack = createStackNavigator();

export default function App() {
  const [userCredentials, setUserCredentials] = useState<UserCredentials>();
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

  const handlerUser = (userCredentials: UserCredentials) => {
    setUserCredentials(userCredentials);
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

  return (
    <>
      {userCredentials && userCredentials.isLogged ? (
        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          <UserContext.Provider value={userCredentials}>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="PokeList"
                  options={{
                    ...headerOptions,
                    title: "POKEDEX",
                    headerShown: !isAppLoading,
                  }}
                >
                  {(props) => (
                    <PokeList {...props} setIsAppLoading={setIsAppLoading} />
                  )}
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
                      setIsAppLoading={setIsAppLoading}
                    />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          </UserContext.Provider>
        </IconComponentProvider>
      ) : (
        // <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        //   <UserContext.Provider value={userCredentials}>
        //     <NavigationContainer>
        //       <Stack.Navigator>
        //         <Stack.Screen
        //           name="PokeList"
        //           options={{
        //             ...headerOptions,
        //             title: "POKEDEX",
        //             headerShown: !isAppLoading,
        //           }}
        //         >
        //           {(props) => (
        //             <PokeList {...props} setIsAppLoading={setIsAppLoading} />
        //           )}
        //         </Stack.Screen>

        //         <Stack.Screen
        //           name="PokePerfil"
        //           component={PokePerfil}
        //           options={{ ...headerOptions, title: "DETAILS" }}
        //         />
        //       </Stack.Navigator>
        //     </NavigationContainer>
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
