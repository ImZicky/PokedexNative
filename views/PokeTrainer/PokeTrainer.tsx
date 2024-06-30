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
import PokeCardFavorite from "../../components/cards/PokeCardFavorite";

export type PokeTrainerProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  playSoundDefault: (name: MusicName) => void;
};

function PokeTrainer(props: PokeTrainerProps) {
  const [loading, setLoading] = useState<boolean>(false);

  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      backgroundColor: "#ed5463",
      alignItems: 'center',
    },
    modalViewModal: {
      borderColor: "#c52222",
      borderStyle: "solid", 
      borderWidth: 5,
      backgroundColor: '#FFF',
      borderRadius: 20,
      marginTop: 5,
      paddingTop: 15,
      paddingBottom: 15,
      alignItems: 'center',
    },
    scrollview: {
      width: "98%",
      height: "100%",
    },
  });

  return (
    <>
      {!loading ? (
        <View style={styles.view}>
          <ScrollView style={styles.scrollview}>
            <View style={styles.modalViewModal}>
              <Image 
                style={{width: 100, height: 100, marginBottom: 20, borderRadius: 100, borderColor: "#c52222", borderWidth: 3}} 
                source={{
                  uri: 'https://yt3.ggpht.com/rWzYIBTtR8oAjk1LBwBglCFxLSZ4JJAHy5m2ZbzovSVmxR4TmKGfBoOqWqlADMD9xkEdjNdhAQ=s108-c-k-c0x00ffffff-no-rj',
                }}
              />
              <View style={{position: "absolute", top: 90, left: 180}}>
                <PokeIconButton 
                  color="#FFF" 
                  styleType="fire" 
                  icon="camera-outline" 
                  variant="text" 
                  onClick={() => alert(`${props.userPokemonTrainer.favoritePokemons.length}`)} 
                />
              </View>

              <PokeText 
                text={props.userPokemonTrainer.name} 
                color={"#c52222"} 
                type={"h2"} 
              />

              <View style={{marginTop: -25}}>
                <PokeText 
                  text={`P$ ${props.userPokemonTrainer.money} | Lv: ${props.userPokemonTrainer.level}`} 
                  color={"#c52222"} 
                  type={"card-text"} 
                />
              </View>

              <View style={{marginTop: 15}}>
                <PokeText color="#c52222" type="skill-name" text={`- Infos -`} />
              </View>
        
              <View style={{marginTop: 10}}>
                <PokeText text={`> Total captured pokemons: ${props.userPokemonTrainer.pokemons.length}`} color={"#c52222"} type={"card-text"} />
                <PokeText text={`> Total times got defeated: 0`} color={"#c52222"} type={"card-text"} />
                <PokeText text={`> Total winnings: 0`} color={"#c52222"} type={"card-text"} />
                <PokeText text={`> Total solded pokemons: 0`} color={"#c52222"} type={"card-text"} />
                <PokeText text={`> Total money earned: 0`} color={"#c52222"} type={"card-text"} />
              </View>


              <View style={{marginTop: 10}}>
                <PokeText color="#c52222" type="skill-name" text={`- Favs -`} />
              </View>

              <View style={{width: "97%", marginTop: 20}}>              
                <Wrap>
                  {
                    props.userPokemonTrainer.favoritePokemons && props.userPokemonTrainer.favoritePokemons.map((p, i) => (
                      <Box w={165} style={{marginTop: 20}} key={`fav_${i}_pokemon`}>
                        <PokeCardFavorite pokemon={p}/>
                      </Box>
                    ))
                  }
                </Wrap>
              </View>

            </View>

          </ScrollView>
        </View>
        ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeTrainer;

