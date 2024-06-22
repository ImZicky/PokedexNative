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

export type PokeStoreProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  playSoundDefault: (name: MusicName) => void;
  handleBuyItemPokemon: (itemName : string, price: number) => void;
};

function PokeStore(props: PokeStoreProps) {
  //Services
  const commonService = useCommonService();

  //STATES
  const [loading, setLoading] = useState<boolean>(false);


  //HANDLERS
  const handleBuyItem = (itemName: string, price: number) => {
    if(price <= props.userPokemonTrainer.money){
      props.handleBuyItemPokemon(itemName, price);
    }
    else{
      alert("modal pra avisar que tá pobre");
    }
  }

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
      marginBottom: 20,
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },    
    centeredViewModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalViewModal: {
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      }
    },

  });


  return (
    <View>
      
      {!loading ? (
          <ScrollView style={styles.scrollview}>
                <View style={styles.centeredViewModal}>
                  <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                    {
                      props.userPokemonTrainer.items.map((item, i) => (
                          <Wrap w="100%" key={`item-${i}`}>
                            <Box w="20%">
                              <Image
                                source={
                                  item.name === "Potion" ? require('../../assets/images/icons/potion-mini.png') :
                                  item.name === "Super Potion" ? require('../../assets/images/icons/super-potion-mini.png') :
                                  item.name === "Hyper Potion" ? require('../../assets/images/icons/hyper-potion-mini.png') :
                                  item.name === "Death Potion" ? require('../../assets/images/icons/death-potion-mini.png') :
                                  item.name === "Pokeball" ? require('../../assets/images/pokeballs/pokeball-mini.png') :
                                  item.name === "Great Ball" ? require('../../assets/images/pokeballs/greatBall-mini.png') :
                                  item.name === "Master Ball" ? require('../../assets/images/pokeballs/masterBall-mini.png') :
                                  item.name === "Ultra Ball" ? require('../../assets/images/pokeballs/ultraBall-mini.png') :
                                  require('../../assets/images/pokeballs/pokeball-mini.png')
                                }
                                style={{width: 35, height: 35}}
                              />
                            </Box>
                            <Box w="70%" mb={20}>
                              <PokeText 
                                text={`${commonService.stringToCapitalLetters(item.name)}`}
                                color={"#000000"}
                                type={"skill-name"}
                              />
                            <PokeText 
                              text={`x${item.quantity} | P$ ${item.price}`}
                              color={"#000000"}
                              type={"pp-text"}
                            />
                            </Box>
                            <Box w="10%">
                              <PokeIconButton
                                color="#fff"
                                styleType={"menuGreen"}
                                variant="contained"
                                icon="arrow-right"
                                onClick={() => handleBuyItem(item.name, item.price)}
                              />
                            </Box>
                          </Wrap>
                        ))}
                    </View>
                  </View>
          </ScrollView>        
      ) : (
        <PokeLoading loadType="page" />
      )}
    </View>
  );
}

export default PokeStore;
