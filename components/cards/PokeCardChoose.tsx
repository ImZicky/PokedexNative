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
    cardImage: { marginTop: 30, padding: 20, width: 100, height: 100 },
  });

  //Navigation

  return (
    <Box
      style={{
        minWidth: 163,
        width: "auto",
        minHeight: 370,
        height: "auto",
        backgroundColor: "#fff",
        borderRadius: 15,
        margin: 3,
        flex: 2,
      }}
    >
      <PokeText
        color="#000"
        type="card-id"
        text={`#${props.pokemon.id.toString()}`}
      />

      <Flex style={styles.centeredDiv}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${commonService.getPokemonMainImage(props.pokemon.sprites)}`,
          }}
        />
      </Flex>
      <Flex style={styles.centeredDiv}>
        <PokeText color="#000" type="card-title" text={commonService.stringToCapitalLetters(props.pokemon.name)} />
        <Wrap
          spacing={5}
          style={{
            marginHorizontal: 2,
          }}
        >
          {props.pokemon.types.map((type, i) => (
            <Chip
              key={`${props.pokemon.name}_type_${type.type.name}`}
              style={{
                backgroundColor: commonService.getColorFromType(type.type.name),
                alignItems: "center"
              }}
              color="#FFF"              
              label={type.type.name.toUpperCase()}            
            />
          ))}
        </Wrap>

        <Wrap
          style={{
            marginTop: 10,
          }}
        >
          <PokeText color="#000" type="card-text" text="Height: " />
          <PokeText
            color="#000"
            type="card-text"
            text={commonService.getPokemonHeight(props.pokemon.height)}
          />
        </Wrap>
        <Wrap
          style={{
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <PokeText color="#000" type="card-text" text="Wheight: " />
          <PokeText
            color="#000"
            type="card-text"
            text={commonService.getPokemonWheight(props.pokemon.weight)}
          />
        </Wrap>
        <PokeButton
          onClick={() => props.onChoose(props.pokemon)}
          text="Choose"
          variant="contained"
          styleType={props.pokemon.types[0].type.name}
          size="small"
        />
      </Flex>
    </Box>
  );
}

export default PokeCardChoose;
