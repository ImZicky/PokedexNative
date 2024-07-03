import React, { useEffect, useState } from "react";
import { Box, Flex, Wrap, Chip } from "@react-native-material/core";
import PokeText from "../texts/PokeText";
import { Pokemon } from "pokenode-ts";
import { StyleSheet, Image, View, Modal } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import PokeButton from "../buttons/PokeButton";
import { PokemonForBattle } from "../../service/api/types/PokemonForBattle";
import { MusicName } from "../../service/api/types/Music";
import { PokemonTrainerItem } from "../../service/api/types/PokemonTrainer";
import PokeIconButton from "../buttons/PokeIconButton";
import { Audio } from "expo-av";

export type PokeCardManagementProps = {
  pokemon: PokemonForBattle;
  items: PokemonTrainerItem[];
  navigation: any;
  index: number;
  isBattling: boolean;
  handleHealPokemon: (position: number, potionName: string) => void;
  handleSetToBattlePokemon: (pokemon: PokemonForBattle) => void;
  playSoundDefault: (name: MusicName) => void;
};

function PokeCardManagement(props: PokeCardManagementProps) {
  // PROPS
  const [openBagModal, setOpenBagModal] = useState<boolean>(false);
  const [
    openWarnStoppingBatlingFirstModal,
    setOpenWarnStoppingBatlingFirstModal,
  ] = useState<boolean>(false);

  //Services
  const commonService = useCommonService();

  // HANDLERS
  const getHpWidth = (hp: number, hpTotal: number) => {
    const maxValue = 150;
    return Math.ceil((hp * maxValue) / hpTotal);
  };

  const getHpBackgroundColor = (hp: number, hpTotal: number): string => {
    const maxValue = 200;
    const percent = Math.ceil((hp * maxValue) / hpTotal);
    if (percent > 100) return "#6BF6A7";
    if (percent <= 100 && percent > 50) return "#F2CF3C";
    if (percent <= 50) return "#E75342";
  };

  const handleUseItemModal = (value: boolean, pokemon?: PokemonForBattle) => {
    setOpenBagModal(value);
  };

  const handleInsertIntoBattleModal = (pokemon: PokemonForBattle) => {
    props.handleSetToBattlePokemon(pokemon);
  };

  const handleUseItem = (item: PokemonTrainerItem, pokemonIndex: number) => {
    if (item.category === "Heal") {
      playSoundHealPokemon();
      props.handleHealPokemon(pokemonIndex, item.name);
    }
    setOpenBagModal(false);
  };

  // MUSIC
  const [soundHealPokemon, setSoundHealPokemon] = useState<any>();

  const playSoundHealPokemon = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/musics/heal.mp3")
    );
    setSoundHealPokemon(sound);
    await sound.playAsync();
  };

  // USE EFFECT
  useEffect(() => {
    return soundHealPokemon
      ? () => {
          soundHealPokemon.unloadAsync();
        }
      : undefined;
  }, [soundHealPokemon]);

  //Style
  const styles = StyleSheet.create({
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: { marginTop: 50, padding: 20, width: 100, height: 100 },
    pokeballImage: {
      position: "absolute",
      right: 3,
      width: 35,
      height: 35,
    },
    centeredViewModal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalViewModal: {
      margin: 10,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },
  });

  return (
    <Box
      style={{
        minWidth: 200,
        width: "auto",
        minHeight: 370,
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 3,
        flex: 2,
        borderColor: commonService.getColorFromType(
          props.pokemon.type[0].type.name
        ),
        borderStyle: "solid",
        borderWidth: 5,
      }}
    >
      <Wrap>
        <Box
          w={160}
          style={{
            minWidth: 150,
            minHeight: 370,
            height: "auto",
            backgroundColor: "#FFF",
            borderRadius: 15,
            borderColor: commonService.getColorFromType(
              props.pokemon.type[0].type.name
            ),
            borderStyle: "solid",
          }}
        >
          <PokeText
            backgroungColor={commonService.getColorFromType(
              props.pokemon.type[0].type.name
            )}
            color={"#ffffff"}
            type="card-id"
            text={`#${props.pokemon.id.toString()} `}
          />
          {
            <Image
              source={
                props.pokemon.pokeball === "Great Ball"
                  ? require("../../assets/images/pokeballs/greatBall-mini.png")
                  : props.pokemon.pokeball === "Ultra Ball"
                  ? require("../../assets/images/pokeballs/ultraBall-mini.png")
                  : props.pokemon.pokeball === "Master Ball"
                  ? require("../../assets/images/pokeballs/masterBall-mini.png")
                  : require("../../assets/images/pokeballs/pokeball-mini.png")
              }
              style={styles.pokeballImage}
            />
          }
          <Flex style={styles.centeredDiv}>
            {props.index <= 5 && (
              <Image
                // style={{width: 25, height: 25, position: "absolute", right: -15, top: 110}}
                style={{
                  width: 35,
                  height: 35,
                  position: "absolute",
                  right: 43,
                  top: 0,
                }}
                source={require("../../assets/images/icons/check.gif")}
              />
            )}

            {props.pokemon.shiny ? (
              <View>
                <Image
                  style={styles.cardImage}
                  source={{
                    uri: `${commonService.getPokemonMainImageFrontForBattle(
                      props.pokemon.sprites,
                      props.pokemon.shiny
                    )}`,
                  }}
                />
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    position: "absolute",
                    right: -15,
                    top: 110,
                  }}
                  // style={{width: 35, height: 35, position: "absolute", right: 15, top: 3}}
                  source={require("../../assets/images/icons/star-shiny.gif")}
                />
              </View>
            ) : (
              <Image
                style={styles.cardImage}
                source={{
                  uri: `${commonService.getPokemonMainImageFrontForBattle(
                    props.pokemon.sprites,
                    props.pokemon.shiny
                  )}`,
                }}
              />
            )}
          </Flex>

          <View style={styles.centeredDiv}>
            <PokeText
              color="#000"
              type="card-title"
              text={`${commonService.stringToCapitalLetters(
                props.pokemon.nickname
                  ? props.pokemon.nickname
                  : props.pokemon.name
              )}`}
            />
            <PokeText
              color="#000"
              type="card-text-big"
              text={`Lv${props.pokemon.level}`}
            />
            <Wrap
              spacing={5}
              style={{
                marginHorizontal: 2,
              }}
            >
              {props.pokemon.type.map((type, i) => (
                <Image
                  key={`${props.pokemon.name}_type_${type.type.name}`}
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
              ))}
            </Wrap>

            <Wrap mt={10}>
              <Box
                w={151}
                h={16}
                style={{ backgroundColor: "#4E6648" }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 200,
                    bottom: 0,
                    left: 2,
                  }}
                >
                  <PokeText
                    color={props.pokemon.hp > 25 ? "#000000" : "#000000"}
                    text={`HP: ${props.pokemon.hp}/${props.pokemon.hpTotal}`}
                    type={"battle-enemy-card-level"}
                  />
                </View>
                <Box
                  borderStyle="solid"
                  borderColor={"#4E6648"}
                  border={1}
                  radius={3}
                  w={getHpWidth(props.pokemon.hp, props.pokemon.hpTotal)}
                  h={15}
                  style={{
                    backgroundColor: getHpBackgroundColor(
                      props.pokemon.hp,
                      props.pokemon.hpTotal
                    ),
                  }}
                />
              </Box>
            </Wrap>

            <Wrap mt={10}>
              <Box
                radius={5}
                w={151}
                h={16}
                style={{ backgroundColor: "#4E6648" }}
              >
                <View
                  style={{
                    position: "absolute",
                    zIndex: 200,
                    bottom: 0,
                    left: 2,
                  }}
                >
                  <PokeText
                    color={"#000"}
                    text={`XP: ${props.pokemon.levelXp}/${
                      (props.pokemon.level + 1) * 100
                    }`}
                    type={"battle-enemy-card-level"}
                  />
                </View>
                <Box
                  borderStyle="solid"
                  borderColor={"#4E6648"}
                  border={1}
                  radius={3}
                  w={150}
                  style={{ backgroundColor: "#6BF6A7" }}
                  h={15}
                />
              </Box>
            </Wrap>
          </View>

          <View
            style={{
              width: 160,
              height: 60,
              alignItems: "center",
            }}
          >
            {props.index <= 5 ? (
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <PokeButton
                  onClick={() => handleUseItemModal(true, props.pokemon)}
                  text="Use Item"
                  variant="contained"
                  size="small"
                  styleType={props.pokemon.type[0].type.name}
                  color={"white"}
                />
              </View>
            ) : (
              <View style={{ marginTop: 20, marginBottom: 10 }}>
                <PokeButton
                  onClick={() =>
                    props.isBattling
                      ? setOpenWarnStoppingBatlingFirstModal(true)
                      : handleInsertIntoBattleModal(props.pokemon)
                  }
                  text="battler"
                  variant="outlined"
                  size="small"
                  styleType={props.pokemon.type[0].type.name}
                  color={"white"}
                />
              </View>
            )}
          </View>
        </Box>
        <Box
          w={160}
          style={{
            minWidth: 150,
            minHeight: 370,
            height: "auto",
            backgroundColor: commonService.getColorFromType(
              props.pokemon.type[0].type.name
            ),
            flex: 2,
            borderColor: commonService.getColorFromType(
              props.pokemon.type[0].type.name
            ),            
            borderStyle: "solid",
            borderWidth: 5,
          }}
        >
          <View
            style={{
              backgroundColor: commonService.getColorFromType(
                props.pokemon.type[0].type.name
              ),
              width: 160,
              paddingTop: 20,
              paddingStart: 10,
            }}
          >
            <PokeText color="#FFF" type="skill-name" text={`Skills`} />
            <View style={{ marginTop: 10 }}>
              {props.pokemon.skills &&
                props.pokemon.skills.map((x, i) => (
                  <View
                    style={{ marginTop: 7 }}
                    key={`pokemon_${props.pokemon.name}_skill_${i}`}
                  >
                    <PokeText
                      color="#FFF"
                      type="card-text"
                      text={`[${x.name}]`}
                      hasShadow
                    />
                    <PokeText
                      color="#FFF"
                      type="pp-text"
                      text={`pp: ${x.ppNow}/${x.ppTotal} | dmg: ${x.damage}`}
                    />
                  </View>
                ))}
            </View>
          </View>
        </Box>
      </Wrap>

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
          <View
            style={[
              styles.modalViewModal,
              { borderColor: "#4E6648", borderStyle: "solid", borderWidth: 5 },
            ]}
          >
            {props.items.find((x) => x.quantity > 0) ? (
              props.items.map(
                (item, i) =>
                  item.quantity > 0 &&
                  item.category === "Heal" && (
                    <Wrap w="100%" key={`item-${i}`}>
                      <Box w="20%">
                        <Image
                          source={
                            item.name === "Potion"
                              ? require("../../assets/images/icons/potion-mini.png")
                              : item.name === "Super Potion"
                              ? require("../../assets/images/icons/super-potion-mini.png")
                              : item.name === "Hyper Potion"
                              ? require("../../assets/images/icons/hyper-potion-mini.png")
                              : require("../../assets/images/icons/death-potion-mini.png")
                          }
                          style={{ width: 35, height: 35 }}
                        />
                      </Box>
                      <Box w="70%" mb={20}>
                        <PokeText
                          text={`${commonService.stringToCapitalLetters(
                            item.name
                          )}`}
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
                          styleType={props.pokemon.type[0].type.name ?? ""}
                          variant="contained"
                          icon="arrow-right"
                          onClick={() => handleUseItem(item, props.index)}
                        />
                      </Box>
                    </Wrap>
                  )
              )
            ) : (
              <View style={{ marginBottom: 50 }}>
                <PokeText
                  text={`You have no items`}
                  color={"#000000"}
                  type={"skill-name"}
                />
              </View>
            )}
            <PokeButton
              styleType={props.pokemon.type[0].type.name ?? ""}
              variant="contained"
              size="fullwidth"
              text="Back"
              color="white"
              onClick={() => setOpenBagModal(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Pokemons choose info modal */}
      <Modal
        animationType="slide"
        transparent
        visible={openWarnStoppingBatlingFirstModal}
        onRequestClose={() => {
          setOpenWarnStoppingBatlingFirstModal(false);
        }}
      >
        <View style={styles.centeredViewModal}>
          <View
            style={[
              styles.modalViewModal,
              {
                overflow: "scroll",
                borderColor: "#4E6648",
                borderStyle: "solid",
                borderWidth: 5,
              },
            ]}
          >
            <PokeText
              text={"First stop battling by running back home"}
              color={"#000000"}
              type={"battle-card-infos"}
            />
            <View style={{ marginTop: 50 }} />
            <PokeButton
              styleType={props.pokemon.type[0].type.name ?? ""}
              variant="contained"
              size="medium"
              color="white"
              text="OK"
              onClick={() => {
                setOpenWarnStoppingBatlingFirstModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </Box>
  );
}

export default PokeCardManagement;
