import React from "react";
import { Box, Flex, Wrap, Chip } from "@react-native-material/core";
import PokeText from "../texts/PokeText";
import { Pokemon } from "pokenode-ts";
import { StyleSheet, Image } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import PokeButton from "../buttons/PokeButton";
import { useNavigation } from "@react-navigation/native";

export type PokeCardProps = {
  pokemon: Pokemon;
  onChoose: (pokemon: Pokemon) => void
};

function PokeCardChoose(props: PokeCardProps) {
  //Services
  const commonService = useCommonService();

  //Style
  const styles = StyleSheet.create({
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: { marginTop: 10, marginBottom: 10, width: 100, height: 110 },
  });

  //Navigation

  return (
    <Box
      style={{
        minWidth: 163,
        width: "auto",
        minHeight: 240,
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 3,
        flex: 2,
        borderColor: commonService.getColorFromType(props.pokemon.types[0].type.name),
        borderStyle: "solid",
        borderWidth: 5
      }}
    >
      <PokeText color="#000" type="card-title" text={commonService.stringToCapitalLetters(props.pokemon.name)} />
      <Flex style={styles.centeredDiv}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${commonService.getPokemonMainImageFrontForBattle(props.pokemon.sprites, true)}`,
          }}
        />
      </Flex>
      <Flex style={styles.centeredDiv}>
        <PokeButton
          onClick={() => props.onChoose(props.pokemon)}
          text="Choose"
          variant="contained"
          styleType={props.pokemon.types[0].type.name}
          size="small"
          color="white"
        />
      </Flex>
    </Box>
  );
}

export default PokeCardChoose;
