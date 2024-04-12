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
import { PokeballTypeEnum, PokemonForBattle } from "./service/api/types/PokemonForBattle";

const Stack = createStackNavigator();

export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>();
  const [userPokemonTrainer, setUserPokemonTrainer] = useState<PokemonTrainer>({
    name: 'Lucas', // TODO: retirar isso dps de testar
    pokemons: [],
    money: 0,
    items:[
      {
        name: 'Potion',
        category: "Heal",
        quantity: 6,
      },
      {
        name: 'High Potion',
        category: "Heal",
        quantity: 5,
      },
      {
        name: 'Pokeball',
        category: "Pokeball",
        quantity: 10,
      },
      {
        name: 'Great Ball',
        category: "Pokeball",
        quantity: 16,
      },
      {
        name: 'Ultra Ball',
        category: "Pokeball",
        quantity: 14,
      },
      {
        name: 'Master Ball',
        category: "Pokeball",
        quantity: 10,
      },

    ]
  });

  const handlerUser = (userCredentials: UserCredentials) => {
    setUserCredentials(userCredentials);
    setUserPokemonTrainer({
      name: 'Lucas',
      pokemons: [],
      items:[],
      money: 0
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

  const handleCapturePokemon = (pokemon: PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => {
    let temp = userPokemonTrainer.pokemons;
    
    temp.push({
      id: pokemon.id,
      hp: pokemon.hp,
      hpTotal: pokemon.hpTotal,
      level: pokemon.level,
      name: pokemon.name,
      nickname: pokemon.nickname,
      skills: pokemon.skills,
      sprites: pokemon.sprites,
      type: pokemon.type,
      pokeball: chosenPokeball
    });

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        money: prevState.money + moneyReward,
        pokemons: temp,
      };
    });
  };

  const handleHealBattlingPokemons = () => {
    let temp = userPokemonTrainer.pokemons;

    for(let i = 0; i < 5; i++){
      if(temp[i] !== undefined){
        if(temp[i].hp === 0){
          temp[i].hp = temp[i].hpTotal;
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

  const handleHealPokemon = (position: number, potionName: string) => {
    let tempPokemons = userPokemonTrainer.pokemons;
    const hpUp = potionName === 'High Potion' ? 60 : 30;
    tempPokemons[position].hp = 
      tempPokemons[position].hp + hpUp < tempPokemons[position].hpTotal ? tempPokemons[position].hp + hpUp : tempPokemons[position].hpTotal;

    let tempItems = userPokemonTrainer.items;
    tempItems[tempItems.findIndex(x=> x.name === potionName)].quantity -= 1;

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        pokemons: tempPokemons,
        items: tempItems
      };
    });
  };

  const handleUsePokeball = (pokeballName: string) => {
    let tempItems = userPokemonTrainer.items;
    tempItems[tempItems.findIndex(x=> x.name === pokeballName)].quantity -= 1;

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        items: tempItems
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

              handleHealBattlingPokemons={() => handleHealBattlingPokemons()}
              handleUsePokeball={(pokeballName: string) => handleUsePokeball(pokeballName)}
              handleHealPokemon={(position: number, potionName: string) => handleHealPokemon(position, potionName)}
              handleCapturePokemon={(pokemon : PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => handleCapturePokemon(pokemon, moneyReward, chosenPokeball)}
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
                handleHealBattlingPokemons={() => handleHealBattlingPokemons()}
                handleUsePokeball={(pokeballName: string) => handleUsePokeball(pokeballName)}
                handleHealPokemon={(position: number, potionName: string) => handleHealPokemon(position, potionName)}
                handleCapturePokemon={(pokemon : PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => handleCapturePokemon(pokemon, moneyReward, chosenPokeball)}
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
