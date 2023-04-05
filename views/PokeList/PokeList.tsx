import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Image } from "react-native";
import { usePokemonService } from "../../service/api/PokemonService";
import UseUserService from "../../service/api/UserService";
import { useCommonService } from "../../service/common/CommonService";
import { Pokemon } from "pokenode-ts";
import { Box, Chip, Flex, Wrap } from "@react-native-material/core";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";

export type PokeDashProps = {};

function PokeDash(props: PokeDashProps) {
  //Consts
  const [pokemonList, setPokemonList] = useState<Pokemon[] | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(19);
  const [pageSize, setPageSize] = useState<number>(30);

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
      backgroundColor: "#FFF",
      width: "100%",
      height: "100%",
    },
    header: {
      paddingTop: 20,
      height: 250,
      marginBottom: 10,
      backgroundColor: "#FFF",
      borderRadius: 20,
    },
    scrollview: {
      width: "100%",
      height: "100%",
      padding: 10,
      backgroundColor: "#00F",
      paddingBottom: 50,
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    headerImage: { marginTop: 20, padding: 20, width: 100, height: 100 },
  });

  return (
    <View style={styles.view}>
      {pokemonList ? (
        <ScrollView style={styles.scrollview}>
          <Flex style={styles.header}>
            <Flex style={styles.centeredDiv}>
              <PokeText text="POKEDEX" color={"#00F"} type={"h1"} />
              <Image
                style={styles.headerImage}
                source={require("../../assets/images/pokeball-loader.gif")}
              />
            </Flex>
          </Flex>
          <Wrap
            spacing={4}
            style={{
              marginHorizontal: 8,
            }}
          >
            {pokemonList.map((pokemon, i) => (
              <Box
                key={`${pokemon.name}`}
                style={{
                  width: 180,
                  height: 400,
                  backgroundColor: "#fff",
                  borderRadius: 15,
                }}
              >
                <PokeText
                  color="#000"
                  type="card-id"
                  text={`#${pokemon.id.toString()}`}
                />

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
                <Flex style={styles.centeredDiv}>
                  <PokeText
                    color="#000"
                    type="card-title"
                    text={pokemon.name}
                  />
                  <Wrap
                    spacing={5}
                    style={{
                      marginHorizontal: 2,
                    }}
                  >
                    {pokemon.types.map((type, i) => (
                      <Chip
                        key={`${pokemon.name}_type_${type.type.name}`}
                        style={{
                          backgroundColor: commonService.getColorFromType(
                            type.type.name
                          ),
                        }}
                        color="#FFF"
                        label={type.type.name.toUpperCase()}
                      />
                    ))}
                  </Wrap>

                  <Wrap
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <PokeText color="#000" type="card-text" text="Altura: " />
                    <PokeText
                      color="#000"
                      type="card-text"
                      text={commonService.getPokemonHeight(pokemon.height)}
                    />
                  </Wrap>
                  <Wrap
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <PokeText color="#000" type="card-text" text="Peso: " />
                    <PokeText
                      color="#000"
                      type="card-text"
                      text={commonService.getPokemonWheight(pokemon.weight)}
                    />
                  </Wrap>
                </Flex>
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
