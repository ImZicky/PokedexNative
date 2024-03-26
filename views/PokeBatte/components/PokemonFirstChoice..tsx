import React, { useEffect, useState } from "react";
import { PokemonTrainer } from "../../../service/api/types/PokemonTrainer";
import { Pokemon } from "pokenode-ts";
import { usePokemonService } from "../../../service/api/PokemonService";
import {
  Text,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
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
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

export type PokemonFirstChoiceProps = {
  trainer: PokemonTrainer;
  setHaveAPokemonForBattle: (value: boolean) => void;
};

function PokemonFirstChoice(props: PokemonFirstChoiceProps) {
  //Consts
  const [pokemonList, setPokemonList] = useState<Pokemon[] | undefined>();
  const [chosenPokemon, setChosenPokemon] = useState<Pokemon | undefined>();
  const [nickname, setNickname] = useState<string | undefined>();
  const [openChoosePokemonModal, setOpenChoosePokemonModal] =
    useState<boolean>(false);
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
        setPokemonList(data);
        setLoading(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChoosePokemon = (
    pokemonApi: Pokemon | undefined,
    nickname: string | undefined
  ) => {
    if (pokemonApi) {
      pokemonService
        .getPokemonEnemyForBattle(pokemonApi, 10, nickname ?? "")
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
                          uri: `${commonService.getPokemonMainImage(chosenPokemon?.sprites)}`
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

                <Wrap w={220}>
                <Box w={100} mr={20}>
                  <PokeButton
                    styleType=""
                    variant="contained"
                    size="fullwidth"
                    text="Cancel"
                    onClick={() => setOpenChoosePokemonModal(false)}
                    />
                </Box>
                <Box w={100}>
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
        </View>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokemonFirstChoice;
