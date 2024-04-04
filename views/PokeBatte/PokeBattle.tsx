import React, { useEffect, useRef, useState } from "react";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Box, Flex, Icon, Stack, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, PanResponder, TouchableOpacity, Modal } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokemonForBattle, PokemonForBattleSkills } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer } from "../../service/api/types/PokemonTrainer";
import PokemonFirstChoice from "./components/PokemonFirstChoice.";
import { Pokemon } from "pokenode-ts";
import PokeButton from "../../components/buttons/PokeButton";
import Animated, { RotateInUpLeft, Value, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, useWorkletCallback, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";


export type PokeBattleProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  handleSetPokemonBattling: (pokemon : PokemonForBattle, position: number) => void;
  handleCapturePokemon: (pokemon : PokemonForBattle) => void;
  handleCureBattlingPokemons: () => void;
};

function PokeBattle(props: PokeBattleProps) {
  //Consts
  const [pokemonEnemy, setPokemonEnemy] = useState<PokemonForBattle | undefined>(undefined);
  const [pokemonEnemyType, setPokemonEnemyType] = useState<string>("grass");
  const [loading, setLoading] = useState<boolean>(false);
  const [haveAPokemonForBattle, setHaveAPokemonForBattle] = useState<boolean>(false);
  const [attacked, setAttacked] = useState<boolean>(false);
  const [wasAttacked, setWasAttacked] = useState<boolean>(false);
  const [pokemonFightingIndex, setPokemonFightingIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const playersPokemonLevel = 10; // TODO: TRAZER DO PLAYER MESMO

  //MODALS
  const [openPokemonDidntCaughtModal, setOpenPokemonDidntCaughtModal] = useState<boolean>(false);
  const [openPokemonCaughtModal, setOpenPokemonCaughtModal] = useState<boolean>(false);

  const [openPokemonAttackInfoModal, setOpenPokemonAttackInfoModal] = useState<boolean>(false);
  const [pokemonAttackInfoModalMessage, setPokemonAttackInfoModalMessage] = useState<string>("");0
  const [openPokemonAttackModal, setOpenPokemonAttackModal] = useState<boolean>(false);

  const [openPokemonAttackedInfoModal, setOpenPokemonAttackedInfoModal] = useState<boolean>(false);
  const [pokemonAttackedInfoModalMessage, setPokemonAttackedInfoModalMessage] = useState<string>("");

  const [openModalChangingPokemon, setOpenModalChangingPokemon] = useState<boolean>(false);
  const [openModalChangingPokemonInfo, setOpenModalChangingPokemonInfo] = useState<string>("");
  
  const [openModalGameOver, setOpenModalGameOver] = useState<boolean>(false);

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
    if (pokemonEnemy === undefined) fetchPokemon();
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

  
  const handleAttackModal = (value: boolean) => {
    setOpenPokemonAttackModal(value);
  }

  const handleAttack = (skill: PokemonForBattleSkills) => {
    // console.log(props.userPokemonTrainer.pokemons.map(x => x.name));
    if(props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 0){
      setOpenPokemonAttackModal(false);
      if(attacked) setAttacked(false);

      let temp = pokemonEnemy;
      if(temp){
        setAttacked(true);
        const damagePlus = parseInt(`${Math.random() * 5}`);
        const totalDamage = props.userPokemonTrainer.pokemons[pokemonFightingIndex].level > pokemonEnemy.level ? 
          ((skill.damage + damagePlus) +  (props.userPokemonTrainer.pokemons[pokemonFightingIndex].level - pokemonEnemy.level)) : 
          ((skill.damage + damagePlus) -  (pokemonEnemy.level - props.userPokemonTrainer.pokemons[pokemonFightingIndex].level));

        if(totalDamage >= 19 && damagePlus !== 0) {
          temp.hp = temp.hp - totalDamage;
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and got a critical hit!`);
          setOpenPokemonAttackInfoModal(true);
          skill.ppNow = skill.ppNow - 1;
        }
        if(damagePlus === 0) {
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and missed the attack!`);
          setOpenPokemonAttackInfoModal(true);
          skill.ppNow = skill.ppNow - 1;
        }
        if(totalDamage > 0 && totalDamage < 19 && damagePlus !== 0) {
          temp.hp = temp.hp - totalDamage;
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and sucessfully attacked!`);
          setOpenPokemonAttackInfoModal(true);
          skill.ppNow = skill.ppNow - 1;
        }

        setPokemonEnemy(temp);      
        enemyHp.value = temp.hp;
      }
      if(attacked) setAttacked(false);
    }
  }


  const handleAttacked = () => {
    if(wasAttacked) setWasAttacked(false);
    if(pokemonEnemy.hp > 0){
      const skillsTotal = pokemonEnemy.skills.length;
      const chosenSkill = parseInt(`${Math.random() * skillsTotal}`);
      const skill = pokemonEnemy.skills[chosenSkill];

      let temp = props.userPokemonTrainer.pokemons[pokemonFightingIndex];
      if(temp){
        setWasAttacked(true);
        const damagePlus = parseInt(`${Math.random() * 5}`);
        const totalDamage = props.userPokemonTrainer.pokemons[pokemonFightingIndex].level > pokemonEnemy.level ? 
          ((skill.damage + damagePlus) +  (props.userPokemonTrainer.pokemons[pokemonFightingIndex].level - pokemonEnemy.level)) : 
          ((skill.damage + damagePlus) -  (pokemonEnemy.level - props.userPokemonTrainer.pokemons[pokemonFightingIndex].level));

        if(totalDamage >= 19 && damagePlus !== 0) {
          temp.hp = temp.hp - totalDamage;
          setPokemonAttackedInfoModalMessage(`${pokemonEnemy.name} used ${skill.name} and got a critical hit!`);
        }
        if(damagePlus === 0) {
          setPokemonAttackedInfoModalMessage(`${pokemonEnemy.name} used ${skill.name} and missed the attack!`);
        }
        if(totalDamage > 0 && totalDamage < 19 && damagePlus !== 0) {
          temp.hp = temp.hp - totalDamage;
          setPokemonAttackedInfoModalMessage(`${pokemonEnemy.name} used ${skill.name} and sucessfully attacked!`);
        }

        temp.hp = temp.hp <= 0 ? 0 : temp.hp;
        handleSetPlayerPokemon(temp);

        setOpenPokemonAttackedInfoModal(true);

        if(temp.hp === 0) {
          let canFight = false;
          for(let i = 0; i < 5; i++){
            if(props.userPokemonTrainer.pokemons[i] !== undefined){
              if(props.userPokemonTrainer.pokemons[i].hp > 0){
                canFight = true;
                handleChangePlayersPokemon(temp.name, i);
              }
            }
          };
          if(!canFight) {
            setOpenPokemonAttackedInfoModal(false);
            handleGameOver()
          };
        }
      }
      if(wasAttacked) setWasAttacked(false);
    }
    else{
      handleRunAway();
    }
    if(wasAttacked) setWasAttacked(false);
  }

  const handleChangePlayersPokemon = (faintPokemonName : string, index : number) => {
    setPokemonFightingIndex(index);
    setOpenModalChangingPokemon(true);
    setOpenModalChangingPokemonInfo(`${faintPokemonName} is faint, you throwed ${props.userPokemonTrainer.pokemons[index].name}`);
  }

  const handleGameOver = () => {
    setOpenModalGameOver(true);
  }

  const handleSetPlayerPokemon = (pokemon : PokemonForBattle) => {
    props.handleSetPokemonBattling(pokemon, pokemonFightingIndex);
  }

  const handleCaptureEnemy = (pokemon : PokemonForBattle) => {
    props.handleCapturePokemon(pokemon);
  }

  const handleDidntCaught = () => {
    handleAttacked();
    setOpenPokemonDidntCaughtModal(false)
  }

  const handleCurePokemons = () => {
    setPokemonFightingIndex(0);
    props.handleCureBattlingPokemons()
    handleRunAway();
    setGameOver(false);
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
      enemyHp.value = 100;
      runOnJS(setOpenPokemonCaughtModal)(true);
    }
    else{
      isCapturingPokemon.value = 0;
      didCapturePokemon.value = 0;
    }  
  });

  const didThrowPokeball = useWorkletCallback((px: number, py: number) => {
    if(px < 50 && px > -200 && py < -190 && py > -380) return true;
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
      // console.log("X:",event.translationX)
      // console.log("Y:",event.translationY)
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
          runOnJS(setOpenPokemonDidntCaughtModal)(true);
        }else
        {
          pokemonOpacity.value = withTiming(0, { duration: 500 });
        }
      }
      else{
        if(didCapturePokemon.value === 0) {

          pokeballRotate.value = withSequence(
            withRepeat(withTiming(360, { duration: 300 }), 1, true)
            );
          
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
    enemyDivGround:{
      zIndex: 0,
      top: 100,
      left: 60,
      width: 230,
      height: 230,
      borderRadius: 150,
      borderWidth: 10,
      borderColor: "#FFF",
      borderStyle: "solid",
      transform:[
        {rotateX:"75deg"},
      ],
    },
    playerDivGround:{
      zIndex: 0,
      top: 100,
      left: -30,
      width: 230,
      height: 230,
      borderRadius: 150,
      borderWidth: 10,
      borderColor: "#FFF",
      borderStyle: "solid",
      transform:[
        {rotateX:"75deg"},
      ],
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
      zIndex: 15,
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
      zIndex: 10,
      opacity: 1,
      position: "absolute", 
      top: 70, 
      left: 120, 
      width: 170, 
      height: 170, 
      display: "flex"
    },
    playerImage: { 
      zIndex: 10,
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
          <>
            {!gameOver ? (
              <ImageBackground source={
                  pokemonEnemyType === 'grass' ? require(`../../assets/images/battlefields/grass.gif`) :
                  pokemonEnemyType === 'rock' ? require(`../../assets/images/battlefields/rock.gif`) :
                  pokemonEnemyType === 'normal' ? require(`../../assets/images/battlefields/normal.gif`) :
                  pokemonEnemyType === 'fire' ? require(`../../assets/images/battlefields/fire.gif`) :
                  pokemonEnemyType === 'electric' ? require(`../../assets/images/battlefields/electric.gif`) :
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
                            {pokemonEnemy.hp > 0 && 
                              <>
                                <View style={{position: "absolute", zIndex: 200, bottom: 0, left: 2}}>
                                  <PokeText
                                    color={pokemonEnemy.hp > 25 ? "#4E6648" : "#000000"}
                                    text={`${pokemonEnemy.hp}/100`}
                                    type={"battle-enemy-card-level"}
                                    />
                                </View>
                                <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                                  w={attacked ? pokemonEnemy.hp * 2 : pokemonEnemy.hp * 2} 
                                  h={13} style={{backgroundColor: pokemonEnemy.hp > 50 ? "#6BF6A7" : pokemonEnemy.hp > 25 ? "#F2CF3C" : "#E75342"}} 
                                  />
                              </>
                            }
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
                  <View style={[styles.enemyDivGround, {backgroundColor: commonService.getColorFromType(pokemonEnemy.type[0].type.name)}]}>
                    <Image style={{width: "90%", height: "90%", margin: 10}} source={
                        pokemonEnemyType === 'grass' ? require(`../../assets/images/icons/grass.png`) :
                        pokemonEnemyType === 'rock' ? require(`../../assets/images/icons/rock.png`) :
                        pokemonEnemyType === 'normal' ? require(`../../assets/images/icons/normal.png`) :
                        pokemonEnemyType === 'fire' ? require(`../../assets/images/icons/fire.png`) :
                        pokemonEnemyType === 'electric' ? require(`../../assets/images/icons/electric.png`) :
                        pokemonEnemyType === 'flying' ? require(`../../assets/images/icons/flying.png`) :
                        pokemonEnemyType === 'psychic' ? require(`../../assets/images/icons/psychic.png`) :
                        pokemonEnemyType === 'water' ? require(`../../assets/images/icons/water.png`) :
                        pokemonEnemyType === 'ghost' ? require(`../../assets/images/icons/ghost.png`) :
                        pokemonEnemyType === 'insect' ? require(`../../assets/images/icons/bug.png`) :
                        pokemonEnemyType === 'ice' ? require(`../../assets/images/icons/ice.png`) :
                        pokemonEnemyType === 'fighting' ? require(`../../assets/images/icons/fighting.png`) :
                        pokemonEnemyType === 'poison' ? require(`../../assets/images/icons/poison.png`) :
                        pokemonEnemyType === 'dragon' ? require(`../../assets/images/icons/dragon.png`) :
                        pokemonEnemyType === 'ground' ? require(`../../assets/images/icons/ground.png`) :
                        pokemonEnemyType === 'stellar' ? require(`../../assets/images/icons/dark.png`) :
                        pokemonEnemyType === 'fairy' ? require(`../../assets/images/icons/fairy.png`) :
                        pokemonEnemyType === 'bug' ? require(`../../assets/images/icons/bug.png`) :
                        pokemonEnemyType === 'dark' ? require(`../../assets/images/icons/dark.png`) :
                        pokemonEnemyType === 'steel' ? require(`../../assets/images/icons/steel.png`) :
                        require('../../assets/images/icons/normal.png')
                      }
                    />
                  </View>
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
                              text={props.userPokemonTrainer.pokemons[pokemonFightingIndex].nickname ? commonService.stringToCapitalLetters(props.userPokemonTrainer.pokemons[pokemonFightingIndex].nickname) : commonService.stringToCapitalLetters(props.userPokemonTrainer.pokemons[pokemonFightingIndex].name.includes("-") ?
                              props.userPokemonTrainer.pokemons[pokemonFightingIndex].name.substring(0, props.userPokemonTrainer.pokemons[pokemonFightingIndex].name.indexOf("-"))
                                : props.userPokemonTrainer.pokemons[pokemonFightingIndex].name)} 
                              type={"battle-enemy-card-name"}
                              />
                            </Box>
                            <Box>
                          <PokeText 
                            color="#000000" 
                            text={`Lv ${props.userPokemonTrainer.pokemons[pokemonFightingIndex].level}`} 
                            type={"battle-enemy-card-level"}
                            />
                            </Box>
                        </Wrap>
                        <Wrap mt={15}>
                          <Box radius={3} w={202} h={15} style={{backgroundColor: "#4E6648"}} >
                              <View style={{position: "absolute", zIndex: 200, bottom: 0, left: 2}}>
                                <PokeText
                                  color={props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 25 ? "#4E6648" : "#000000"}
                                  text={`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp}/100`}
                                  type={"battle-enemy-card-level"}
                                />
                              </View>
                          <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                              w={wasAttacked ? props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp * 2 : props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp * 2} 
                              h={13} style={{backgroundColor: props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 50 ? "#6BF6A7" : props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 25 ? "#F2CF3C" : "#E75342"}} />
                          </Box>
                        </Wrap>
                        </Flex>
                    </View>
                    </View>
                  <Image
                    style={styles.playerImage}
                    source={{
                      uri: `${commonService.getPokemonMainImageBackForBattle(
                        props.userPokemonTrainer.pokemons[pokemonFightingIndex]?.sprites
                      )}`,
                    }}
                  />
                  <View style={[styles.playerDivGround, {backgroundColor: commonService.getColorFromType(props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name)}]}>
                    <Image style={{width: "90%", height: "90%", margin: 10}} source={
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'grass' ? require(`../../assets/images/icons/grass.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'rock' ? require(`../../assets/images/icons/rock.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'normal' ? require(`../../assets/images/icons/normal.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'fire' ? require(`../../assets/images/icons/fire.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'electric' ? require(`../../assets/images/icons/electric.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'flying' ? require(`../../assets/images/icons/flying.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'psychic' ? require(`../../assets/images/icons/psychic.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'water' ? require(`../../assets/images/icons/water.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'ghost' ? require(`../../assets/images/icons/ghost.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'insect' ? require(`../../assets/images/icons/bug.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'ice' ? require(`../../assets/images/icons/ice.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'fighting' ? require(`../../assets/images/icons/fighting.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'poison' ? require(`../../assets/images/icons/poison.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'dragon' ? require(`../../assets/images/icons/dragon.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'ground' ? require(`../../assets/images/icons/ground.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'stellar' ? require(`../../assets/images/icons/dark.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'fairy' ? require(`../../assets/images/icons/fairy.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'bug' ? require(`../../assets/images/icons/bug.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'dark' ? require(`../../assets/images/icons/dark.png`) :
                      props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name === 'steel' ? require(`../../assets/images/icons/steel.png`) :
                      require('../../assets/images/icons/normal.png')
                }/>
                  </View>
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
                            onClick={() => handleAttackModal(true)}
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



                {/* Pokemon attack modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonAttackModal}
                  onRequestClose={() => {
                    setOpenPokemonAttackModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={styles.modalViewModal}>
                      {props.userPokemonTrainer.pokemons[pokemonFightingIndex].skills.map((skill, i) => (
                        <Wrap w="100%" key={`skill-${i}`}>
                          <Box w="60%" mb={20}>
                            <PokeText 
                              text={`${commonService.stringToCapitalLetters(skill.name)}`}
                              color={"#000000"}
                              type={"skill-name"}
                            />
                            <PokeText 
                              text={`pp: ${skill.ppNow}/${skill.ppTotal} | dmg: ${skill.damage}`}
                              color={"#000000"}
                              type={"pp-text"}
                            />
                          </Box>
                          <Box w="40%">
                            <PokeButton
                              isReadOnly={skill.ppNow === 0}
                              styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                              variant="contained"
                              size="fullwidth"
                              text="Use"
                              onClick={() => handleAttack(skill)}
                              />
                          </Box>
                        </Wrap>
                        ))}
                        <PokeButton
                          styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Back"
                          onClick={() => setOpenPokemonAttackModal(false)}
                          />

                      </View>
                    </View>
                  </Modal>




                {/* Pokemon changed info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openModalChangingPokemon}
                  onRequestClose={() => {
                    setOpenModalChangingPokemon(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={styles.modalViewModal}>
                      <PokeText 
                        text={openModalChangingPokemonInfo}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                        <PokeButton
                          styleType={pokemonEnemy?.type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Close"
                          onClick={() => {
                            setOpenModalChangingPokemon(false);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>

                {/* Pokemon gameover info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openModalGameOver}
                  onRequestClose={() => {
                    setOpenModalGameOver(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={styles.modalViewModal}>
                      <PokeText 
                        text={"Game Over!!! You have no pokemons left to battle!"}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                        <PokeButton
                          styleType={pokemonEnemy?.type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Close"
                          onClick={() => { 
                            setOpenModalGameOver(false);
                            setGameOver(true)
                          }}
                        />
                      </View>
                    </View>
                  </Modal>


                {/* Pokemon attacked info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonAttackedInfoModal}
                  onRequestClose={() => {
                    setOpenPokemonAttackedInfoModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={styles.modalViewModal}>
                      <PokeText 
                        text={pokemonAttackedInfoModalMessage}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                        <PokeButton
                          styleType={pokemonEnemy?.type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Close"
                          onClick={() => {
                            setOpenPokemonAttackedInfoModal(false);
                          }}
                        />
                      </View>
                    </View>
                  </Modal>



                {/* Pokemon attack info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonAttackInfoModal}
                  onRequestClose={() => {
                    setOpenPokemonAttackInfoModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={styles.modalViewModal}>
                      <PokeText 
                        text={pokemonAttackInfoModalMessage}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                        <PokeButton
                          styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Close"
                          onClick={() => {
                            setOpenPokemonAttackInfoModal(false);
                            handleAttacked();
                          }}
                        />
                      </View>
                    </View>
                  </Modal>



                {/* Pokemon didtn't caught modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonDidntCaughtModal}
                  onRequestClose={() => {
                    setOpenPokemonDidntCaughtModal(false);
                  }}
                >
                <View style={styles.centeredViewModal}>
                  <View style={styles.modalViewModal}>
                      <PokeText 
                        text={"Pokemon couldn't be caught"}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                      <PokeButton
                        styleType={pokemonEnemy?.type[0].type.name ?? ""}
                        variant="contained"
                        size="fullwidth"
                        text="Close"
                        onClick={handleDidntCaught}
                      />
                    </View>
                  </View>
                </Modal>

                {/* Pokemon caught modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonCaughtModal}
                  onRequestClose={() => {
                    setOpenPokemonCaughtModal(false);
                    handleRunAway();
                    didCapturePokemon.value = 0;
                    pokemonOpacity.value = withTiming(1, { duration: 500 });
                  }}
                >
                <View style={styles.centeredViewModal}>
                  <View style={styles.modalViewModal}>
                      <PokeText 
                        text={`${commonService.stringToCapitalLetters(pokemonEnemy.name)} caught !!!`}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                      <PokeButton
                        styleType={pokemonEnemy?.type[0].type.name ?? ""}
                        variant="contained"
                        size="fullwidth"
                        text="Close"
                        onClick={() => {
                          setOpenPokemonCaughtModal(false);
                          handleCaptureEnemy(pokemonEnemy);
                          handleRunAway();
                          didCapturePokemon.value = 0;
                          pokemonOpacity.value = withTiming(1, { duration: 500 });
                        }}
                      />
                    </View>
                  </View>
                </Modal>
              </ImageBackground>
              ) : (
                <ImageBackground  style={styles.image} source={require(`../../assets/images/battlefields/gameover.gif`)}>
                  <View style={{margin: 20}}>
                  <Image style={{width: "100%", top: -30}} source={require(`../../assets/images/characters/joy-nurse.gif`)}/>
                    <PokeText
                      text={`GAME OVER`}
                      color={"#000"}
                      type={"gameover-title"}
                      />
                    <PokeText
                      text={`You're out of Pokemons, so you went to the Pokemon Center`}
                      color={"#000"}
                      type={"modal-text"}
                    />
                    <PokeButton
                      styleType={pokemonEnemy.type[0].type.name}
                      size="fullwidth"
                      variant="contained"
                      color="#4E6648"
                      text="Cure Pokemons"
                      onClick={handleCurePokemons}
                    />
                    </View>
                  </ImageBackground>
              )}
            </>
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

