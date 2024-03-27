import React, { useEffect, useRef, useState } from "react";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Box, Flex, Icon, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, PanResponder, TouchableOpacity } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokemonForBattle } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer } from "../../service/api/types/PokemonTrainer";
import PokemonFirstChoice from "./components/PokemonFirstChoice.";
import { Pokemon } from "pokenode-ts";
import PokeButton from "../../components/buttons/PokeButton";
import Animated, { Value, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";

export type PokeBattleProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
};

function PokeBattle(props: PokeBattleProps) {
  //Consts
  const [pokemonEnemy, setPokemonEnemy] = useState<PokemonForBattle | undefined>(undefined);
  const [pokemonEnemyType, setPokemonEnemyType] = useState<string>("grass");
  const [loading, setLoading] = useState<boolean>(false);
  const [haveAPokemonForBattle, setHaveAPokemonForBattle] = useState<boolean>(false);
  const [attacked, setAttacked] = useState<boolean>(false);
  const playersPokemonLevel = 10; // TODO: TRAZER DO PLAYER MESMO

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();

  //Methods

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      pokemonService
        .getRamdomPokemon()
        .then((pokemonApi: Pokemon) => {
          pokemonService.getPokemonEnemyForBattle(pokemonApi, playersPokemonLevel, undefined).then(pokeEnemy => {
            setPokemonEnemy(pokeEnemy);
          });
          setPokemonEnemyType((pokemonApi?.types[0].type.name ?? "grass"));          
          setAttacked(false);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false);
        });
    };
    if (pokemonEnemy === undefined || pokemonEnemy.hp <= 0) fetchPokemon();
  });

  //Methods
  const handleRunAway = () => {
    setLoading(true);
    pokemonService
      .getRamdomPokemon()
      .then((pokemonApi: Pokemon) => {
        pokemonService.getPokemonEnemyForBattle(pokemonApi, playersPokemonLevel, undefined).then(pokeEnemy => {
          setPokemonEnemy(pokeEnemy);
        });
        setPokemonEnemyType((pokemonApi?.types[0].type.name ?? "grass"));
        setAttacked(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  }

  const handleAttackMock = () => {
    if(attacked) setAttacked(false);
    let temp = pokemonEnemy;
    if(temp){
      setAttacked(true);
      temp.hp = temp.hp - parseInt(`${Math.random() * 15}`);
      setPokemonEnemy(temp);      
    }
    if(attacked) setAttacked(false);
  }



  // ANIMATION
  const translateX = useSharedValue(288)
  const translateY = useSharedValue(172)

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (event) => {
    },
    onActive: (event) => {
      // console.log(`TRANSLATION: x> ${event.translationX} | y> ${event.translationY}`)
      // console.log(`xy: x> ${event.x} | y> ${event.y}`)
      // console.log(`ABSOLUTE: x> ${event.absoluteX} | y> ${event.absoluteY}`)
      // translateX.value = event.x;
      // translateY.value = event.y;

      // translateX.value = event.absoluteX;
      // translateY.value = event.absoluteY;
      // if(event.translationX > 50 && event.translationY > 50){
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      // }
    },
    onFinish: (event) => {
      // translateX.value = event.translationX+50;
      // translateY.value = event.translationY-50;
    },
    onEnd: (event) => {
      translateX.value = 288;
      translateY.value = 172;
    },    
  }) 

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ]
    };
  });


  // const progress = useSharedValue(1)

  // const reanimatedStyle = useAnimatedStyle(() => {
  //   return {
  //     opacity: progress.value
  //   }
  // },[])

  // useEffect(() => {
  //   progress.value = withTiming(0, {duration: 5000});
  // }, [])
  


  //Style
  const styles = StyleSheet.create({
    image: {
      flex: 1,
      justifyContent: 'center',
    },
    enemyDiv: {
      position: "absolute",
      top: 25, 
      left: 60,
      alignItems: "center",
      alignContent: "center",
    },
    playerDiv: {
      position: "absolute",
      bottom: 90, 
      left: 10,
      alignItems: "center",
      alignContent: "center",
    },
    playerInteractionsDiv: {      
      bottom: 0,
      width: "100%",
      position: "absolute",
      alignItems: "center",
      alignContent: "center",
    },
    enemyDivHeader: {
      width: '100%',
      flex: 2
    },
    enemyDivInfosBorder: {
      zIndex: 10,
      padding: 5,
      position: "absolute",
      left: 40,
      width: 250,
      height: 80,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 25,
      borderTopStartRadius: 25,
      backgroundColor: "#4E6648"
    },
    enemyDivInfos: {
      padding: 10,
      height: 70,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 25,
      borderTopStartRadius: 25,
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#ECEDD0"
    },
    playerDivHeader: {
      width: '100%',
    },
    playerDivInfosBorder: {
      zIndex: 10,
      position: "absolute",
      bottom: 160,
      left: 0,
      padding: 5,
      width: 250,
      height: 80,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 25,
      borderTopStartRadius: 25,
      backgroundColor: "#4E6648"
    },
    playerDivInfos: {
      padding: 10,
      height: 70,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 25,
      borderTopStartRadius: 25,
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#ECEDD0"
    },
    playerInteractionsDivBorder: {
      padding: 5,
      width: "100%",
      height: 100,
      borderTopEndRadius: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      borderTopStartRadius: 0,
      backgroundColor: "#4E6648"
    },
    playerInteractionsDivInfos: {
      padding: 10,
      width: "100%",
      height: 90,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderTopStartRadius: 10,
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#ECEDD0"
    },
    enemyImage: { position: "absolute", top: 70, left: 120, width: 170, height: 170 },
    playerImage: { position: "absolute", bottom: 0, left: 0, width: 170, height: 170 },
    circle: {
      width: 60,
      height: 60,
      zIndex: 50
    },
    pokeballImage :{
      width: 60,
      height: 60,
    }
  });

  return (
    <>
      {pokemonEnemy && !loading ? (
        <>
        {!haveAPokemonForBattle ? (
          <PokemonFirstChoice setHaveAPokemonForBattle={(value: boolean) => setHaveAPokemonForBattle(value)} trainer={props.userPokemonTrainer} />
        ):(
            <ImageBackground source={
                pokemonEnemyType === 'grass' ? require(`../../assets/images/battlefields/grass.png`) :
                pokemonEnemyType === 'rock' ? require(`../../assets/images/battlefields/rock.png`) :
                pokemonEnemyType === 'normal' ? require(`../../assets/images/battlefields/normal.png`) :
                pokemonEnemyType === 'fire' ? require(`../../assets/images/battlefields/fire.png`) :
                pokemonEnemyType === 'eletric' ? require(`../../assets/images/battlefields/eletric.png`) :

                pokemonEnemyType === 'flying' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'insect' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'water' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'ice' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'fighting' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'poison' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'ground' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'psychic' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'bug' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'ghost' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'dragon' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'dark' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'steel' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'fairy' ? require(`../../assets/images/battlefields/eletric.png`) :
                pokemonEnemyType === 'stellar' ? require(`../../assets/images/battlefields/eletric.png`) :
                '../../assets/images/battlefields/grass.png'
              }
              style={styles.image}>
              <Flex style={styles.enemyDiv}>
                <View style={styles.enemyDivInfosBorder}>              
                  <View style={styles.enemyDivInfos}>
                    <Flex style={styles.enemyDivHeader} >
                      <Wrap>
                        <Box w={170}>
                          <PokeText 
                            color="#000000" 
                            text={commonService.stringToCapitalLetters(pokemonEnemy.name.includes("-") ?
                              pokemonEnemy.name.substring(0, pokemonEnemy.name.indexOf("-"))
                              : pokemonEnemy.name)} 
                            type={"battle-enemy-card-name"}
                            />
                          </Box>
                          <Box >
                        <PokeText 
                          color="#000000" 
                          text={`Lv ${pokemonEnemy.level}`} 
                          type={"battle-enemy-card-level"}
                          />
                          </Box>
                      </Wrap>
                      <Wrap mt={15}>
                        <Box radius={3} w={202} h={15} style={{backgroundColor: "#4E6648"}} >
                          <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                            w={attacked ? pokemonEnemy.hp * 2 : pokemonEnemy.hp * 2} 
                            h={13} style={{backgroundColor: pokemonEnemy.hp > 50 ? "#6BF6A7" : pokemonEnemy.hp > 25 ? "#F2CF3C" : "#E75342"}} />
                        </Box>
                      </Wrap>
                      </Flex>
                  </View>
                  </View>
                <Image
                  style={styles.enemyImage}
                  source={{
                    uri: `${commonService.getPokemonMainImageFrontForBattle(
                      pokemonEnemy?.sprites
                    )}`,
                  }}
                />
              </Flex>
              <PanGestureHandler onGestureEvent={panGestureEvent}>
                  <Animated.View 
                    style={[styles.circle, rStyle]}
                    >
                    <ImageBackground source={
                      require("../../assets/images/pokeball.png")}
                      style={styles.pokeballImage}
                      />
                    </Animated.View>
                </PanGestureHandler>

              <Flex style={styles.playerDiv}>
  
                <View style={styles.playerDivInfosBorder}>              
                  <View style={styles.playerDivInfos}>
                    <Flex style={styles.playerDivHeader} >
                      <Wrap>
                        <Box w={170}>
                          <PokeText 
                            color="#000000" 
                            text={props.userPokemonTrainer.pokemons[0].nickname ? commonService.stringToCapitalLetters(props.userPokemonTrainer.pokemons[0].nickname) : commonService.stringToCapitalLetters(props.userPokemonTrainer.pokemons[0].name.includes("-") ?
                            props.userPokemonTrainer.pokemons[0].name.substring(0, props.userPokemonTrainer.pokemons[0].name.indexOf("-"))
                              : props.userPokemonTrainer.pokemons[0].name)} 
                            type={"battle-enemy-card-name"}
                            />
                          </Box>
                          <Box>
                        <PokeText 
                          color="#000000" 
                          text={`Lv ${props.userPokemonTrainer.pokemons[0].level}`} 
                          type={"battle-enemy-card-level"}
                          />
                          </Box>
                      </Wrap>
                      <Wrap mt={15}>
                        <Box radius={3} w={202} h={15} style={{backgroundColor: "#4E6648"}} >
                          <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} w={props.userPokemonTrainer.pokemons[0].hp * 2} h={13} style={{backgroundColor: props.userPokemonTrainer.pokemons[0].hp > 50 ? "#6BF6A7" : props.userPokemonTrainer.pokemons[0].hp > 25 ? "#F2CF3C" : "#E75342"}} />
                        </Box>
                      </Wrap>
                      </Flex>
                  </View>
                  </View>
                <Image
                  style={styles.playerImage}
                  source={{
                    uri: `${commonService.getPokemonMainImageBackForBattle(
                      props.userPokemonTrainer.pokemons[0]?.sprites
                    )}`,
                  }}
                />
              </Flex>

              <Flex style={styles.playerInteractionsDiv}>
                <View style={styles.playerInteractionsDivBorder}>
                  <View style={styles.playerInteractionsDivInfos}>
                    <Wrap w={"100%"}>
                      <Box w={"50%"} style={{alignItems: "center"}}>
                        <PokeButton 
                          size="small"
                          variant="text"
                          color={"menuGreen"}
                          text="Fight" 
                          styleType={"invisible"}
                          onClick={() => handleAttackMock()}
                          // onClick={() => openAttacksMenu(true)}
                        />
                      </Box>
                      <Box w={"50%"} style={{alignItems: "center"}}>
                      <PokeButton 
                          size="small"
                          variant="text"
                          color={"menuGreen"}
                          text="Bag" 
                          styleType={"invisible"}
                          // onClick={() => openPokemonsMenu(true)}
                        />
                      </Box>
                    </Wrap>
                    <Wrap w={"100%"}>
                    <Box w={"50%"} style={{alignItems: "center"}}>
                        <PokeButton 
                          size="small"
                          variant="text"
                          color={"menuGreen"}
                          text="Capture" 
                          styleType={"invisible"}
                          // onClick={() => handleCapture()}
                        />
                      </Box>
                      <Box w={"50%"} style={{alignItems: "center"}}>
                        <PokeButton 
                          size="small"
                          variant="text"
                          color={"menuGreen"}
                          text="Run" 
                          styleType={"invisible"}
                          onClick={() => handleRunAway()}
                        />
                      </Box>
                    </Wrap>
                  </View>
                </View>
              </Flex>


            </ImageBackground>
          )}
        </>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeBattle;
