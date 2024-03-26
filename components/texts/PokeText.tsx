import React from "react";
import { Text } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";

export type PokeTextProps = {
  text: string;
  color: string;
  type: "h1" | "h2" | "card-title" | "card-title-big" | "card-id" | "card-id-big" | "card-text" 
  | "card-text-big" | "battle-enemy-card-name" | "battle-enemy-card-level" | "modal-title";
  hasShadow?: boolean;
};

function PokeText(props: PokeTextProps) {
  const styles = StyleSheet.create({
    h1: {
      fontFamily: "PressStart",
      fontSize: 20,
      textAlign: "center",
    },
    h2: {
      fontSize: 35,
      fontFamily: "Orbitron",
      textAlign: "center",
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 20,
      fontFamily: "SpaceGrotesk",
      textAlign: "center",
      marginBottom: 5,
      marginTop: 5,
    },
    cardTitleBig: {
      fontSize: 40,
      fontFamily: "SpaceGrotesk",
      textAlign: "center",
      marginBottom: 5,
      marginTop: 5,
    },
    cardId: {
      padding: 3,
      position: "absolute",
      fontSize: 25,
      fontFamily: "SpaceGrotesk",
      textAlign: "left",
      fontWeight: "800",
      color: "#ED5463",
      zIndex: 1000
    },
    cardIdBig: {
      paddingTop: 10,
      paddingLeft: 10,
      position: "absolute",
      fontSize: 40,
      fontFamily: "SpaceGrotesk",
      textAlign: "left",
    },
    cardText: {
      fontSize: 15,
      fontFamily: "Heebo",
      textAlign: "left",
    },
    cardTextBig: {
      fontSize: 17,
      fontFamily: "Heebo",
      textAlign: "left",
    },
    battleEnemyCardName: {
      paddingTop: 5,
      fontFamily: "PressStart",
      fontSize: 13,
    },
    battleEnemyCardLevel: {
      fontSize: 13,
      fontFamily: "Orbitron",
      textAlign: "left",
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: "Orbitron",
      textAlign: "center",
      marginBottom: 20,
    },
  });

  //Fonts
  const [loaded] = useFonts({
    Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf"),
    PressStart: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    SpaceGrotesk: require("../../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
    Heebo: require("../../assets/fonts/Heebo-VariableFont_wght.ttf"),
  });

  const getStyleFromType = (type: string) => {
    const stylesArray = [
      { name: "h1", value: styles.h1 },
      { name: "h2", value: styles.h2 },
      { name: "card-title", value: styles.cardTitle },
      { name: "card-title-big", value: styles.cardTitleBig },
      { name: "card-id", value: styles.cardId },
      { name: "card-id-big", value: styles.cardIdBig },
      { name: "card-text", value: styles.cardText },
      { name: "card-text-big", value: styles.cardTextBig },
      { name: "battle-enemy-card-name", value: styles.battleEnemyCardName },
      { name: "battle-enemy-card-level", value: styles.battleEnemyCardLevel },
      { name: "modal-title", value: styles.modalTitle },
    ];
    return stylesArray.find((x) => x.name === type)?.value;
  };

  return (
    <>
      {loaded && (
        <Text style={getStyleFromType(props.type)} color={props.color}>
          {props.text}
        </Text>
      )}
    </>
  );
}

export default PokeText;
