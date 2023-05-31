import { IconComponentProvider } from "@react-native-material/core";
import React, { createContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { UserCredentials } from "./service/api/types/User";
import PokeList from "./views/PokeList/PokeList";
import PokeLogin from "./views/PokeLogin/PokeLogin";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const UserContext = createContext<UserCredentials | undefined>({
  user: undefined,
  token: undefined,
  isLogged: false,
});

export default function App() {
  const [userCredentials, setUserCredentials] = useState<UserCredentials>();

  const handlerUser = (userCredentials: UserCredentials) => {
    setUserCredentials(userCredentials);
  };

  return (
    <View style={styles.container}>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <UserContext.Provider value={userCredentials}>
          {userCredentials && userCredentials.isLogged ? (
            <PokeList></PokeList>
          ) : (
            // <PokeList></PokeList>
            <PokeLogin
              handlerUser={(userLogin: UserCredentials) =>
                handlerUser(userLogin)
              }
            ></PokeLogin>
          )}
        </UserContext.Provider>
      </IconComponentProvider>
    </View>
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
