import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { usePokemonService } from "../../service/api/PokemonService";
import UseUserService from "../../service/api/UserService";
import { useCommonService } from "../../service/common/CommonService";
import { Pokemon } from "pokenode-ts";
import { Box, Flex, Wrap } from "@react-native-material/core";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";

export type PokeDashProps = {};

function PokeDash(props: PokeDashProps) {
  //Consts
  const [pokemonList, setPokemonList] = useState<Pokemon[] | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();
  const userService = UseUserService();

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      pokemonService
        .getPokemonListPagination(pageNumber, pageSize)
        .then((data) => {
          setPokemonList(data);
        })
        .catch((error) => console.error(error));
    };
    if (pokemonList === undefined) fetchPokemon();
  });

  //Style
  const styles = StyleSheet.create({
    view: {
      backgroundColor: "#000",
      width: "100%",
      height: "100%",
    },
    scrollview: {
      width: "100%",
      height: "100%",
      padding: 10,
      backgroundColor: "#000",
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { padding: 20, width: 180, height: 180 },
  });

  return (
    <View style={styles.view}>
      {pokemonList ? (
        <ScrollView style={styles.scrollview}>
          <Wrap m={4} spacing={4}>
            {pokemonList.map((pokemon, i) => (
              <Box
                key={i}
                style={{
                  width: 180,
                  height: 300,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                }}
              >
                <Flex style={styles.centeredDiv}>
                  <Image
                    style={styles.headerImage}
                    source={{
                      uri: `${commonService.getPokemonMainImage(
                        pokemon.sprites
                      )}`,
                    }}
                  />
                </Flex>
                <PokeText color="#000" type="h1" text={pokemon.name} />
              </Box>
            ))}
          </Wrap>
        </ScrollView>
      ) : (
        <PokeLoading />
      )}
    </View>
  );
}

export default PokeDash;
