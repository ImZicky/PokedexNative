import React, { useEffect, useRef, useState } from "react";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Box, Flex, Icon, Stack, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, PanResponder, TouchableOpacity, Modal } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokemonForBattle } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer } from "../../service/api/types/PokemonTrainer";
import PokemonFirstChoice from "./components/PokemonFirstChoice.";
import { Pokemon } from "pokenode-ts";
import PokeButton from "../../components/buttons/PokeButton";
import Animated, { RotateInUpLeft, Value, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, useWorkletCallback, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
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
  const [openMessageModal, setOpenMessageModal] = useState<boolean>(false);
  const [openMessageModalMessage, setOpenMessageModalMessage] = useState<string>("");


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
      enemyHp.value = temp.hp;
    }
    if(attacked) setAttacked(false);
  }




  //CAPTURE-ANIMATIONS
  const isCapturingPokemon = useSharedValue(0);
  const didCapturePokemon = useSharedValue(0);
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const pokeballWidth = useSharedValue(60)
  const pokeballHeight = useSharedValue(60)
  const pokeballRotate = useSharedValue(0)
  const pokemonOpacity = useSharedValue(1);
  const enemyHp = useSharedValue(100);


  const calculateIfCaptured = useWorkletCallback((hp: number) => {
    if(hp > 50) {
      return parseInt(`${Math.random() * 100}`) > 90;
    }
    else if(hp > 25 && hp <= 50) {
      return parseInt(`${Math.random() * 100}`) > 75;
    }
    else if(hp <= 25) {
      return parseInt(`${Math.random() * 100}`) > 50;
    }
  });

  const handleCapturePokemon = useWorkletCallback((pEnemyHp: number) => {
    if(calculateIfCaptured(pEnemyHp)){
      didCapturePokemon.value = 1;
      pokemonOpacity.value = withDelay(5000, withTiming(1, { duration: 500 }));

      pokeballWidth.value = withTiming(60, { duration: 60 });
      pokeballHeight.value = withTiming(60, { duration: 60 });
      translateX.value = withTiming(0, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });

      isCapturingPokemon.value = 0;
      didCapturePokemon.value = 0;
      enemyHp.value = 100;
      runOnJS(handleRunAway)();
    }
    else{
      isCapturingPokemon.value = 0;
      didCapturePokemon.value = 0;
    }  
  });

  const didThrowPokeball = useWorkletCallback((px: number, py: number) => {
    if(px < 23 && px > -211 && py < -190 && py > -350) return true;
    return false;    
  })

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (event) => {
      pokeballRotate.value = withSequence(
        withRepeat(withTiming(360, { duration: 300 }), 1, true)
        );

    },
    onActive: (event) => {

      pokeballWidth.value = withSequence(
        withRepeat(withTiming(70, { duration: 250 }), 100, true),
        withTiming(50, { duration: 250 })
      );

      pokeballHeight.value = withSequence(
        withRepeat(withTiming(70, { duration: 250 }), 100, true),
        withTiming(50, { duration: 250 })
      );

      translateX.value = event.translationX;
      translateY.value = event.translationY;    
    },
    onFinish: (event) => {
      if(didThrowPokeball(event.translationX, event.translationY)){
        isCapturingPokemon.value = 1;
        pokemonOpacity.value = withTiming(0, { duration: 500 });

        handleCapturePokemon(enemyHp.value);
        if(didCapturePokemon.value === 0) {
          pokemonOpacity.value = withTiming(1, { duration: 500 });
          pokeballWidth.value = withTiming(60, { duration: 60 });
          pokeballHeight.value = withTiming(60, { duration: 60 });
          translateX.value = withTiming(0, { duration: 500 });
          translateY.value = withTiming(0, { duration: 500 });  
          pokeballRotate.value = withSequence(
            withRepeat(withTiming(0, { duration: 1000 }), 1, true)
          );
          runOnJS(setOpenMessageModalMessage)(`Pokémon got away!`);
          runOnJS(setOpenMessageModal)(true);
        }
      }
      else{
        if(didCapturePokemon.value === 0) {
          pokemonOpacity.value = withTiming(1, { duration: 500 });

          pokeballWidth.value = withTiming(60, { duration: 60 });
          pokeballHeight.value = withTiming(60, { duration: 60 });
          translateX.value = withTiming(0, { duration: 500 });
          translateY.value = withTiming(0, { duration: 500 });  
        }
      }
    },
    onEnd: (event) => {
    },
  }) 

  const reanimationViewStyle = useAnimatedStyle(() => {
    return {
      width: pokeballWidth.value,
      height: pokeballHeight.value,
      transform: [
        {
          rotateZ:  `${pokeballRotate.value}deg`,
        },
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        }
      ]
    };
  });

  const reanimationPokeballStyle = useAnimatedStyle(() => {
    return {
      width: pokeballWidth.value,
      height: pokeballHeight.value,
      transform: [
        {
          rotateZ:  `${pokeballRotate.value}deg`,
        }
      ]
    };
  });

  const reanimationPokemonStyle = useAnimatedStyle(() => {
    return {
      opacity: pokemonOpacity.value,
    };
  });






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
      top: -20,
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
      bottom: 170,
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
    enemyImage: {
      opacity: 1,
      position: "absolute", 
      top: 70, 
      left: 120, 
      width: 170, 
      height: 170, 
      display: "flex"
    },
    playerImage: { 
      position: "absolute", 
      bottom: 0, 
      left: 0, 
      width: 170, 
      height: 170 
    },
    circle: {
      width: 60,
      height: 60,
      zIndex: 50
    },
    pokeballImage :{
      width: 60,
      height: 60,
    },
    pokemonPokeballDiv:{
      position: "absolute",
      width: 400,
      height: 270,
      left: 0,
      top: 0,
      zIndex: 200,
      alignItems: "center",
      alignContent: "center",
    },
    pokeballDiv:{
      position: "absolute",
      paddingTop: 430,
      paddingLeft: 280,
      width: 360,
      left: 0,
      bottom: 100,
      zIndex: 200,
      height: 515,
      alignItems: "center",
      alignContent: "center",
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
                pokemonEnemyType === 'grass' ? require(`../../assets/images/battlefields/grass.gif`) :
                pokemonEnemyType === 'rock' ? require(`../../assets/images/battlefields/rock.gif`) :
                pokemonEnemyType === 'normal' ? require(`../../assets/images/battlefields/normal.gif`) :
                pokemonEnemyType === 'fire' ? require(`../../assets/images/battlefields/fire.gif`) :
                pokemonEnemyType === 'eletric' ? require(`../../assets/images/battlefields/eletric.gif`) :
                pokemonEnemyType === 'flying' ? require(`../../assets/images/battlefields/flying.gif`) :
                pokemonEnemyType === 'psychic' ? require(`../../assets/images/battlefields/psychic.gif`) :
                pokemonEnemyType === 'water' ? require(`../../assets/images/battlefields/water.gif`) :
                pokemonEnemyType === 'ghost' ? require(`../../assets/images/battlefields/ghost.gif`) :
                pokemonEnemyType === 'insect' ? require(`../../assets/images/battlefields/insect.gif`) :
                pokemonEnemyType === 'ice' ? require(`../../assets/images/battlefields/ice.gif`) :
                pokemonEnemyType === 'fighting' ? require(`../../assets/images/battlefields/fighting.gif`) :
                pokemonEnemyType === 'poison' ? require(`../../assets/images/battlefields/poison.gif`) :
                pokemonEnemyType === 'dragon' ? require(`../../assets/images/battlefields/dragon.gif`) :
                pokemonEnemyType === 'ground' ? require(`../../assets/images/battlefields/ground.gif`) :
                pokemonEnemyType === 'stellar' ? require(`../../assets/images/battlefields/stellar.gif`) :
                pokemonEnemyType === 'fairy' ? require(`../../assets/images/battlefields/fairy.gif`) :
                pokemonEnemyType === 'bug' ? require(`../../assets/images/battlefields/bug.gif`) :
                pokemonEnemyType === 'dark' ? require(`../../assets/images/battlefields/dark.gif`) :
                pokemonEnemyType === 'steel' ? require(`../../assets/images/battlefields/steel.gif`) :
                require('../../assets/images/battlefields/normal.gif')
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
                <Animated.Image
                  style={[styles.enemyImage, reanimationPokemonStyle]}
                  source={{
                    uri: `${commonService.getPokemonMainImageFrontForBattle(
                      pokemonEnemy?.sprites
                    )}`,
                  }}
                />
              </Flex>

              <View style={styles.pokeballDiv}>
              <View style={styles.pokemonPokeballDiv}></View>
                <PanGestureHandler onGestureEvent={panGestureEvent}>
                  <Animated.View 
                    style={[styles.circle, reanimationViewStyle]}
                    >
                    <Animated.Image source={
                      require("../../assets/images/pokeball.png")}
                      style={[styles.pokeballImage, reanimationPokeballStyle]}
                      />
                    </Animated.View>
                </PanGestureHandler>
              </View>

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
                        {/* <PokeButton 
                          size="small"
                          variant="text"
                          color={"menuGreen"}
                          text="Capture"
                          styleType={"invisible"}
                          // onClick={() => handleCapture()}
                        /> */}
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


              <Modal
                animationType="slide"
                transparent            
                visible={openMessageModal}
                onRequestClose={() => {
                  setOpenMessageModal(false);
                }}
              >
              <View style={styles.centeredViewModal}>
                <View style={styles.modalViewModal}>
                    <PokeText 
                      text={openMessageModalMessage} 
                      color={"#000000"} 
                      type={"h1"}                    
                    />
                    <View style={{marginTop: 50}}/>
                    <PokeButton
                      styleType={pokemonEnemy?.type[0].type.name ?? ""}
                      variant="contained"
                      size="fullwidth"
                      text="Close"
                      onClick={() => setOpenMessageModal(false)}
                    />
                  </View>
                </View>
              </Modal>
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
function useComputedValue(arg0: () => any, arg1: any[]) {
  throw new Error("Function not implemented.");
}

