import { Box, Flex, Wrap } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import PokeText from "../../components/texts/PokeText";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { Pokemon, PokemonAbility } from "pokenode-ts";
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
  const [pokemon, setPokemon] = useState<Pokemon | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pokemonAbilities, setPokemonAbilities] = useState<PokemonAbilityFull[]>([]);

  // Services
  const commonService = useCommonService();
  const pokemonService = usePokemonService();

  //Use Effect
  useEffect(() => {
    setIsLoading(true);
    const { pokemon } = props.route.params;

    setPokemon(pokemon as Pokemon);
    setIsLoading(false);
  }, [props.route.params.pokemon]);

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
      padding: 5
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: {
      marginTop: 10,
      width: 230, 
      height: 200,
    },
    infosGrid: {
      padding: 10,
      borderColor: "#ed5463",
      borderStyle: "solid",
      borderWidth: 4,
      borderRadius: 10,
    },
  });

  return (
    <View style={[styles.view, { backgroundColor: pokemon ? commonService.getColorFromType(pokemon.types[0].type.name) : "#000"}]}>
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
          <ScrollView>
            <Flex>
              <PokeText
                backgroungColor={pokemon ? commonService.getColorFromType(pokemon.types[0].type.name) : "#000"}
                color={"#ffffff"}
                type="card-id-big"
                text={`#${pokemon.id.toString()} `}
              />
              <Flex style={styles.centeredDiv}>
                <Image
                  style={styles.cardImage}
                  source={{
                    uri: `${commonService.getPokemonMainImageFrontForBattle(
                      pokemon.sprites
                    )}`,
                  }}
                />
              </Flex>
              <Flex style={styles.centeredDiv}>
                <PokeText
                  color="#000"
                  type="card-title-big"
                  // text={`${commonService.stringToCapitalLetters(pokemon.name)} #${pokemon.id.toString()}`}
                  text={`${commonService.stringToCapitalLetters(pokemon.name)}`}
                />
                <Wrap
                  spacing={5}
                  style={{
                    marginHorizontal: 2,
                  }}
                >
                  {pokemon && pokemon.types.map(
                    (type: { type: { name: string } }, i: number) => (
                      <View key={`${pokemon.name}_icon_type_${type.type.name}_item`} style={{backgroundColor: commonService.getColorFromType(type.type.name), width: "35%", height: 40, padding: 5, flexDirection: "row", borderRadius: 50}}>
                        <View style={{flexDirection: "row"}}>
                          <Image key={`${pokemon.name}_icon_type_${type.type.name}`} style={{width: 30, height: 30}}
                            source={
                              type.type.name === 'grass' ? require(`../../assets/images/icons/grass.png`) :
                              type.type.name === 'rock' ? require(`../../assets/images/icons/rock.png`) :
                              type.type.name === 'normal' ? require(`../../assets/images/icons/normal.png`) :
                              type.type.name === 'fire' ? require(`../../assets/images/icons/fire.png`) :
                              type.type.name === 'electric' ? require(`../../assets/images/icons/electric.png`) :
                              type.type.name === 'flying' ? require(`../../assets/images/icons/flying.png`) :
                              type.type.name === 'psychic' ? require(`../../assets/images/icons/psychic.png`) :
                              type.type.name === 'water' ? require(`../../assets/images/icons/water.png`) :
                              type.type.name === 'ghost' ? require(`../../assets/images/icons/ghost.png`) :
                              type.type.name === 'insect' ? require(`../../assets/images/icons/bug.png`) :
                              type.type.name === 'ice' ? require(`../../assets/images/icons/ice.png`) :
                              type.type.name === 'fighting' ? require(`../../assets/images/icons/fighting.png`) :
                              type.type.name === 'poison' ? require(`../../assets/images/icons/poison.png`) :
                              type.type.name === 'dragon' ? require(`../../assets/images/icons/dragon.png`) :
                              type.type.name === 'ground' ? require(`../../assets/images/icons/ground.png`) :
                              type.type.name === 'stellar' ? require(`../../assets/images/icons/dark.png`) :
                              type.type.name === 'fairy' ? require(`../../assets/images/icons/fairy.png`) :
                              type.type.name === 'bug' ? require(`../../assets/images/icons/bug.png`) :
                              type.type.name === 'dark' ? require(`../../assets/images/icons/dark.png`) :
                              type.type.name === 'steel' ? require(`../../assets/images/icons/steel.png`) :
                              require('../../assets/images/icons/normal.png')
                            }
                          />
                        </View>
                        <View style={{flexDirection: "row", marginTop: 5, marginLeft: 5}}>
                          <PokeText text={type.type.name.toUpperCase()} color="#ffffff" backgroungColor={commonService.getColorFromType(type.type.name)} type={"card-text"}/>
                        </View>
                      </View>
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
