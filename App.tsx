import "react-native-gesture-handler";
import { IconComponentProvider } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RoutesDrawer from "./routes/routes-drawer-index";
import { DeviceEventEmitter } from "react-native";
import { UserCredentials } from "./service/api/types/User";
import { UserContext } from "./contexts/UserContext";
import { PokemonTrainer } from "./service/api/types/PokemonTrainer";
import { PokeballTypeEnum, PokemonForBattle } from "./service/api/types/PokemonForBattle";
import { Audio } from 'expo-av';
import { MusicName } from "./service/api/types/Music";
import RoutesStackLogin from "./routes/routes-stack-index";


export default function App() {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false);
  const [isBattling, setIsBattling] = useState<boolean>(true);
  const [userCredentials, setUserCredentials] = useState<UserCredentials | undefined>();  
  const [userPokemonTrainer, setUserPokemonTrainer] = useState<PokemonTrainer>({
    name: 'SIMAS', // TODO: retirar isso dps de testar
    pokemons: [],
    favoritePokemons: [],
    image: undefined,
    money: 1000,
    level: 1,
    items:[
      {
        name: 'Potion',
        category: "Heal",
        quantity: 3,
        price: 300
      },
      {
        name: 'Super Potion',
        category: "Heal",
        quantity: 0,
        price: 500
      },
      {
        name: 'Hyper Potion',
        category: "Heal",
        quantity: 0,
        price: 1200
      },
      {
        name: 'Death Potion',
        category: "Heal",
        quantity: 1,
        price: 2600
      },
      {
        name: 'Pokeball',
        category: "Pokeball",
        quantity: 5,
        price: 200
      },
      {
        name: 'Great Ball',
        category: "Pokeball",
        quantity: 2,
        price: 600
      },
      {
        name: 'Ultra Ball',
        category: "Pokeball",
        quantity: 1,
        price: 800
      },
      {
        name: 'Master Ball',
        category: "Pokeball",
        quantity: 200,
        price: 2000
      },
    ]
  });

  const handlerUser = (userCredentials: UserCredentials) => {
    setUserCredentials(userCredentials);
    setUserPokemonTrainer({
      name: 'SIMAS',
      pokemons: [],
      favoritePokemons:[],
      image: undefined,
      items:[],
      money: 0,
      level: 1,
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
    let tempFav = userPokemonTrainer.favoritePokemons;
    
    temp.push({
      id: pokemon.id,
      hp: pokemon.hp,
      hpTotal: pokemon.hpTotal,
      level: pokemon.level,
      levelXp: pokemon.level * 100,
      name: pokemon.name,
      nickname: pokemon.nickname,
      skills: pokemon.skills,
      sprites: pokemon.sprites,
      type: pokemon.type,
      pokeball: chosenPokeball,
      shiny : pokemon.shiny
    });

    if(userPokemonTrainer.pokemons.length > 0 && userPokemonTrainer.favoritePokemons.length < 2){

      tempFav.push({
        id: pokemon.id,
        hp: pokemon.hp,
        hpTotal: pokemon.hpTotal,
        level: pokemon.level,
        levelXp: pokemon.level * 100,
        name: pokemon.name,
        nickname: pokemon.nickname,
        skills: pokemon.skills,
        sprites: pokemon.sprites,
        type: pokemon.type,
        pokeball: chosenPokeball,
        shiny : pokemon.shiny
      });

      setUserPokemonTrainer((prevState) => {
        return {
          ...prevState,
          money: prevState.money + moneyReward,
          pokemons: temp,
          favoritePokemons: [temp[0], ...tempFav],
        };
      });
    }
    else{
      setUserPokemonTrainer((prevState) => {
        return {
          ...prevState,
          money: prevState.money + moneyReward,
          pokemons: temp,
        };
      });
    }

  };

  const handleChooseOtherPokemon = (pokemon: PokemonForBattle) => {
    let temp = userPokemonTrainer.pokemons;
    
    temp.splice(userPokemonTrainer.pokemons.findIndex(item => item === pokemon), 1)
    temp.unshift(pokemon);

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
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

  const handleChooseNewProfilePic = (image: string) => {
    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        image: image,
      };
    });
  }

  const handleHealPokemon = (position: number, potionName: string) => {
    if(potionName === 'Death Potion') { // APENAS PRA DEBUG
      let tempPokemons = userPokemonTrainer.pokemons;
      tempPokemons[position].hp = 1;
  
      let tempItems = userPokemonTrainer.items;
      tempItems[tempItems.findIndex(x=> x.name === potionName)].quantity -= 1;
  
      setUserPokemonTrainer((prevState) => {
        return {
          ...prevState,
          pokemons: tempPokemons,
          items: tempItems
        };
      });  
    }
    else{

      let tempPokemons = userPokemonTrainer.pokemons;
      const hpUp = 
        potionName === 'Hyper Potion' ? tempPokemons[position].hpTotal * 1 :
        potionName === 'Super Potion' ? tempPokemons[position].hpTotal * 0.60  : 
        tempPokemons[position].hpTotal * 0.30;

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
    }
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

  const handleBuyItemPokemon = (itemName: string, price: number) => {
    let tempItems = userPokemonTrainer.items;
    tempItems[tempItems.findIndex(x=> x.name === itemName)].quantity += 1;

    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        items: tempItems,
        money: userPokemonTrainer.money - price
      };
    });
  };

  const handleReward = (moneyReward: number) => {
    setUserPokemonTrainer((prevState) => {
      return {
        ...prevState,
        money: userPokemonTrainer.money + moneyReward
      };
    });
  };


  const [soundDefault, setSoundDefault] = useState<any>();

  const playSoundDefault = async (name: MusicName) => {    

    const { sound } = await Audio.Sound.createAsync(
      name === 'battle' ? require('./assets/musics/battle.mp3') :
      name === 'chooseFirstPokemon' ? require('./assets/musics/researchLab.mp3') :
      name === 'lavender' ? require('./assets/musics/lavender.mp3') :
      name === 'pokedex' ? require('./assets/musics/defaultPalletTown.mp3')
      : require('./assets/musics/defaultPalletTown.mp3'));

    if(name === 'turnOff'){
      setSoundDefault(sound);
      await sound.stopAsync();
    } 
    else {
      sound.setVolumeAsync(0.5);
      sound.setIsLoopingAsync(true);
      setSoundDefault(sound);
      await sound.playAsync();
    }   
  }

  useEffect(() => {
    return soundDefault
    ? () => {
      soundDefault.unloadAsync();
    }
    : undefined;
  }, [soundDefault]);




  DeviceEventEmitter.addListener("event.handleActivateNavigatorBar", (value) =>
    setIsAppLoading(value)
  );

  return (
    <>
      {userCredentials && userCredentials.isLogged ? (
        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          <UserContext.Provider value={userCredentials}>
            <RoutesDrawer
              isLogin={false}
              handleChooseNewProfilePic={(image: string) => handleChooseNewProfilePic(image)}
              handleReward={(moneyReward: number) => handleReward(moneyReward)}
              handleBuyItemPokemon={(itemName: string, price: number) => handleBuyItemPokemon(itemName, price)}
              isBattling={isBattling}
              setIsBattling={setIsBattling}
              playSoundDefault={(name: MusicName) => playSoundDefault(name)}
              handleHealBattlingPokemons={() => handleHealBattlingPokemons()}
              handleUsePokeball={(pokeballName: string) => handleUsePokeball(pokeballName)}
              handleHealPokemon={(position: number, potionName: string) => handleHealPokemon(position, potionName)}
              handleCapturePokemon={(pokemon : PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => handleCapturePokemon(pokemon, moneyReward, chosenPokeball)}
              handleChooseOtherPokemon={(pokemon : PokemonForBattle) => handleChooseOtherPokemon(pokemon)}
              handleSetPokemonBattling={(pokemon : PokemonForBattle, position : number) => handleSetPokemonBattling(pokemon, position)}
              handlerUser={(userLogin: UserCredentials) => handlerUser(userLogin)}
              userPokemonTrainer={userPokemonTrainer}
              isAppLoading={isAppLoading}
            />
          </UserContext.Provider>
        </IconComponentProvider>
      ) : (
          // <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          //   <UserContext.Provider value={userCredentials}>
          //     <Routes
          //       handleChooseNewProfilePic={(image: string) => handleChooseNewProfilePic(image)}
          //       handleReward={(moneyReward: number) => handleReward(moneyReward)}
          //       handleBuyItemPokemon={(itemName: string, price: number) => handleBuyItemPokemon(itemName, price)}
          //       isBattling={isBattling}
          //       setIsBattling={setIsBattling}              
          //       playSoundDefault={(name: MusicName) => playSoundDefault(name)}
          //       handleHealBattlingPokemons={() => handleHealBattlingPokemons()}
          //       handleUsePokeball={(pokeballName: string) => handleUsePokeball(pokeballName)}
          //       handleHealPokemon={(position: number, potionName: string) => handleHealPokemon(position, potionName)}
          //       handleCapturePokemon={(pokemon : PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => handleCapturePokemon(pokemon, moneyReward, chosenPokeball)}
          //       handleChooseOtherPokemon={(pokemon : PokemonForBattle) => handleChooseOtherPokemon(pokemon)}
          //       handleSetPokemonBattling={(pokemon : PokemonForBattle, position : number) => handleSetPokemonBattling(pokemon, position)}
          //       handlerUser={() => handlerUser} 
          //       userPokemonTrainer={userPokemonTrainer} 
          //       isAppLoading={isAppLoading}
          //     />
          //   </UserContext.Provider>
          // </IconComponentProvider>

        <IconComponentProvider IconComponent={MaterialCommunityIcons}>
          <UserContext.Provider value={userCredentials}>
            <RoutesStackLogin
              handlerUser={handlerUser}
              isAppLoading={isAppLoading}                
            >
            </RoutesStackLogin>
          </UserContext.Provider>
        </IconComponentProvider>
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
