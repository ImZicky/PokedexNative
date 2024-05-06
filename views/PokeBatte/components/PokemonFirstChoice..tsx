import React, { useEffect, useState } from "react";
import { PokemonTrainer } from "../../../service/api/types/PokemonTrainer";
import { Pokemon } from "pokenode-ts";
import { usePokemonService } from "../../../service/api/PokemonService";
import {
  Stack,
  Wrap,
  Box,
  Flex,
} from "@react-native-material/core";
import { Image, Modal, ScrollView, StyleSheet, View } from "react-native";
import PokeCardChoose from "../../../components/cards/PokeCardChoose";
import PokeLoading from "../../../components/loader/PokeLoading";
import PokeButton from "../../../components/buttons/PokeButton";
import PokeText from "../../../components/texts/PokeText";
import { useCommonService } from "../../../service/common/CommonService";
import PokeTextField from "../../../components/textfields/PokeTextField";
import { Audio } from 'expo-av';
import { MusicName } from "../../../service/api/types/Music";

export type PokemonFirstChoiceProps = {
  trainer: PokemonTrainer;
  setHaveAPokemonForBattle: (value: boolean) => void;
  playSoundDefault: (name: MusicName) => void;
};

function PokemonFirstChoice(props: PokemonFirstChoiceProps) {
  //Consts
  const [pokemonList, setPokemonList] = useState<Pokemon[] | undefined>();
  const [chosenPokemon, setChosenPokemon] = useState<Pokemon | undefined>();
  const [nickname, setNickname] = useState<string | undefined>();
  const [openChoosePokemonModal, setOpenChoosePokemonModal] = useState<boolean>(false);
  const [openFirstPokemonProfOakTutorial, setOpenFirstPokemonProfOakTutorial] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();

  //Methods
  const fetchPokemonList = async () => {
    setLoading(true);
    pokemonService
      .getPokemonInitials()
      .then((data) => {
        playSoundChoosePokemon()
        setPokemonList(data);
        setLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };


  const playSoundChoosePokemon = async () => {
    props.playSoundDefault('chooseFirstPokemon');
  }

  const handleChoosePokemon = (
    pokemonApi: Pokemon | undefined,
    nickname: string | undefined
  ) => {
    if (pokemonApi) {
      pokemonService
        .getPokemonForBattle(pokemonApi, props.trainer.level, nickname ?? "", true)
        .then((pokeForBattle) => {
          setOpenChoosePokemonModal(false);
          props.trainer.pokemons.push(pokeForBattle);
          props.setHaveAPokemonForBattle(true);
        });
    }
  };

  const handleChoosePokemonModal = (pokemonApi: Pokemon) => {
    setChosenPokemon(pokemonApi);
    setOpenChoosePokemonModal(true);
  };

  //UseEffect
  useEffect(() => {
    if (pokemonList === undefined) {
      fetchPokemonList();
    }
  }, []);

  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
      backgroundColor: "#ed5463",
    },
    scrollview: {
      width: "100%",
      height: "100%",
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 10,
      backgroundColor: "#ed5463",
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
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    centeredImageDivModal: {
      alignItems: "center",
      alignContent: "center",
      marginBottom: 20,
    },
    cardImageModal: { marginTop: 10, marginBottom: 30, padding: 20, width: 100, height: 100 },
  });

  return (
    <>
      {!loading ? (
        <View style={styles.view}>
          <ScrollView style={styles.scrollview}>
            <Wrap>
              {pokemonList &&
                pokemonList.map((pokemon) => (
                  <PokeCardChoose
                    key={`${pokemon.name}`}
                    pokemon={pokemon}
                    onChoose={(pokemon: Pokemon) =>
                      handleChoosePokemonModal(pokemon)
                    }
                  />
                ))}
            </Wrap>
          </ScrollView>

          <Modal
            animationType="slide"
            transparent            
            visible={openChoosePokemonModal}
            onRequestClose={() => {
              setOpenChoosePokemonModal(false);
            }}
          >
            <View style={styles.centeredViewModal}>
              <View style={styles.modalViewModal}>
                <Stack>
                {
                  chosenPokemon &&
                  <>
                    <PokeText
                      text={`Choose ${commonService.stringToCapitalLetters(chosenPokemon.name)}?`}
                      color="#000"
                      type="modal-title"
                      />

                    <Flex style={styles.centeredImageDivModal}>
                      <Image
                        style={styles.cardImageModal}
                        source={{
                          uri: `${commonService.getPokemonMainImageFrontForBattle(chosenPokemon?.sprites, true)}`
                        }}
                        />
                      <PokeTextField
                        color={commonService.getColorFromType(chosenPokemon.types[0].type.name)}
                        cursorColor={commonService.getColorFromType(chosenPokemon.types[0].type.name)}
                        variant="outlined"
                        label={"Nickname"}
                        placeholder="Nickname"
                        isReadOnly={false}
                        placeholderTextColor={commonService.getColorFromType(chosenPokemon.types[0].type.name)}
                        onChange={(val) => setNickname(val.trim())}
                        />
                    </Flex>
                  </>
                }

                </Stack>

                <Wrap w={240}>
                  <Box w={110} mr={20}>
                    <PokeButton
                      styleType=""
                      variant="contained"
                      size="fullwidth"
                      text="Cancel"
                      onClick={() => setOpenChoosePokemonModal(false)}
                      />
                  </Box>
                  <Box w={110}>
                    <PokeButton
                      styleType={chosenPokemon?.types[0].type.name ?? ""}
                      variant="contained"
                      size="fullwidth"
                      text="Choose"
                      onClick={() => handleChoosePokemon(chosenPokemon, nickname)}
                      />
                  </Box>
                </Wrap>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"            
            visible={openFirstPokemonProfOakTutorial}
            onRequestClose={() => {
              setOpenFirstPokemonProfOakTutorial(false);
            }}
          >
          <View style={styles.centeredViewModal}>
            <View style={styles.modalViewModal}>
              <PokeText 
                text={"Wellcome"}
                color={"#000000"}
                type={"modal-title"}
              />

              <Image 
                style={{marginBottom: 20}} 
                source={
                  require(`../../../assets/images/characters/oak-prof.gif`)
                }
              />

              <PokeText 
                text={"This is the Pokemon World and I'm Professor Oak, The most knowing Pokemon scientist nowadays, these are Pokemons and in this world you should catch them all, to start that, you have to choose your first Pokemon! Good Luck!"}
                color={"#000000"}
                type={"modal-text"}
              />

              <View style={{marginTop: 20}}/>
                <PokeButton
                  styleType={"primary"}
                  variant="contained"
                  size="fullwidth"
                  text="Start"
                  onClick={() => setOpenFirstPokemonProfOakTutorial(false)}
                />
              </View>
            </View>
          </Modal>


        </View>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokemonFirstChoice;
