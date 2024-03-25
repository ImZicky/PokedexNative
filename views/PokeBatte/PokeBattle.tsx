import React, { useEffect, useState } from "react";
import { UserCredentials, UserCriteria } from "../../service/api/types/User";
import { Box, Flex, Wrap } from "@react-native-material/core";
import { Pokemon, PokemonAbility } from "pokenode-ts";
import { StyleSheet, Image, ImageBackground, View } from "react-native";
import PokeTextField from "../../components/textfields/PokeTextField";
import PokeLoading from "../../components/loader/PokeLoading";
import PokeText from "../../components/texts/PokeText";
import { usePokemonService } from "../../service/api/PokemonService";
import { useCommonService } from "../../service/common/CommonService";
import UseUserService from "../../service/api/UserService";
import { PokemonForBattle, PokemonForBattleSkills } from "../../service/api/types/PokemonForBattle";
import { SlideInLeft } from "react-native-reanimated";

export type PokeBattleProps = {
  handlerUser: (userLogin: UserCredentials) => void;
};

const DefaultValueUser = {
  password: "",
  email: "",

  pokemons: [] // fazer uma lista de 5 pokemons principais
};

function PokeBattle(props: PokeBattleProps) {
  //Consts
  const [userCriteria] = useState<UserCriteria>(DefaultValueUser);
  const [pokemonEnemy, setPokemonEnemy] = useState<PokemonForBattle | undefined>(undefined);
  const [pokemonEnemyType, setPokemonEnemyType] = useState<string>("grass");
  const [pokemonTypeColor, setPokemonTypeColor] = useState<
    string | undefined
  >();
  
  const playersPokemonLevel = 10; // TODO: TRAZER DO PLAYER MESMO

  //Services
  const pokemonService = usePokemonService();
  const commonService = useCommonService();
  const userService = UseUserService();


  //Methods

  //UseEffect
  useEffect(() => {
    const fetchPokemon = async () => {
      pokemonService
        .getRamdomPokemon()
        .then((data) => {
          pokemonService.getPokemonEnemyForBattle(data, playersPokemonLevel).then(pokeEnemy => {
            setPokemonEnemy(pokeEnemy);
          });
          setPokemonTypeColor(
            commonService.getColorFromType(data?.types[0].type.name ?? "")
          );
          setPokemonEnemyType((data?.types[0].type.name ?? "grass"));
        })
        .catch((error) => console.error(error));
    };
    if (pokemonEnemy === undefined || pokemonEnemy.hp <= 0) fetchPokemon();
  });

  //Methods

  //Style
  const styles = StyleSheet.create({
    view: {
      // background: pokemonTypeColor,
      // width: "100%",
      // height: "100%",
      // position: "relative",
      // alignItems: "center",
      // flex: 0,
      // justifyContent: "center",
    },
    image: {
      flex: 1,
      justifyContent: 'center',
    },
    enemyDiv: {
      marginBottom: 100, 
      marginLeft: 100,
      alignItems: "center",
      alignContent: "center",
    },
    enemyDivHeader: {
      width: '100%',
      flex: 2
    },
    enemyDivInfosBorder: {
      padding: 5,
      marginRight: 150,
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

      width: 240,
      height: 70,
      borderTopEndRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 25,
      borderTopStartRadius: 25,
      alignItems: "center",
      alignContent: "center",
      backgroundColor: "#ECEDD0"
    },
    enemyImage: { width: 170, height: 170 },
  });

  return (
    <>
      {pokemonEnemy ? (
        <>
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
                        <Box borderStyle="solid" borderColor={"#4E6648"} border={1} radius={3} w={pokemonEnemy.hp * 2} h={13} style={{backgroundColor: pokemonEnemy.hp > 50 ? "#6BF6A7" : pokemonEnemy.hp > 25 ? "#F2CF3C" : "#E75342"}} />
                      </Box>
                    </Wrap>
                    </Flex>
                </View>
                </View>
              <Image
                style={styles.enemyImage}
                source={{
                  uri: `${commonService.getPokemonMainImage(
                    pokemonEnemy?.sprites
                  )}`,
                }}
              />
            </Flex>
          </ImageBackground>
        </>
      ) : (
        <PokeLoading loadType="page" />
      )}
    </>
  );
}

export default PokeBattle;
