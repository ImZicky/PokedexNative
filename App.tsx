import { IconComponentProvider } from "@react-native-material/core";
import React, { createContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { User } from "./components/user/types/User";
import PokeDash from "./views/PokeDash/PokeDash";
import PokeLogin from "./views/PokeLogin/PokeLogin";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const UserContext = createContext<User | undefined>({
  email: "",
  name: "",
  isLogged: false,
});

export default function App() {
  const [user, setUser] = useState<User>();

  const handlerUser = (user: User) => {
    setUser(user);
  };

  return (
    <View style={styles.container}>
      <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        <UserContext.Provider value={user}>
          {user && user.isLogged ? (
            <PokeDash></PokeDash>
          ) : (
            <PokeLogin
              handlerUser={(user: User) => handlerUser(user)}
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
