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
import { PokemonForBattle } from "./service/api/types/PokemonForBattle";

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

  const handleSetPokemonBattling = (pokemon: PokemonForBattle, position: number) => {
    let temp = userPokemonTrainer.pokemons;
    temp[position] = pokemon;
    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        pokemons: temp,
      };
    });
  };

  const handleCapturePokemon = (pokemon: PokemonForBattle) => {
    let temp = userPokemonTrainer.pokemons;
    temp.push(pokemon);
    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        pokemons: temp,
      };
    });
  };

  const handleCureBattlingPokemons = () => {
    let temp = userPokemonTrainer.pokemons;

    for(let i = 0; i < 5; i++){
      if(temp[i] !== undefined){
        if(temp[i].hp === 0){
          temp[i].hp = 100;
          temp[i].skills.forEach((s) => {
            s.ppNow = s.ppTotal;
          });
        }
      }
    };

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        pokemons: temp,
      };
    });
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
              handleCureBattlingPokemons={() => handleCureBattlingPokemons()}
              handleCapturePokemon={(pokemon : PokemonForBattle) => handleCapturePokemon(pokemon)}
              handleSetPokemonBattling={(pokemon : PokemonForBattle, position : number) => handleSetPokemonBattling(pokemon, position)}
              handlerUser={(userLogin: UserCredentials) => handlerUser(userLogin)}
              userPokemonTrainer={userPokemonTrainer}
              isAppLoading={isAppLoading}
            />
          </UserContext.Provider>
        </IconComponentProvider>
      ) : (
          <IconComponentProvider IconComponent={MaterialCommunityIcons}>
            <UserContext.Provider value={userCredentials}>
              <Routes
                handleCureBattlingPokemons={() => handleCureBattlingPokemons()}
                handleCapturePokemon={(pokemon : PokemonForBattle) => handleCapturePokemon(pokemon)}
                handleSetPokemonBattling={(pokemon : PokemonForBattle, position : number) => handleSetPokemonBattling(pokemon, position)}
                handlerUser={() => handlerUser} 
                userPokemonTrainer={userPokemonTrainer} 
                isAppLoading={isAppLoading}
              />
            </UserContext.Provider>
          </IconComponentProvider>

        // <View style={styles.container}>
        //   <IconComponentProvider IconComponent={MaterialCommunityIcons}>
        //     <UserContext.Provider value={userCredentials}>
        //       <PokeLogin
        //         handlerUser={(userLogin: UserCredentials) =>
        //           handlerUser(userLogin)
        //         }
        //       />
        //     </UserContext.Provider>
        //   </IconComponentProvider>
        // </View>
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
