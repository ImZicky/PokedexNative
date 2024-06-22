import React, { useEffect, useState } from "react";
import { Box, Flex, Wrap } from "@react-native-material/core";
import { StyleSheet, Image, ImageBackground, View, Modal, Button } from "react-native";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import { PokeballTypeEnum, PokemonForBattle, PokemonForBattleSkills } from "../../service/api/types/PokemonForBattle";
import { PokemonTrainer, PokemonTrainerItem } from "../../service/api/types/PokemonTrainer";
import PokemonFirstChoice from "./components/PokemonFirstChoice.";
import { Pokemon } from "pokenode-ts";
import PokeButton from "../../components/buttons/PokeButton";
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, useWorkletCallback, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import { Audio } from 'expo-av';
import { MusicName } from "../../service/api/types/Music";
import PokeIconButton from "../../components/buttons/PokeIconButton";

export type PokeBattleProps = {
  navigation: any;
  userPokemonTrainer: PokemonTrainer;
  isBattling: boolean;
  setIsBattling: (value: boolean) => void;  
  handleSetPokemonBattling: (pokemon : PokemonForBattle, position: number) => void;
  handleCapturePokemon: (pokemon : PokemonForBattle, moneyReward: number, chosenPokeball: PokeballTypeEnum) => void;
  handleChooseOtherPokemon: (pokemon : PokemonForBattle) => void;
  handleHealPokemon: (position : number, potionName: string) => void;
  handleUsePokeball: (pokeballName : string) => void;
  handleHealBattlingPokemons: () => void;
  playSoundDefault: (name: MusicName) => void;
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
  const [chosenPokeball, setChosenPokeball] = useState<PokeballTypeEnum>("Pokeball");
  const [healPokemonText, setHealPokemonText] = useState<string>("Heal Pokemons");

  //MODALS
  const [openPokemonDidntCaughtModal, setOpenPokemonDidntCaughtModal] = useState<boolean>(false);
  const [openPokemonCaughtModal, setOpenPokemonCaughtModal] = useState<boolean>(false);

  const [openPokemonAttackInfoModal, setOpenPokemonAttackInfoModal] = useState<boolean>(false);
  const [pokemonAttackInfoModalMessage, setPokemonAttackInfoModalMessage] = useState<string>("");
  const [openPokemonAttackModal, setOpenPokemonAttackModal] = useState<boolean>(false);

  const [openPokemonInfoMessageModal, setOpenPokemonInfoMessageModal] = useState<boolean>(false);
  const [pokemonModalMessage, setPokemonModalMessage] = useState<string>("");
  const [openPokemonsModal, setOpenPokemonsModal] = useState<boolean>(false);

  const [openLevelUpModal, setOpenLevelUpModal] = useState<boolean>(false);

  const [openPokemonAttackedInfoModal, setOpenPokemonAttackedInfoModal] = useState<boolean>(false);
  const [pokemonAttackedInfoModalMessage, setPokemonAttackedInfoModalMessage] = useState<string>("");
  
  const [openModalChangingPokemon, setOpenModalChangingPokemon] = useState<boolean>(false);
  const [openModalChangingPokemonInfo, setOpenModalChangingPokemonInfo] = useState<string>("");
  
  const [openBagModal, setOpenBagModal] = useState<boolean>(false);

  const [openModalGameOver, setOpenModalGameOver] = useState<boolean>(false);

  const [openRunModal, setOpenRunModal] = useState<boolean>(false);

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();



  //SOUNDS

  const [soundHealPokemons, setSoundHealPokemons] = useState<any>();
  const [soundHealPokemon, setSoundHealPokemon] = useState<any>();
  const [soundFaintPokemon, setSoundFaintPokemon] = useState<any>();
  const [soundAttackPokemon, setSoundAttackPokemon] = useState<any>();
  const [soundDodgePokemon, setSoundDodgePokemon] = useState<any>();
  const [soundLevelUpPokemon, setSoundLevelUpPokemon] = useState<any>();
  const [soundWinPokemon, setSoundWinPokemon] = useState<any>();
  const [soundCapturePokemon, setSoundCapturePokemon] = useState<any>();

  const playSoundBackground = async () => {
    props.playSoundDefault('battle');
  }

  const playSoundLavender = async () => {
    props.playSoundDefault('lavender');
  }

  const stopSoundBackground = async () => {
    props.playSoundDefault('turnOff');
  }

  const playSoundFaintPokemon = async () => {
    stopSoundBackground();
    const { sound } = await Audio.Sound.createAsync(require('../../assets/musics/faint.mp3'));
    setSoundFaintPokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundFaintPokemon
    ? () => {
      soundFaintPokemon.unloadAsync();
    }
    : undefined;
  }, [soundFaintPokemon]);


  const playSoundHealPokemons = async () => {
    stopSoundBackground();
    const { sound } = await Audio.Sound.createAsync(require('../../assets/musics/healPokemons.mp3'));
    setSoundHealPokemons(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundHealPokemons
    ? () => {
      soundHealPokemons.unloadAsync();
    }
    : undefined;
  }, [soundHealPokemons]);


  const playSoundHealPokemon = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/musics/heal.mp3'));
    setSoundHealPokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundHealPokemon
    ? () => {
      soundHealPokemon.unloadAsync();
    }
    : undefined;
  }, [soundHealPokemon]);


  const playAttackPokemon = async () => {
    const randInt = parseInt(`${Math.random() * 4}`);
    const { sound } = await Audio.Sound.createAsync(
      randInt === 1 ? require('../../assets/musics/attack-1.mp3') :
      randInt === 2 ? require('../../assets/musics/attack-2.mp3') :
      randInt === 3 ? require('../../assets/musics/attack-3.mp3') :
      require('../../assets/musics/attack-4.mp3')
    );
    setSoundAttackPokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundAttackPokemon
    ? () => {
      soundAttackPokemon.unloadAsync();
    }
    : undefined;
  }, [soundAttackPokemon]);

  const playDodgePokemon = async () => {
    const randInt = parseInt(`${Math.random() * 2}`);
    const { sound } = await Audio.Sound.createAsync(
      randInt === 1 ? require('../../assets/musics/dodge-1.mp3') :
      require('../../assets/musics/dodge-2.mp3')
    );
    setSoundDodgePokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundDodgePokemon
    ? () => {
      soundDodgePokemon.unloadAsync();
    }
    : undefined;
  }, [soundDodgePokemon]);


  const playSoundLevelUp = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/musics/levelUp.mp3')
    );
    setSoundLevelUpPokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundLevelUpPokemon
    ? () => {
      soundLevelUpPokemon.unloadAsync();
    }
    : undefined;
  }, [soundLevelUpPokemon]);


  const playSoundWin = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/musics/win.mp3')
    );
    setSoundWinPokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundWinPokemon
    ? () => {
      soundWinPokemon.unloadAsync();
    }
    : undefined;
  }, [soundWinPokemon]);


  const playCaptureSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/musics/capture.mp3')
    );
    setSoundCapturePokemon(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundCapturePokemon
    ? () => {
      soundCapturePokemon.unloadAsync();
    }
    : undefined;
  }, [soundCapturePokemon]);


  useEffect(() => {
    if(openPokemonCaughtModal) {      
      props.playSoundDefault("turnOff")
      playCaptureSound();
    }
  }, [openPokemonCaughtModal]);



  useEffect(() => {
    if(haveAPokemonForBattle) playSoundBackground();
  }, [haveAPokemonForBattle]);

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      handleStartBattleAnimation('start');
      setLoading(true);
      pokemonService.getRamdomPokemon().then((pokemonApi: Pokemon) => {
          pokemonService.getPokemonForBattle(pokemonApi, props.userPokemonTrainer.level, undefined).then(pokeEnemy => {
            setPokemonEnemy(pokeEnemy);
          });
          setPokemonEnemyType((pokemonApi?.types[0].type.name ?? "grass"));          
          setAttacked(false);
          handleStartBattleAnimation('animate');
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false);
        });
        handleStartBattleAnimation('fade');
    };
    if (pokemonEnemy === undefined) fetchPokemon();
  });

  //Methods
  const handleStartBattleAnimation = (value: string) => {
    if(value === 'start'){
      battleStartDivTop.value = 0;
      battleStartDivBottom.value = 0;
      battleStartEnemyDivLeft.value = 250;
      battleStartPokemonDivLeft.value = -250;
    }
    if(value === 'animate'){
      battleStartDivTop.value = withTiming(-700, { duration: 6000 });
      battleStartDivBottom.value = withTiming(700, { duration: 6000 });
      battleStartEnemyDivLeft.value = withTiming(60, { duration: 3000 });
      battleStartPokemonDivLeft.value = withTiming(10, { duration: 3000 });
    }
  }

  const handleRunAway = () => {
    props.setIsBattling(true);
    props.playSoundDefault("turnOff");
    pokemonEnemyOpacity.value = withTiming(1, { duration: 1000 });
    pokemonOpacity.value = withTiming(1, { duration: 1000 });
    setLoading(true);
    handleStartBattleAnimation('start');
    pokemonService
      .getRamdomPokemon()
      .then((pokemonApi: Pokemon) => {
        pokemonService.getPokemonForBattle(pokemonApi, props.userPokemonTrainer.level, undefined).then(pokeEnemy => {
          setPokemonEnemy(pokeEnemy);          
          playSoundBackground();
          setTimeout(() => {
            handleStartBattleAnimation('animate');

          }, 1500);
        });
        setPokemonEnemyType((pokemonApi?.types[0].type.name ?? "grass"));
        setAttacked(false);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
    handleStartBattleAnimation('fade');
  }

  const handleAttackModal = (value: boolean) => {
    setOpenPokemonAttackModal(value);
  }

  const handleAttack = (skill: PokemonForBattleSkills) => {
    if(props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 0){      
      setOpenPokemonAttackModal(false);
      
      if(attacked) setAttacked(false);
      let tempHp = pokemonEnemy.hp;
      let tempHpTotal = pokemonEnemy.hpTotal;
    
      if(tempHp){
        setAttacked(true);
        const damagePlus = parseInt(`${Math.random() * 5}`);
        const totalDamage = props.userPokemonTrainer.pokemons[pokemonFightingIndex].level > pokemonEnemy.level ? 
          ((skill.damage + damagePlus) +  (props.userPokemonTrainer.pokemons[pokemonFightingIndex].level - pokemonEnemy.level)) : 
          ((skill.damage + damagePlus) -  (pokemonEnemy.level - props.userPokemonTrainer.pokemons[pokemonFightingIndex].level));

        if(totalDamage >= 19 && damagePlus !== 0) {
          tempHp = (tempHp - totalDamage);
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and got a critical hit!`);
          skill.ppNow = skill.ppNow - 1;
          playAttackPokemon();
          handleAnimateAttack()
          setTimeout(()=> {
            setOpenPokemonAttackInfoModal(true);
          }, 2000);  
        }
        if(damagePlus === 0) {
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and missed the attack!`);
          skill.ppNow = skill.ppNow - 1;
          playDodgePokemon();
          setTimeout(()=> {
            setOpenPokemonAttackInfoModal(true);
          }, 1000);  
        }
        if(totalDamage > 0 && totalDamage < 19 && damagePlus !== 0) {
          tempHp = (tempHp - totalDamage);
          setPokemonAttackInfoModalMessage(`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].name} used ${skill.name} and sucessfully attacked!`);
          skill.ppNow = skill.ppNow - 1;
          playAttackPokemon();
          handleAnimateAttack()
          setTimeout(()=> {
            setOpenPokemonAttackInfoModal(true);
          }, 2000);  
        }

        enemyHp.value = tempHp;
        enemyHpTotal.value = tempHpTotal;

        setPokemonEnemy((prevState) => {
          return {
            ...prevState,
            hp: tempHp,
          };
        });    
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
          playAttackPokemon();
          handleAnimateAttacked();
          setTimeout(()=> {
            setOpenPokemonAttackedInfoModal(true);
          }, 2000);
        }
        if(damagePlus === 0) {
          setPokemonAttackedInfoModalMessage(`${pokemonEnemy.name} used ${skill.name} and missed the attack!`);
          playDodgePokemon();
          setTimeout(()=> {
            setOpenPokemonAttackedInfoModal(true);
          }, 1000);
        }
        if(totalDamage > 0 && totalDamage < 19 && damagePlus !== 0) {
          temp.hp = temp.hp - totalDamage;
          setPokemonAttackedInfoModalMessage(`${pokemonEnemy.name} used ${skill.name} and sucessfully attacked!`);
          playAttackPokemon();
          handleAnimateAttacked();
          setTimeout(()=> {
            setOpenPokemonAttackedInfoModal(true);
          }, 2000); 
        }

        temp.hp = temp.hp <= 0 ? 0 : temp.hp;
        handleSetPlayerPokemon(temp);

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
            pokemonOpacity.value = withTiming(0, { duration: 1000 });
            handleGameOver()
          };
        }
      }
      if(wasAttacked) setWasAttacked(false);
    }
    else{
      pokemonEnemyOpacity.value = withTiming(0, { duration: 1000 });
      props.playSoundDefault("turnOff");
      playSoundWin();
      handleIncreaseLevelXp(10);
      setTimeout(()=> {
        handleRunAway();
      }, 5000)
    }
    if(wasAttacked) setWasAttacked(false);
  }

  const handleChooseOtherPokemon = (pokemon: PokemonForBattle) => {
    props.handleChooseOtherPokemon(pokemon);
    setOpenPokemonsModal(false);
    setPokemonModalMessage(`${pokemon.name} was thrown!!!`);
    setOpenPokemonInfoMessageModal(true);
  }


  const handleIncreaseLevelXp = (value: number) => {
    let temp = props.userPokemonTrainer.pokemons[pokemonFightingIndex];
    temp.levelXp = temp.levelXp + value;

    if(Math.floor(temp.levelXp / 100) > temp.level){ // passed level
      playSoundLevelUp();
      temp.level = Math.floor(temp.levelXp / 100);
      temp.hpTotal = temp.level * 10;
      temp.hp = temp.hpTotal;
      setOpenLevelUpModal(true);
    }

    handleSetPlayerPokemon(temp);
  }

  const handleImprooveAttack = (skill: PokemonForBattleSkills) => {

    let temp = props.userPokemonTrainer.pokemons[pokemonFightingIndex];
    let skillToImproove = temp.skills.find(x => x.name === skill.name) 
    skillToImproove.damage += 2;
    skillToImproove.ppTotal += 1;
    skillToImproove.ppNow = skillToImproove.ppTotal;

    temp.skills.splice(temp.skills.findIndex(x => x.name === skill.name), 1);
    temp.skills.push(skillToImproove);
    handleSetPlayerPokemon(temp);
    setOpenLevelUpModal(false);
  }

  const handleBagModal = (value: boolean) => {
    setOpenBagModal(value);
  }

  const handleUseItem = (item: PokemonTrainerItem) => {
    if(item.category === "Heal"){
      playSoundHealPokemon();
      props.handleHealPokemon(pokemonFightingIndex, item.name);
    }
    if(item.category === "Pokeball"){
      const pokeballType = getPokeballType(item.name);
      setChosenPokeball(pokeballType);
    }
    setOpenBagModal(false)
  }

  const getPokeballType = (pokeball: string) : PokeballTypeEnum => {
    switch (pokeball) {
      case "Great Ball": return "Great Ball";
      case "Ultra Ball": return "Ultra Ball";
      case "Master Ball": return "Master Ball";
      default: return "Pokeball";
    }
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
    handleIncreaseLevelXp(30);
    const moneyReward = parseInt(`${Math.random() * 1000}`) + 300;
    props.handleCapturePokemon(pokemon, moneyReward, chosenPokeball);
  }

  const handleDidntCaught = () => {
    handleAttacked();
    setOpenPokemonDidntCaughtModal(false)
  }

  const handleHealAllPokemons = async () => {
    props.playSoundDefault('turnOff');
    playSoundHealPokemons();
    setPokemonFightingIndex(0);
    props.handleHealBattlingPokemons()
    setHealPokemonText("Healing . . .")
    setTimeout(()=> {
      handleRunAway()
      setGameOver(false);
      setHealPokemonText("Heal Pokemons")
    }, 5000);
  }

  const handleRunModal = (value: boolean, wish: "Battle" | "Home") => {
    if(wish === "Battle") 
      handleRunAway();
    else 
      props.setIsBattling(false);

    playSoundLavender();
    setOpenRunModal(value);
  }

  const getHpWidth = (hp: number, hpTotal : number) => {
    const maxValue =  200;
    return Math.ceil((hp * maxValue) / hpTotal);
  }

  const getLevelWidth = (levelXp : number) => {
    const levelBase = Math.floor((levelXp / 100));
    const nextLevel = (levelBase * 100) + 100;
    const diffToNext = nextLevel - (levelXp);
    return Math.floor(200 - (diffToNext * 2));
  }

  const getHpBackgroundColor = (hp: number, hpTotal : number) : string => {
    const maxValue =  200;
    const percent = Math.ceil((hp * maxValue) / hpTotal);
    if(percent > 100) return "#6BF6A7";
    if(percent <= 100 && percent > 50) return "#F2CF3C";
    if(percent <= 50) return "#E75342";
  }

  const handleUsePokeball = () => {
    if(pokemonEnemy !== undefined) {
      enemyHp.value = pokemonEnemy.hp;
      enemyHpTotal.value = pokemonEnemy.hpTotal;
    }
    props.handleUsePokeball(chosenPokeball);
  }


  //CAPTURE-ANIMATIONS
  const isCapturingPokemon = useSharedValue(0);
  const didCapturePokemon = useSharedValue(0);
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const pokeballWidth = useSharedValue(80)
  const pokeballHeight = useSharedValue(80)
  const pokeballRotate = useSharedValue(0)
  const battleStartDivTop = useSharedValue(0);
  const battleStartDivBottom = useSharedValue(0);
  const battleStartPokemonDivLeft = useSharedValue(-120);
  const battleStartEnemyDivLeft = useSharedValue(120);
  let enemyHp = useSharedValue(0);
  let enemyHpTotal = useSharedValue(0);
  let chosenPokeballValue = useSharedValue('Pokeball');

  const pokemonLeft = useSharedValue(0);
  const pokemonEnemyOpacity = useSharedValue(1);

  const pokemonEnemyLeft = useSharedValue(0);
  const pokemonOpacity = useSharedValue(1);


  // Attack Move
  const handleAnimateAttack = () => {
    //Move closer and come back
    pokemonLeft.value = withRepeat(withTiming(100, { duration: 500 }), 2, true);
    //Double Blink
    pokemonEnemyOpacity.value = withRepeat(withTiming(0, { duration: 500 }), 4, true);
  }

  // Attacked Move
  const handleAnimateAttacked = () => {
    //Move closer and come back
    pokemonEnemyLeft.value = withRepeat(withTiming(-100, { duration: 500 }), 2, true);
    //Double Blink
    pokemonOpacity.value = withRepeat(withTiming(0, { duration: 500 }), 4, true);
  }


  const calculateIfCaptured = useWorkletCallback((hp: number, hpTotal: number, chosenPokeball: string) => {
    let probabilityIncrease = 0;
    let caughtOn = 90;

    if(chosenPokeball === 'Master Ball') {
      probabilityIncrease = 20;
      caughtOn = 30;
    }

    if(chosenPokeball === 'Ultra Ball') {
      probabilityIncrease = 10;
      caughtOn = 50;
    }

    if(chosenPokeball === 'Great Ball') {
      probabilityIncrease = 5;
      caughtOn = 75;
    }

    const probability = parseInt(`${Math.random() * 100}`) + probabilityIncrease;
    let hpPercentage = Math.ceil((hp * 100) / hpTotal)

    if(hpPercentage > 50) {
      return  probability > caughtOn - 5;
    }
    else if(hpPercentage > 25 && hpPercentage <= 50) {
      return probability > caughtOn - 10;
    }
    else if(hpPercentage <= 25) {
      return probability > caughtOn - 15;
    }
  });

  const handleCapturePokemon = useWorkletCallback((pEnemyHp: number, pEnemyHpTotal: number, pChosenPokeball: string) => {
    if(calculateIfCaptured(pEnemyHp, pEnemyHpTotal, pChosenPokeball)) {
      didCapturePokemon.value = 1;
      pokemonEnemyOpacity.value = withDelay(5000, withTiming(1, { duration: 500 }));

      pokeballWidth.value = withTiming(80, { duration: 60 });
      pokeballHeight.value = withTiming(80, { duration: 60 });
      translateX.value = withTiming(0, { duration: 500 });
      translateY.value = withTiming(0, { duration: 500 });

      isCapturingPokemon.value = 0;
      enemyHp.value = 0;
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
        withRepeat(withTiming(100, { duration: 250 }), 100, true),
        withTiming(50, { duration: 250 })
      );

      pokeballHeight.value = withSequence(
        withRepeat(withTiming(100, { duration: 250 }), 100, true),
        withTiming(50, { duration: 250 })
      );

      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onFinish: (event) => {
      if(didThrowPokeball(event.translationX, event.translationY)){
        if(pokemonEnemy){
          enemyHp.value = pokemonEnemy.hp;
          enemyHpTotal.value = pokemonEnemy.hpTotal;
          chosenPokeballValue.value = chosenPokeball;
        }

        runOnJS(handleUsePokeball)();

        isCapturingPokemon.value = 1;
        pokemonEnemyOpacity.value = withTiming(0, { duration: 500 });

        handleCapturePokemon(enemyHp.value, enemyHpTotal.value, chosenPokeballValue.value);
        if(didCapturePokemon.value === 0) {
          pokemonEnemyOpacity.value = withTiming(1, { duration: 500 });
          pokeballWidth.value = withTiming(80, { duration: 60 });
          pokeballHeight.value = withTiming(80, { duration: 60 });
          translateX.value = withTiming(0, { duration: 500 });
          translateY.value = withTiming(0, { duration: 500 });  
          pokeballRotate.value = withSequence(
            withRepeat(withTiming(0, { duration: 1000 }), 1, true)
          );
          runOnJS(setOpenPokemonDidntCaughtModal)(true);
        }else
        {
          pokemonEnemyOpacity.value = withTiming(0, { duration: 500 });
        }
      }
      else{
        if(didCapturePokemon.value === 0) {

          pokeballRotate.value = withSequence(
            withRepeat(withTiming(0, { duration: 1000 }), 1, true)
          );
          
          pokemonEnemyOpacity.value = withTiming(1, { duration: 500 });

          pokeballWidth.value = withTiming(80, { duration: 60 });
          pokeballHeight.value = withTiming(80, { duration: 60 });
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

  const reanimationPokemonEnemyStyle = useAnimatedStyle(() => {
    return {
      opacity: pokemonEnemyOpacity.value,
    };
  });

  const reanimationPokemonStyle = useAnimatedStyle(() => {
    return {
      opacity: pokemonOpacity.value,
    };
  });

  const animationBattleStartTopDivStyle = useAnimatedStyle(() => {
    return {
      top: battleStartDivTop.value,
    };
  });
  const animationBattleStartBottomDivStyle = useAnimatedStyle(() => {
    return {
      top: battleStartDivBottom.value,
    };
  });

  const animationBattleStartEnemyDivStyle = useAnimatedStyle(() => {
    return {
      left: battleStartEnemyDivLeft.value,
    };
  });

  const animationBattleStartPokemonDivStyle = useAnimatedStyle(() => {
    return {
      left: battleStartPokemonDivLeft.value,
    };
  });

  const animationPokemonAttackStyle = useAnimatedStyle(() => {
    return {
      left: pokemonLeft.value,
      opacity: pokemonOpacity.value,
    };
  });

  const animationPokemonAttackedStyle = useAnimatedStyle(() => {
    return {
      left: pokemonEnemyLeft.value,
      opacity: pokemonEnemyOpacity.value,
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
      left: 120,
      alignItems: "center",
      alignContent: "center",
    },
    playerDiv: {
      position: "absolute",
      bottom: 80,
      left: -120,
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
      zIndex: 100,
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
        {
          rotateX:"75deg"
        },
      ],
    },
    playerDivHeader: {
      width: '100%',
    },
    playerDivInfosBorder: {
      zIndex: 100,
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
      opacity: 1,
      width: "110%", 
      height: "100%", 
      position: "absolute"
    },
    enemyImageDiv: {
      position: "absolute", 
      zIndex: 10,
      width: 180, 
      height: 180, 
      top: 55, 
      left: 80
    },
    playerImage: { 
      zIndex: 10,
      position: "absolute", 
      width: "110%", 
      height: "100%", 
    },
    playerImageDiv: {
      position: "absolute", 
      zIndex: 10,
      width: 180,
      height: 180,
      bottom: 0, 
      left: 0, 
    },
    circle: {
      width: 60,
      height: 60,
      zIndex: 50
    },
    pokeballImage :{
      width: 80,
      height: 80,
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
      paddingLeft: 270,
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
    },
    pokeballQuantityInfo:{
      position: "absolute", 
      right: "21%", 
      bottom: "18%", 
      zIndex: 300, 
      padding: 5, 
      backgroundColor: "#ECEDD0", 
      borderRadius: 50, 
      borderColor: "#4E6648", 
      borderStyle: "solid", 
      borderWidth: 2 
    }
  });

  return (
    <>
      {pokemonEnemy && !loading ? (
        <>
        {!haveAPokemonForBattle ? (
          <PokemonFirstChoice 
            playSoundDefault={(name: MusicName) => props.playSoundDefault(name)}
            setHaveAPokemonForBattle={(value: boolean) => setHaveAPokemonForBattle(value)} trainer={props.userPokemonTrainer} 
          />
        ):(
          <>
            {!gameOver && props.isBattling ? (
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

                {/* POKEMON BATTLE START ANIMATION */}
                <Animated.View style={[{zIndex: 2000, width: "100%", height: "65%", backgroundColor: "#FFF", top: -10}, animationBattleStartTopDivStyle]}>
                  <View style={{width: "100%", top: 290, left: 50 }}>
                    <PokeText 
                      color="#FFF"
                      text=" > BATTLE "
                      backgroungColor={`${commonService.getColorFromType(pokemonEnemy.type[0].type.name)}`}
                      type="battle-enemy-card-level"
                    />
                    <PokeText 
                      color={`${commonService.getColorFromType(pokemonEnemy.type[0].type.name)}`}
                      text=" A POKEMON APPEARED!     "
                      type="modal-title"
                    />
                  </View>
                </Animated.View>
                <Animated.View style={[{zIndex: 2000, width: "100%", height: "50%", backgroundColor: "#FFF", top: 10}, animationBattleStartBottomDivStyle]} />

              {/* ENEMY DIV */}
                <Animated.View style={[styles.enemyDiv, animationBattleStartEnemyDivStyle]}>
                  <View style={styles.enemyDivInfosBorder}>              
                    <View style={styles.enemyDivInfos}>
                      <Flex style={styles.enemyDivHeader} >
                        {
                          pokemonEnemy.shiny && (
                            <Image
                              style={{width: 20, height: 20, position: "absolute", right: -5, top: 35}}
                              source={require('../../assets/images/icons/star-shiny.gif')}
                            />
                          )
                        }
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
                          <Box radius={3} w={202} h={16} style={{backgroundColor: "#4E6648"}} >
                            {pokemonEnemy.hp > 0 && 
                              <>
                                <View style={{position: "absolute", zIndex: 200, bottom: 0, left: 2}}>
                                  <PokeText
                                    color={pokemonEnemy.hp > 25 ? "#4E6648" : "#000000"}
                                    text={`${pokemonEnemy.hp}/${pokemonEnemy.hpTotal}`}
                                    type={"battle-enemy-card-level"}
                                    />
                                </View>
                                <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                                  // w={getHpWidth(pokemonEnemy.hp, pokemonEnemy.hpTotal)} 
                                  w={attacked ? Math.ceil((pokemonEnemy.hp * 200) / pokemonEnemy.hpTotal) : Math.ceil((pokemonEnemy.hp * 200) / pokemonEnemy.hpTotal) } 
                                  h={15}
                                  style={{backgroundColor: getHpBackgroundColor(pokemonEnemy.hp, pokemonEnemy.hpTotal)}}
                                  />
                              </>
                            }
                          </Box>
                        </Wrap>
                        </Flex>
                    </View>
                    </View>
                    <Animated.View 
                        style={[styles.enemyImageDiv, reanimationPokemonEnemyStyle]}
                      >
                      <Image
                        style={[styles.enemyImage, animationPokemonAttackedStyle]}
                        source={{
                          uri: `${commonService.getPokemonMainImageFrontForBattle(
                            pokemonEnemy?.sprites, pokemonEnemy.shiny
                          )}`,
                        }}
                      />
                    </Animated.View>
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
                </Animated.View>

                {/* POKEBALL THROWING */}
                {
                  props.userPokemonTrainer.items.find(x => x.category === "Pokeball") && props.userPokemonTrainer.items.find(x  => x.name === chosenPokeball).quantity > 0 &&
                  <>
                    <View style={styles.pokeballQuantityInfo}>
                      <PokeText 
                        color="#4E6648"
                        backgroungColor="#ECEDD0"
                        type="skill-name"
                        text={`${props.userPokemonTrainer.items.find(x  => x.name === chosenPokeball).quantity}`}
                      />
                    </View>
                    <View style={styles.pokeballDiv}>
                      <View style={styles.pokemonPokeballDiv}></View>
                      <PanGestureHandler onGestureEvent={panGestureEvent}>
                        <Animated.View 
                          style={[styles.circle, reanimationViewStyle]}
                          >
                          <Animated.Image source={
                            chosenPokeball === "Master Ball" ? require("../../assets/images/pokeballs/masterBall.png") :
                            chosenPokeball === "Ultra Ball" ? require("../../assets/images/pokeballs/ultraBall.png") :
                            chosenPokeball === "Great Ball" ? require("../../assets/images/pokeballs/greatBall.png") :
                            require("../../assets/images/pokeballs/pokeball.png")
                          }
                            style={[styles.pokeballImage, reanimationPokeballStyle]}
                            />
                          </Animated.View>
                      </PanGestureHandler>
                    </View>
                  </>
                }

                {/* TRAINER POKEMON DIV */}
                <Animated.View style={[styles.playerDiv, animationBattleStartPokemonDivStyle]}>    
                  <View style={styles.playerDivInfosBorder}>              
                    <View style={styles.playerDivInfos}>  
                      {
                          props.userPokemonTrainer.pokemons[pokemonFightingIndex].shiny && (
                            <Image
                              style={{width: 20, height: 20, position: "absolute", right: 5, top: 45}}
                              source={require('../../assets/images/icons/star-shiny.gif')}
                            />
                          )
                      }
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
                            text={`Lv ${Math.floor(props.userPokemonTrainer.pokemons[pokemonFightingIndex].levelXp / 100)}`} 
                            type={"battle-enemy-card-level"}
                            />
                            </Box>
                        </Wrap>
                        <Wrap mt={5}>
                          <Box radius={5} w={202} h={5} style={{backgroundColor: "#4E6648", marginBottom: 5}}>
                            <Box 
                              borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                              w={wasAttacked ? getLevelWidth(props.userPokemonTrainer.pokemons[pokemonFightingIndex].levelXp) 
                                          : getLevelWidth(props.userPokemonTrainer.pokemons[pokemonFightingIndex].levelXp) 
                              } 
                              h={5}
                              style={{backgroundColor: "#6BF6A7"}}
                            />
                          </Box>

                          <Box radius={3} w={202} h={16} style={{backgroundColor: "#4E6648"}}>
                            <View style={{position: "absolute", zIndex: 200, bottom: 0, left: 2}}>
                              <PokeText
                                color={props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp > 25 ? "#4E6648" : "#000000"}
                                text={`${props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp}/${props.userPokemonTrainer.pokemons[pokemonFightingIndex].hpTotal}`}
                                type={"battle-enemy-card-level"}
                              />
                            </View>
                            <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} 
                              w={wasAttacked ? getHpWidth(props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp, props.userPokemonTrainer.pokemons[pokemonFightingIndex].hpTotal) : getHpWidth(props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp, props.userPokemonTrainer.pokemons[pokemonFightingIndex].hpTotal)} 
                              h={15} 
                              style={{backgroundColor: getHpBackgroundColor(props.userPokemonTrainer.pokemons[pokemonFightingIndex].hp, props.userPokemonTrainer.pokemons[pokemonFightingIndex].hpTotal)}}
                            />
                          </Box>
                        </Wrap>
                        </Flex>
                    </View>
                  </View>

                  <Animated.View 
                    style={[styles.playerImageDiv, reanimationPokemonStyle]}
                  >
                    <Animated.Image
                      style={[styles.playerImage, animationPokemonAttackStyle]}
                      source={{
                        uri: `${commonService.getPokemonMainImageBackForBattle(
                          props.userPokemonTrainer.pokemons[pokemonFightingIndex]?.sprites,
                          props.userPokemonTrainer.pokemons[pokemonFightingIndex]?.shiny,
                        )}`,
                      }}
                    />
                  </Animated.View>


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
                      }                    
                    />
                  </View>
                </Animated.View>

                {/* INTERACTIONS DIV */}
                <Flex style={styles.playerInteractionsDiv}>
                  <View style={styles.playerInteractionsDivBorder}>
                    <View style={styles.playerInteractionsDivInfos}>
                      <Wrap w={"100%"}>
                        <Box w={"50%"} style={{alignItems: "center"}}>
                          <PokeButton 
                            size="small"
                            variant="text"
                            color="menuGreen"
                            text="Fight" 
                            styleType={"invisible"}
                            onClick={() => handleAttackModal(true)}
                          />
                        </Box>
                        <Box w={"50%"} style={{alignItems: "center"}}>
                        <PokeButton 
                            size="small"
                            variant="text"
                            color={"menuGreen"}
                            text="Bag" 
                            styleType={"invisible"}
                            onClick={() => handleBagModal(true)}
                          />
                        </Box>
                      </Wrap>
                      <Wrap w={"100%"}>
                      <Box w={"50%"} style={{alignItems: "center"}}>
                          <PokeButton 
                            size="small"
                            variant="text"
                            color={"menuGreen"}
                            text="Pokemon"
                            styleType={"invisible"}
                            onClick={() => setOpenPokemonsModal(true)}
                          />
                        </Box>
                        <Box w={"50%"} style={{alignItems: "center"}}>
                          <PokeButton 
                            size="small"
                            variant="text"
                            color={"menuGreen"}
                            text="Run" 
                            styleType={"invisible"}
                            onClick={() => setOpenRunModal(true)}
                          />
                        </Box>
                      </Wrap>
                    </View>
                  </View>
                </Flex>


                {/* Pokemon level up modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openLevelUpModal}
                  onRequestClose={() => {
                    setOpenLevelUpModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      <View style={{marginBottom: 30}}>
                        <PokeText
                          text={'Level Up'}
                          color={"#000000"}
                          type={"h2"}
                        />
                      </View>

                      {props.userPokemonTrainer.pokemons[pokemonFightingIndex].skills.map((skill, i) => (
                        <Wrap w="100%" key={`skill-${i}`}>
                          <Box w="80%" mb={20}>
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
                          <Box w="20%">
                            <PokeIconButton
                              styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                              variant="contained"
                              color="#FFF"
                              icon="chevron-double-up"
                              onClick={() => handleImprooveAttack(skill)}
                              />
                          </Box>
                        </Wrap>
                        ))}
                      </View>
                    </View>
                  </Modal>


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
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      {props.userPokemonTrainer.pokemons[pokemonFightingIndex].skills.map((skill, i) => (
                        <Wrap w="100%" key={`skill-${i}`}>
                          <Box w="80%" mb={20}>
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
                          <Box w="20%">
                            <PokeIconButton
                              color="#fff"
                              isReadOnly={skill.ppNow === 0}
                              styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                              variant="contained"
                              icon="arrow-right"
                              onClick={() => handleAttack(skill)}
                              />
                          </Box>
                        </Wrap>
                        ))}
                        <PokeButton
                          styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          color="white"
                          text="Back"
                          onClick={() => setOpenPokemonAttackModal(false)}
                        />
                      </View>
                    </View>
                  </Modal>


                {/* Pokemons choose info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonInfoMessageModal}
                  onRequestClose={() => {
                    setOpenPokemonInfoMessageModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      <PokeText 
                        text={pokemonModalMessage}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                      <PokeButton
                        styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                        variant="contained"
                        size="fullwidth"
                        color="white"
                        text="Close"
                        onClick={() => {
                          setOpenPokemonInfoMessageModal(false);
                        }}
                      />
                    </View>
                  </View>
                </Modal>


                {/* Pokemons choose modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openPokemonsModal}
                  onRequestClose={() => {
                    setOpenPokemonsModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      {props.userPokemonTrainer.pokemons.length > 1 ? (
                        props.userPokemonTrainer.pokemons.map((pokemon, i) => (
                          i >= 1 && i < 5 && (
                            <View key={`item-${i}`}>
                              <Wrap w="100%">
                                <Box w="20%">
                                <Image
                                  style={{ width: 65, height: 65, left: -20 }}
                                  source={{
                                    uri: `${commonService.getPokemonMainImageFrontForBattle(
                                      pokemon?.sprites, pokemon.shiny
                                    )}`,
                                  }}
                                />
                                </Box>
                                <Box w="70%" mb={20}>
                                  <PokeText 
                                    text={`${commonService.stringToCapitalLetters(pokemon.name)}`}
                                    color={"#000000"}
                                    type={"skill-name"}
                                  />
                                <PokeText 
                                  text={pokemon.shiny ? `Lv: ${pokemon.level} | Shiny` : `Lv: ${pokemon.level}`}
                                  color={"#000000"}
                                  type={"pp-text"}
                                />
                                </Box>
                                <Box w="10%" pt={5}>
                                  <PokeIconButton
                                    isReadOnly={!(pokemon.hp > 0)}
                                    color="#fff"
                                    styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                                    variant="contained"
                                    icon="pokeball"
                                    onClick={() => handleChooseOtherPokemon(pokemon)}
                                  />
                                </Box>
                              </Wrap>
                              <Wrap mt={-25} mb={25} left={50}>
                              <Box radius={3} w={202} h={16} style={{backgroundColor: "#4E6648"}} >
                                {pokemon.hp > 0 && 
                                  <>
                                    <View style={{position: "absolute", zIndex: 200, bottom: 0, left: 2}}>
                                      <PokeText
                                        color={pokemon.hp > 25 ? "#4E6648" : "#000000"}
                                        text={`${pokemon.hp}/${pokemon.hpTotal}`}
                                        type={"battle-enemy-card-level"}
                                        />
                                    </View>
                                    <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3}                                       
                                      w={attacked ? Math.ceil((pokemon.hp * 200) / pokemon.hpTotal) : Math.ceil((pokemon.hp * 200) / pokemon.hpTotal) } 
                                      h={15}
                                      style={{backgroundColor: getHpBackgroundColor(pokemon.hp, pokemon.hpTotal)}}
                                      />
                                  </>
                                }
                              </Box>
                            </Wrap>
                          </View>                          
                          )
                        ))
                      ):(
                        <View style={{marginBottom: 50}}>
                          <PokeText 
                            text={`You have no Pokemons to choose`}
                            color={"#000000"}
                            type={"skill-name"}
                            />
                          </View>
                      )
                      }
                        <PokeButton
                          styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Back"
                          color="white"
                          onClick={() => setOpenPokemonsModal(false)}
                          />
                      </View>
                    </View>
                  </Modal>


                {/* Pokemon bag modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openBagModal}
                  onRequestClose={() => {
                    setOpenBagModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      {props.userPokemonTrainer.items.find(x => x.quantity > 0) ? (                      
                        props.userPokemonTrainer.items.map((item, i) => (
                          item.quantity > 0 && (
                            <Wrap w="100%" key={`item-${i}`}>
                              <Box w="20%">
                                <Image 
                                  source={
                                    item.name === "Potion" ? require('../../assets/images/icons/potion-mini.png') :
                                    item.name === "Super Potion" ? require('../../assets/images/icons/super-potion-mini.png') :
                                    item.name === "Hyper Potion" ? require('../../assets/images/icons/hyper-potion-mini.png') :
                                    item.name === "Death Potion" ? require('../../assets/images/icons/death-potion-mini.png') :
                                    item.name === "Pokeball" ? require('../../assets/images/pokeballs/pokeball-mini.png') :
                                    item.name === "Great Ball" ? require('../../assets/images/pokeballs/greatBall-mini.png') :
                                    item.name === "Master Ball" ? require('../../assets/images/pokeballs/masterBall-mini.png') :
                                    item.name === "Ultra Ball" ? require('../../assets/images/pokeballs/ultraBall-mini.png') :
                                    require('../../assets/images/pokeballs/pokeball-mini.png')
                                  } 
                                  style={{width: 35, height: 35}}
                                />
                              </Box>
                              <Box w="70%" mb={20}>
                                <PokeText 
                                  text={`${commonService.stringToCapitalLetters(item.name)}`}
                                  color={"#000000"}
                                  type={"skill-name"}
                                />
                              <PokeText 
                                text={`x${item.quantity}`}
                                color={"#000000"}
                                type={"pp-text"}
                              />
                              </Box>
                              <Box w="10%">
                                <PokeIconButton
                                  color="#fff"
                                  styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                                  variant="contained"
                                  icon="arrow-right"
                                  onClick={() => handleUseItem(item)}
                                />
                              </Box>
                            </Wrap>
                          )
                        ))
                      ):(
                        <View style={{marginBottom: 50}}>
                          <PokeText 
                            text={`You have no items`}
                            color={"#000000"}
                            type={"skill-name"}
                            />
                          </View>
                      )
                      }
                        <PokeButton
                          styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                          variant="contained"
                          size="fullwidth"
                          text="Back"
                          color="white"
                          onClick={() => setOpenBagModal(false)}
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
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
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
                          color="white"
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
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
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
                          color="white"
                          onClick={() => { 
                            setOpenModalGameOver(false);
                            stopSoundBackground();
                            playSoundFaintPokemon();
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
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
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
                          color="white"
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
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
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
                          color="white"
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
                  <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
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
                        color="white"
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
                    pokemonEnemyOpacity.value = withTiming(1, { duration: 500 });
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      <PokeText 
                        text={`${commonService.stringToCapitalLetters(pokemonEnemy.name)} was caught !!!`}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                      <PokeButton
                        styleType={pokemonEnemy?.type[0].type.name ?? ""}
                        variant="contained"
                        size="fullwidth"
                        text="Close"
                        color="white"
                        onClick={() => {
                          setOpenPokemonCaughtModal(false);
                          handleCaptureEnemy(pokemonEnemy);
                          handleRunAway();
                          didCapturePokemon.value = 0;
                          pokemonEnemyOpacity.value = withTiming(1, { duration: 3000 });
                        }}
                      />
                    </View>
                  </View>
                </Modal>


                {/* Pokemons choose info modal */}
                <Modal
                  animationType="slide"
                  transparent
                  visible={openRunModal}
                  onRequestClose={() => {
                    setOpenPokemonInfoMessageModal(false);
                  }}
                >
                  <View style={styles.centeredViewModal}>
                    <View style={[styles.modalViewModal, {overflow: "scroll", borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5}]}>
                      <PokeText 
                        text={"Do you wanna go back home? or keep searching for pokemons to battle?"}
                        color={"#000000"}
                        type={"battle-card-infos"}
                      />
                      <View style={{marginTop: 50}}/>
                      <PokeButton
                        styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                        variant="contained"
                        size="medium"
                        color="white"
                        text="Go back to home"
                        onClick={() => {
                          handleRunModal(false, "Home");
                        }}
                      />
                      <View style={{marginTop: 10}}/>
                      <PokeButton
                        styleType={props.userPokemonTrainer.pokemons[pokemonFightingIndex].type[0].type.name ?? ""}
                        variant="contained"
                        size="medium"
                        color="white"
                        text="Keep on Battling"
                        onClick={() => {
                          // handleRunModal(false, "Battle");                          
                          setOpenRunModal(false);
                        }}
                      />
                    </View>
                  </View>
                </Modal>


              </ImageBackground>
              ) : (
                !props.isBattling ? (
                  <ImageBackground  style={styles.image} source={require(`../../assets/images/characters/house.gif`)}>
                  <View style={{margin: 20}}>
                    <PokeText
                      backgroungColor="#fff"
                      text={`HOME`}
                      color={"#000"}
                      type={"gameover-title"}
                      />
                    <PokeText
                      backgroungColor="#fff"
                      text={`You're SAD as Fuck`}
                      color={"#000"}
                      type={"modal-text"}
                    />
                    <PokeButton
                      styleType={"dark"}
                      size="fullwidth"
                      variant="text"
                      color="white"
                      text={"be Happy Catchin' 'Em All"}
                      onClick={() => handleRunAway()}
                    />
                    </View>
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
                      text={healPokemonText}
                      onClick={() => handleHealAllPokemons()}
                    />
                    </View>
                  </ImageBackground>
                )
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

