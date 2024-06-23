import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import PokeList from "../views/PokeList/PokeList";
import PokePerfil from "../views/PokePerfil/PokePerfil";
import React from "react";
import { Icon, Text } from "@react-native-material/core";
import { UserCredentials } from "../service/api/types/User";
import PokeBattle from "../views/PokeBatte/PokeBattle";
import { PokemonTrainer } from "../service/api/types/PokemonTrainer";
import { PokeballTypeEnum, PokemonForBattle } from "../service/api/types/PokemonForBattle";
import { MusicName } from "../service/api/types/Music";
import { View } from "react-native";
import PokeManagement from "../views/PokeManagement/PokeManagement";
import PokeTrainer from "../views/PokeTrainer/PokeTrainer";
import PokeStore from "../views/PokeStore/PokeStore";

const Drawer = createDrawerNavigator();

export type DrawerRoutesProps = {
  isAppLoading: boolean;
  userPokemonTrainer: PokemonTrainer;
  isBattling: boolean;
  setIsBattling: (value: boolean) => void;
  handleReward: (moneyReward: number) => void;
  playSoundDefault: (name: MusicName) => void;
  handleHealBattlingPokemons: () => void;
  handlerUser: (userLogin: UserCredentials) => void;
  handleUsePokeball: (pokeballName : string) => void;
  handleSetPokemonBattling: (pokemon: PokemonForBattle, position: number) => void;
  handleHealPokemon: (position : number, potionName: string) => void;
  handleCapturePokemon: (pokemon: PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => void;
  handleChooseOtherPokemon: (pokemon: PokemonForBattle) => void;
  handleBuyItemPokemon: (itemName: string, price: number) => void; 
};

export type CustomDrawerContentProps = {
  handlerUser: (userLogin: UserCredentials) => void;
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


function CustomDrawerContent(cProps: any) {
  
  const handleLogout = () => {
    cProps.handlerUser({
      user: undefined,
      token: undefined,
      isLogged: false,
    });
  }
  
  return (
    <DrawerContentScrollView {...cProps}>
      <DrawerItemList state={cProps.state} navigation={cProps.navigation} descriptors={cProps.descriptors} {...cProps} />
      <DrawerItem       
        label={() => 
          <Text style={{ color: '#ED5463', fontWeight: '600', fontSize: 15}}>Logout</Text>
        }
        icon={({ focused, color, size }) => 
          <Icon color={'#ED5463'} size={size} name={'logout'} /> 
          }
        style={{backgroundColor: '#fff'}} 
        onPress={() => handleLogout()}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerRoutes(cProps: DrawerRoutesProps) {

  return (
    <>
    <Drawer.Navigator
      drawerContent={props => 
        <CustomDrawerContent 
          handlerUser={(userLogin: UserCredentials) => cProps.handlerUser(userLogin)}
          {...props}
        />
      }
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
        {(props) => <PokeList          
          playSoundDefault={(name: MusicName) => cProps.playSoundDefault(name)}
          userPokemons={cProps.userPokemonTrainer.pokemons}
          userPokemonIds={cProps.userPokemonTrainer.pokemons.map(x=> x.id)}
          navigation={props.navigation} 
          />}
    </Drawer.Screen>

      <Drawer.Screen
        name="PokeBattle"
        options={{
          headerTitle: "BATTLE",
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="controller-classic-outline"
              color={"#ed5463"}
              size={size}
            />
          ),
          drawerLabel: "Battle",
          drawerLabelStyle: {
            color: "#ed5463",
            textTransform: "capitalize",
          },
        }}
      >
        {(props) => 
          <PokeBattle
            isBattling={cProps.isBattling}
            setIsBattling={cProps.setIsBattling}
            handleReward={(moneyReward: number) => cProps.handleReward(moneyReward)}
            playSoundDefault={(name: MusicName) => cProps.playSoundDefault(name)}
            handleHealBattlingPokemons={() => cProps.handleHealBattlingPokemons()}
            handleCapturePokemon={(pokemon: PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => cProps.handleCapturePokemon(pokemon, moneyReward, chosenPokeball)} 
            handleChooseOtherPokemon={(pokemon: PokemonForBattle) => cProps.handleChooseOtherPokemon(pokemon)} 
            handleUsePokeball={(pokeballName: string) => cProps.handleUsePokeball(pokeballName)} 
            handleHealPokemon={(position: number, potionName: string) => cProps.handleHealPokemon(position, potionName)} 
            handleSetPokemonBattling={(pokemon: PokemonForBattle, position: number) => cProps.handleSetPokemonBattling(pokemon, position)} 
            userPokemonTrainer={cProps.userPokemonTrainer}
            navigation={props.navigation} 
          />
        }
      </Drawer.Screen>

      <Drawer.Screen
        name="MyPokemons"
        options={{
          headerTitle: "My Pokemons",
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="pokemon-go"
              color={"#ed5463"}
              size={size}
            />
          ),
          drawerLabel: "My Pokemons",
          drawerLabelStyle: {
            color: "#ed5463",
            textTransform: "capitalize",
          },
        }}
      >
        {(props) => 
          <PokeManagement
            isBattling={cProps.isBattling}
            playSoundDefault={(name: MusicName) => cProps.playSoundDefault(name)}
            handleSetToBattlePokemon={(pokemon: PokemonForBattle) => cProps.handleChooseOtherPokemon(pokemon)} 
            handleHealPokemon={(position: number, potionName: string) => cProps.handleHealPokemon(position, potionName)} 
            userPokemonTrainer={cProps.userPokemonTrainer}
            navigation={props.navigation} 
          />
        }
      </Drawer.Screen>

      <Drawer.Screen
        name="Store"
        options={{
          headerTitle: "Store",
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="store-outline"
              color={"#ed5463"}
              size={size}
            />
          ),
          drawerLabel: "Store",
          drawerLabelStyle: {
            color: "#ed5463",
            textTransform: "capitalize",
          },
        }}
      >
        {(props) => 
          <PokeStore
            handleBuyItemPokemon={(itemName: string, price: number) => cProps.handleBuyItemPokemon(itemName, price)}
            playSoundDefault={(name: MusicName) => cProps.playSoundDefault(name)}
            userPokemonTrainer={cProps.userPokemonTrainer}
            navigation={props.navigation} 
          />
        }
      </Drawer.Screen>

      <Drawer.Screen
        name="Trainer"
        options={{
          headerTitle: "Trainer",
          drawerIcon: ({ size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={"#ed5463"}
              size={size}
            />
          ),
          drawerLabel: "Trainer",
          drawerLabelStyle: {
            color: "#ed5463",
            textTransform: "capitalize",
          },
        }}
      >
        {(props) => 
          <PokeTrainer
            playSoundDefault={(name: MusicName) => cProps.playSoundDefault(name)}
            userPokemonTrainer={cProps.userPokemonTrainer}
            navigation={props.navigation} 
          />
        }
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
</>
);
}
