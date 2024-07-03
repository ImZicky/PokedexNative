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
import * as ImagePicker from 'expo-image-picker';

export type PokeTrainerProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  playSoundDefault: (name: MusicName) => void;
  handleChooseNewProfilePic: (image: string) => void;
};

function PokeTrainer(props: PokeTrainerProps) {
  const [loading, setLoading] = useState<boolean>(false);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      props.handleChooseNewProfilePic(result.assets[0].base64);
    }
  };


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
                source={{ uri: props.userPokemonTrainer.image ? 'data:image/jpeg;base64,' + props.userPokemonTrainer.image : 'https://i.pinimg.com/originals/e3/af/9c/e3af9c7dc24b3fcb9b5f2d812d839783.jpg'}}
              />
              <View style={{position: "absolute", top: 90, left: 180}}>
                <PokeIconButton 
                  color="#FFF" 
                  styleType="fire" 
                  icon="camera-outline" 
                  variant="text" 
                  onClick={() => pickImage()} 
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


            {
              props.userPokemonTrainer.favoritePokemons && props.userPokemonTrainer.favoritePokemons.length > 0 && (
                <>
                  <View style={{marginTop: 10}}>
                    <PokeText color="#c52222" type="skill-name" text={`- Favs -`} />
                  </View>
                  <View style={{width: "97%", marginTop: 20}}>              
                    <Wrap>
                      {
                        props.userPokemonTrainer.favoritePokemons.map((p, i) => (
                          <Box w={165} style={{marginTop: 20}} key={`fav_${i}_pokemon`}>
                            <PokeCardFavorite pokemon={p}/>
                          </Box>
                        ))
                      }
                    </Wrap>
                  </View>
                </>
              )}
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

