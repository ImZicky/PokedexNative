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
  const [openModalCantBuy, setOpenModalCantBuy] = useState<boolean>(false);


  //HANDLERS
  const handleBuyItem = (itemName: string, price: number) => {
    if(price <= props.userPokemonTrainer.money){
      props.handleBuyItemPokemon(itemName, price);
    }
    else{
      setOpenModalCantBuy(true);
    }
  }


  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      backgroundColor: "#ed5463",
      paddingBottom: 60,
    },
    scrollview: {
      width: "100%",
      height: "100%",
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },
    modalViewModal: {
      borderColor: "#4E6648",
      borderStyle: "solid", 
      borderWidth: 5,
      backgroundColor: '#FFF',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 15,
      alignItems: 'center',
    },
    playerInteractionsDivBorder: {
      zIndex: 15,
      padding: 5,
      width: "100%",
      height: 60,
      borderTopEndRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderTopStartRadius: 0,
      backgroundColor: "#4E6648"
    },
    playerInteractionsDivInfos: {
      padding: 10,
      width: "100%",
      height: 50,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderTopStartRadius: 10,
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#ECEDD0"
    },
    playerInteractionsDiv: {
      bottom: 0,
      width: "100%",
      position: "absolute",
      alignItems: "center",
      alignContent: "center",
    },    
    centeredViewModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
  });


  return (
    <View style={styles.view}>
          <ScrollView style={styles.scrollview}>
            <View style={styles.modalViewModal }>
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
            </ScrollView>

            {/* INFOS DIV */}
            <Flex style={styles.playerInteractionsDiv}>
              <View style={styles.playerInteractionsDivBorder}>
                <View style={styles.playerInteractionsDivInfos}>
                  <Wrap w={"100%"}>
                    <Box w={"100%"} style={{alignItems: "center"}}>
                      <PokeText
                        shadowColor="#4E6648"
                        hasShadow
                        color="#4E6648"
                        text={`P$ ${props.userPokemonTrainer.money}`}
                        type="skill-name"
                      />
                    </Box>
                  </Wrap>
                </View>
              </View>
            </Flex>

            {/* CAN'T BUY MODAL */}
            <Modal
              animationType="slide"
              transparent
              visible={openModalCantBuy}
              onRequestClose={() => {
                setOpenModalCantBuy(false);
              }}
            >
            <View style={styles.centeredViewModal}>
              <View style={[styles.modalViewModal, {borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5, paddingBottom: 20, borderRadius: 20}]}>
                  <PokeText 
                    text={"Not enough cash!"}
                    color={"#000000"}
                    type={"battle-card-infos"}
                  />
                  <View style={{marginTop: 50}}/>
                  <PokeButton
                    styleType={"menuGreen"}
                    variant="contained"
                    size="fullwidth"
                    text="Close"
                    color="white"
                    onClick={() => {
                      setOpenModalCantBuy(false);
                    }}
                  />
                </View>
              </View>
            </Modal>
    </View>
  );
}

export default PokeStore;
