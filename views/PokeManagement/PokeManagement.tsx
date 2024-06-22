import React, { useEffect, useState } from "react";
import { Box, Flex, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, Modal, ScrollView } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokeballTypeEnum, PokemonForBattle, PokemonForBattleSkills } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer, PokemonTrainerItem } from "../../service/api/types/PokemonTrainer";
import { Audio } from 'expo-av';
import { MusicName } from "../../service/api/types/Music";
import PokeButton from "../../components/buttons/PokeButton";
import PokeIconButton from "../../components/buttons/PokeIconButton";
import PokeCardManagement from "../../components/cards/PokeCardManagement";

export type PokeManagementProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  handleSetToBattlePokemon: (pokemon : PokemonForBattle) => void;
  playSoundDefault: (name: MusicName) => void;
  handleHealPokemon: (position : number, potionName: string) => void;
};

function PokeManagement(props: PokeManagementProps) {
  //Services
  const commonService = useCommonService();

  //STATES
  const [loading, setLoading] = useState<boolean>(false);

  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
    },
    scrollview: {
      width: "100%",
      height: "100%",
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      backgroundColor: "#ed5463",
      marginBottom: 60,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },
  });

  return (
    <View style={[styles.view, props.userPokemonTrainer?.pokemons.length > 1 ? {backgroundColor : "#ed5463"} : {backgroundColor : "#fff"} ]}>
      {!loading ? (
        props.userPokemonTrainer?.pokemons.length > 1 ? 
        (
          <ScrollView style={styles.scrollview}>
            <Wrap>
              {
                props.userPokemonTrainer.pokemons.map((pokemon, i) => (
                  <PokeCardManagement handleSetToBattlePokemon={(pokemon: PokemonForBattle) => props.handleSetToBattlePokemon(pokemon)} handleHealPokemon={(position : number, potionName: string) => props.handleHealPokemon(position, potionName)} playSoundDefault={props.playSoundDefault} pokemon={pokemon} items={props.userPokemonTrainer.items} index={i} navigation={props.navigation}/>
                ))
              }
            </Wrap>
          </ScrollView>
        ):(                
          <ImageBackground  style={styles.image} source={require(`../../assets/images/battlefields/gameover.gif`)}>
            <View style={{margin: 20}}>
            <Image style={{width: 300, height: 255, top: -50, left: 10}} source={require(`../../assets/images/characters/no-pokemon.gif`)}/>
              <PokeText
                text={`No Pokemons`}
                color={"#000"}
                type={"gameover-title"}
                />
              <PokeText
                text={`You should try battling for catching them all`}
                color={"#000"}
                type={"modal-text"}
              />
            </View>
          </ImageBackground>
        )
      ) : (
        <PokeLoading loadType="page" />
      )}
    </View>
  );
}

export default PokeManagement;
