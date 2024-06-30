import React from "react";
import { Box, Flex, Wrap, Chip } from "@react-native-material/core";
import PokeText from "../texts/PokeText";
import { Pokemon } from "pokenode-ts";
import { StyleSheet, Image, View } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import { PokemonForBattle } from "../../service/api/types/PokemonForBattle";

export type PokeCardFavoriteProps = {
  pokemon: PokemonForBattle;
};

function PokeCardFavorite(props: PokeCardFavoriteProps) {
  //Services
  const commonService = useCommonService();

  //Style
  const styles = StyleSheet.create({
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
    cardImage: { marginTop: 20, marginBottom: 0, width: 100, height: 110, },
  });

  return (
    <Box
      style={{
        minWidth: 160,
        width: "auto",
        minHeight: 170,
        height: "auto",
        backgroundColor: commonService.getColorFromType(props.pokemon.type[0].type.name),
        borderRadius: 20,
        margin: 3,
        marginBottom: 0,
        flex: 2,
        borderColor: "#c52222",
        borderStyle: "solid",
        borderWidth: 2
      }}
      >
      <View style={{width: "100%", alignItems: "center", marginTop: 5}}>
        <PokeText color={"#FFF"} type="battle-enemy-card-name" text={props.pokemon.nickname ? commonService.stringToCapitalLetters(props.pokemon.nickname) : commonService.stringToCapitalLetters(props.pokemon.name)} />
      </View>
      <Flex style={styles.centeredDiv}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${commonService.getPokemonMainImageFrontForBattle(props.pokemon.sprites, true)}`,
          }}
          />
      </Flex>
    </Box>
  );
}

export default PokeCardFavorite;
