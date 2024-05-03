import { Backdrop, Box, Flex, Icon, Wrap } from "@react-native-material/core";
import React, { useEffect, useState } from "react";
import PokeText from "../../components/texts/PokeText";
import { StyleSheet, Image, View, ScrollView } from "react-native";
import { Pokemon, PokemonAbility } from "pokenode-ts";
import PokeButton from "../../components/buttons/PokeButton";
import { useCommonService } from "../../service/common/CommonService";
import PokeLoading from "../../components/loader/PokeLoading";
import { usePokemonService } from "../../service/api/PokemonService";
import { PokemonAbilityFull } from "../../service/api/types/PokemonAbilityFull";
import PokeIconButton from "../../components/buttons/PokeIconButton";

export type PokePerfilProps = {
  route: any;
  navigation: any;
};

function PokePerfil(props: PokePerfilProps) {
  //States
  const [pokemon, setPokemon] = useState<Pokemon | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pokemonAbilities, setPokemonAbilities] = useState<PokemonAbilityFull[]>([]);
  const [pokemonMoves, setPokemonMoves] = useState<string[]>([]);
  const [pokemonGameAppearences, setPokemonGameAppearences] = useState<string[]>([]);
  const [areaEnconters, setAreaEnconters] = useState<string[]>([]);

  const [showSkills, setShowSkills] = useState<boolean>(false);
  const [showMoves, setShowMoves] = useState<boolean>(false);
  const [showAppearences, setShowAppearences] = useState<boolean>(false);
  const [showAreaEnconters, setShowAreaEnconters] = useState<boolean>(false);
  
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
        // console.log('skills: ', pokemon.abilities.map(x => x.ability.name)); // ja usei
        // console.log('moves: ', pokemon.moves.map(x => x.move.name)); // usavel e usavel em batalhas
        // console.log('gameIndices_name: ',pokemon.game_indices[0].version.name); //usavel jogo q apareceu
        //console.log('area_encounters: ',pokemon.location_area_encounters); //usavel "location_area":{"name"


        setShowSkills(false);
        let temp: PokemonAbilityFull[] = [];
        pokemon?.abilities.forEach((a: PokemonAbility) => {
          pokemonService.getAbilityDescription(a.ability.name).then((resp) => {
            temp.push({
              name: a.ability.name,
              description: resp ?? "--",
            });
            setPokemonAbilities(temp);
            setPokemonMoves(pokemon.moves.map(x => x.move.name));
            setPokemonGameAppearences(pokemon.game_indices.map(x => x.version.name));
            pokemonService.getAreaEnconters(pokemon.id).then((enconters)=> {
              if(enconters) setAreaEnconters(enconters);
            })
          });
        });
      }
    })();
  }, [pokemon]);

  useEffect(() => {
    setShowSkills(false);
  }, [])
  

  //Style
  const styles = StyleSheet.create({
    view: {
      width: "100%",
      height: "100%",
      padding: 5
    },
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: {
      marginTop: 60,
      width: 230, 
      height: 200,
    },
    infosGrid: {
      padding: 25,
    },
  });

  return (
    <View
      style={[
        styles.view,
        {
          backgroundColor: pokemon
            ? commonService.getColorFromType(pokemon.types[0].type.name)
            : "#000",
        },
      ]}
    >
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
                backgroungColor={
                  pokemon
                    ? commonService.getColorFromType(pokemon.types[0].type.name)
                    : "#000"
                }
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
                  {pokemon &&
                    pokemon.types.map(
                      (type: { type: { name: string } }, i: number) => (
                        <View
                          key={`${pokemon.name}_icon_type_${type.type.name}_item_${i}`}
                          style={{
                            backgroundColor: commonService.getColorFromType(
                              type.type.name
                            ),
                            width: "35%",
                            height: 40,
                            padding: 5,
                            flexDirection: "row",
                            borderRadius: 50,
                          }}
                        >
                          <View style={{ flexDirection: "row" }} key={`${pokemon.name}_icon_type_${type.type.name}_view_${i}`}>
                            <Image
                              key={`${pokemon.name}_icon_type_${type.type.name}_${i}`}
                              style={{ width: 30, height: 30 }}
                              source={
                                type.type.name === "grass"
                                  ? require(`../../assets/images/icons/grass.png`)
                                  : type.type.name === "rock"
                                  ? require(`../../assets/images/icons/rock.png`)
                                  : type.type.name === "normal"
                                  ? require(`../../assets/images/icons/normal.png`)
                                  : type.type.name === "fire"
                                  ? require(`../../assets/images/icons/fire.png`)
                                  : type.type.name === "electric"
                                  ? require(`../../assets/images/icons/electric.png`)
                                  : type.type.name === "flying"
                                  ? require(`../../assets/images/icons/flying.png`)
                                  : type.type.name === "psychic"
                                  ? require(`../../assets/images/icons/psychic.png`)
                                  : type.type.name === "water"
                                  ? require(`../../assets/images/icons/water.png`)
                                  : type.type.name === "ghost"
                                  ? require(`../../assets/images/icons/ghost.png`)
                                  : type.type.name === "insect"
                                  ? require(`../../assets/images/icons/bug.png`)
                                  : type.type.name === "ice"
                                  ? require(`../../assets/images/icons/ice.png`)
                                  : type.type.name === "fighting"
                                  ? require(`../../assets/images/icons/fighting.png`)
                                  : type.type.name === "poison"
                                  ? require(`../../assets/images/icons/poison.png`)
                                  : type.type.name === "dragon"
                                  ? require(`../../assets/images/icons/dragon.png`)
                                  : type.type.name === "ground"
                                  ? require(`../../assets/images/icons/ground.png`)
                                  : type.type.name === "stellar"
                                  ? require(`../../assets/images/icons/dark.png`)
                                  : type.type.name === "fairy"
                                  ? require(`../../assets/images/icons/fairy.png`)
                                  : type.type.name === "bug"
                                  ? require(`../../assets/images/icons/bug.png`)
                                  : type.type.name === "dark"
                                  ? require(`../../assets/images/icons/dark.png`)
                                  : type.type.name === "steel"
                                  ? require(`../../assets/images/icons/steel.png`)
                                  : require("../../assets/images/icons/normal.png")
                              }
                            />
                          </View>
                          <View
                            key={`${pokemon.name}_icon_type_${type.type.name}_view_2_${i}`}
                            style={{
                              flexDirection: "row",
                              marginTop: 5,
                              marginLeft: 5,
                            }}
                          >
                            <PokeText
                              key={`${pokemon.name}_icon_type_${type.type.name}_view_2_text_${i}`}
                              text={type.type.name.toUpperCase()}
                              color="#ffffff"
                              backgroungColor={commonService.getColorFromType(
                                type.type.name
                              )}
                              type={"card-text"}
                            />
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

              {/* SKILLS */}
              <Flex style={styles.infosGrid}>
                <Wrap>
                  {pokemonAbilities && (
                    <>
                      <Backdrop
                        style={{backgroundColor: "#ffffff"}}
                        revealed={showSkills}
                        header={
                          <>
                            <View
                              onTouchEnd={() => setShowSkills(!showSkills)}
                              style={{
                                backgroundColor: commonService.getColorFromType(
                                  pokemon.types[0].type.name
                                ),
                                width: "100%",
                                height: 40,
                                flexDirection: "row",
                                borderRadius: 5,
                                padding: 5,
                                marginBottom: -3,
                              }}
                            >
                              <Icon
                                name={showSkills ? "arrow-down" : "arrow-right"}
                                color={"#fff"}
                                size={25}
                              />
                              <PokeText
                                color="#fff"
                                type="card-text-big"
                                text=" Skills"
                              />
                            </View>
                            <View
                              style={{ display: showSkills ? "flex" : "none", 
                              borderBottomStartRadius: showSkills ? 0 : 5,
                              borderBottomEndRadius: showSkills ? 0 : 5,
                              backgroundColor: commonService.getLighterColorFromType(pokemon.types[0].type.name)
                              }}
                            >
                              {pokemonAbilities?.map((a, i) => (
                                <View style={{margin: 5}} key={`view_ability_name_${a.name}_${i}`}>
                                  <PokeText
                                    key={`ability_name_${a.name}_${i}`}
                                    color="#fff"
                                    type="card-text"
                                    text={`${a.name.toUpperCase()}: ${
                                      a.description
                                    }`}
                                  />
                                </View>
                              ))}
                            </View>
                          </>
                        }
                      />
                    </>
                  )}
                </Wrap>
              </Flex>
            
              {/* MOVES */}
              <Flex style={[styles.infosGrid, {top: -50}]}>
                <Wrap>
                  {pokemonMoves && (
                    <>
                      <Backdrop
                        style={{backgroundColor: "#ffffff"}}
                        revealed={showMoves}
                        header={
                          <>
                            <View
                              onTouchEnd={() => setShowMoves(!showMoves)}
                              style={{
                                backgroundColor: commonService.getColorFromType(
                                  pokemon.types[0].type.name
                                ),
                                width: "100%",
                                height: 40,
                                flexDirection: "row",
                                padding: 5,
                                marginBottom: -3,
                              }}
                            >
                              <Icon
                                name={showSkills ? "arrow-down" : "arrow-right"}
                                color={"#fff"}
                                size={25}
                              />
                              <PokeText
                                color="#fff"
                                type="card-text-big"
                                text=" Moves"
                              />
                            </View>
                            <View
                              style={{ display: showMoves ? "flex" : "none", 
                              backgroundColor: commonService.getLighterColorFromType(pokemon.types[0].type.name)
                              }}
                            >
                              {pokemonMoves?.map((m, i) => (
                                <View style={{margin: 5}} key={`view_ability_name_${m}_${i}`}>
                                  <PokeText
                                    key={`ability_name_${m}_${i}`}
                                    color="#fff"
                                    type="card-text"
                                    text={`${m.toUpperCase()}`}
                                  />
                                </View>
                              ))}
                            </View>
                          </>
                        }
                      />
                    </>
                  )}
                </Wrap>
              </Flex>


              {/* GAME APPEARENCES */}
              <Flex style={[styles.infosGrid, {top: -100}]}>
                <Wrap>
                  {pokemonGameAppearences && (
                    <>
                      <Backdrop
                        style={{backgroundColor: "#ffffff"}}
                        revealed={showAppearences}
                        header={
                          <>
                            <View
                              onTouchEnd={() => setShowAppearences(!showAppearences)}
                              style={{
                                backgroundColor: commonService.getColorFromType(
                                  pokemon.types[0].type.name
                                ),
                                width: "100%",
                                height: 40,
                                flexDirection: "row",
                                padding: 5,
                                marginBottom: -3,
                              }}
                            >
                              <Icon
                                name={showAppearences ? "arrow-down" : "arrow-right"}
                                color={"#fff"}
                                size={25}
                              />
                              <PokeText
                                color="#fff"
                                type="card-text-big"
                                text=" Games"
                              />
                            </View>
                            <View
                              style={{ 
                                display: showAppearences ? "flex" : "none", 
                                backgroundColor: commonService.getLighterColorFromType(pokemon.types[0].type.name)
                              }}
                            >
                              {pokemonGameAppearences?.map((m, i) => (
                                <View style={{margin: 5}} key={`view_games_name_${m}_${i}`}>
                                  <PokeText
                                    key={`games${m}_${i}`}
                                    color="#fff"
                                    type="card-text"
                                    text={`POKEMON: ${m.toUpperCase()}`}
                                  />
                                </View>
                              ))}
                            </View>
                          </>
                        }
                      />
                    </>
                  )}
                </Wrap>
              </Flex>


              {/* AREA ENCONTERS */}
              <Flex style={[styles.infosGrid, {top: -150}]}>
                <Wrap>
                  {areaEnconters && (
                    <>
                      <Backdrop
                        style={{backgroundColor: "#ffffff"}}
                        revealed={showAreaEnconters}
                        header={
                          <>
                            <View
                              onTouchEnd={() => setShowAreaEnconters(!showAreaEnconters)}
                              style={{
                                backgroundColor: commonService.getColorFromType(
                                  pokemon.types[0].type.name
                                ),
                                width: "100%",
                                height: 40,
                                flexDirection: "row",
                                borderBottomEndRadius: showAreaEnconters ? 0 : 10,
                                borderBottomStartRadius: showAreaEnconters ? 0 : 10,
                                padding: 5,
                                marginBottom: -3,
                              }}
                            >
                              <Icon
                                name={showAreaEnconters ? "arrow-down" : "arrow-right"}
                                color={"#fff"}
                                size={25}
                              />
                              <PokeText
                                color="#fff"
                                type="card-text-big"
                                text=" Enconters"
                              />
                            </View>
                            <View
                              style={{ 
                                display: showAreaEnconters ? "flex" : "none", 
                                borderBottomStartRadius: 5,
                                borderBottomEndRadius: 5,
                                backgroundColor: commonService.getLighterColorFromType(pokemon.types[0].type.name)
                              }}
                            >
                              {areaEnconters?.map((a, i) => (
                                <View style={{margin: 5}} key={`view_enconters_name_${a}_${i}`}>
                                  <PokeText
                                    key={`enconters${a}_${i}`}
                                    color="#fff"
                                    type="card-text"
                                    text={`${a.toUpperCase().replace('-', ' ').replace('-', ' ').replace('-', ' ')}`}
                                  />
                                </View>
                              ))}
                            </View>
                          </>
                        }
                      />
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
