import { Box, Chip, Divider, Flex, Wrap } from "@react-native-material/core";
import React, { useEffect, useLayoutEffect, useState } from "react";
import PokeText from "../../components/texts/PokeText";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { Pokemon, PokemonAbility } from "pokenode-ts";
import { useNavigation } from "@react-navigation/native";
import PokeButton from "../../components/buttons/PokeButton";
import { useCommonService } from "../../service/common/CommonService";
import PokeLoading from "../../components/loader/PokeLoading";
import { usePokemonService } from "../../service/api/PokemonService";
import { PokemonAbilityFull } from "../../service/api/types/PokemonAbilityFull";

export type PokePerfilProps = {
  route: any;
  navigation: any;
};

function PokePerfil(props: PokePerfilProps) {
  //States
  const [pokemon, setPokemon] = useState<Pokemon>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pokemonAbilities, setPokemonAbilities] = useState<
    PokemonAbilityFull[]
  >([]);

  // Services
  const commonService = useCommonService();
  const pokemonService = usePokemonService();

  //Navigation

  //Use Effect
  useEffect(() => {
    if (pokemon === undefined) {
      setIsLoading(true);
      const { pokemon } = props.route.params;
      setPokemon(pokemon as Pokemon);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async function () {
      if (pokemon) {
        let temp: PokemonAbilityFull[] = [];
        pokemon?.abilities.forEach((a: PokemonAbility) => {
          pokemonService.getAbilityDescription(a.ability.name).then((resp) => {
            if (!pokemonAbilities.find((x) => x.name === a.ability.name)) {
              temp.push({
                name: a.ability.name,
                description: resp ?? "--",
              });
            }
            setPokemonAbilities([...pokemonAbilities, ...temp]);
          });
        });
      }
    })();
  }, [pokemon]);

  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
      backgroundColor: "#ed5463",
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: { marginTop: 20, padding: 20, width: 200, height: 200 },
    infosGrid: {
      margin: 10,
      padding: 20,
      borderColor: "#ed5463",
      borderStyle: "solid",
      borderWidth: 4,
      borderRadius: 10,
    },
  });

  return (
    <View style={styles.view}>
      {pokemon ? (
        <Box
          style={{
            minWidth: 174,
            width: "auto",
            height: 330,
            backgroundColor: "#fff",
            borderRadius: 15,
            margin: 10,
            flex: 1,
          }}
        >
          <PokeText
            color="#000"
            type="card-id-big"
            text={`#${pokemon?.id.toString()}`}
          />
          <ScrollView>
            <Flex>
              <Flex style={styles.centeredDiv}>
                <Image
                  style={styles.cardImage}
                  source={{
                    uri: `${commonService.getPokemonMainPerfil(
                      pokemon.sprites
                    )}`,
                  }}
                />
              </Flex>
              <Flex style={styles.centeredDiv}>
                <PokeText
                  color="#000"
                  type="card-title-big"
                  text={pokemon.name}
                />
                <Wrap
                  spacing={5}
                  style={{
                    marginHorizontal: 2,
                  }}
                >
                  {pokemon.types.map(
                    (type: { type: { name: string } }, i: number) => (
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
                    )
                  )}
                </Wrap>

                <Wrap
                  style={{
                    marginTop: 10,
                  }}
                >
                  <PokeText color="#000" type="card-text-big" text="Height: " />
                  <PokeText
                    color="#000"
                    type="card-text-big"
                    text={commonService.getPokemonHeight(pokemon.height)}
                  />
                </Wrap>
                <Wrap
                  style={{
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                >
                  <PokeText
                    color="#000"
                    type="card-text-big"
                    text="Wheight: "
                  />
                  <PokeText
                    color="#000"
                    type="card-text-big"
                    text={commonService.getPokemonWheight(pokemon.weight)}
                  />
                </Wrap>
              </Flex>

              <Flex style={styles.infosGrid}>
                <Wrap
                  style={{
                    marginTop: 10,
                    marginBottom: 20,
                  }}
                >
                  {pokemonAbilities && (
                    <>
                      <PokeText
                        color="#000"
                        type="card-text-big"
                        text="Habilidades"
                      />
                      <View
                        style={{
                          width: "100%",
                          marginTop: 5,
                          marginBottom: 5,
                          borderBottomColor: "red",
                          borderBottomWidth: 3,
                        }}
                      />
                      {pokemonAbilities?.map((a, i) => (
                        <PokeText
                          key={`ability_name_${i}`}
                          color="#000"
                          type="card-text-big"
                          text={`${a.name.toUpperCase()}: ${a.description}`}
                        />
                      ))}
                    </>
                  )}
                </Wrap>
              </Flex>
            </Flex>
          </ScrollView>
        </Box>
      ) : (
        <PokeLoading loadType="component" />
      )}
    </View>
  );
}

export default PokePerfil;
