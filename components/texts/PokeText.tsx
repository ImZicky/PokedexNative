import React from "react";
import { Text } from "@react-native-material/core";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";

export type PokeTextProps = {
  text: string;
  color: string;
  type: string;
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
    cardId: {
      position: "absolute",
      fontSize: 25,
      fontFamily: "SpaceGrotesk",
      textAlign: "left",
    },
  });

  //Fonts
  const [loaded] = useFonts({
    Orbitron: require("../../assets/fonts/Orbitron-VariableFont_wght.ttf"),
    PressStart: require("../../assets/fonts/PressStart2P-Regular.ttf"),
    SpaceGrotesk: require("../../assets/fonts/SpaceGrotesk-VariableFont_wght.ttf"),
  });

  const getStyleFromType = (type: string) => {
    const stylesArray = [
      { name: "h1", value: styles.h1 },
      { name: "h2", value: styles.h2 },
      { name: "card-title", value: styles.cardTitle },
      { name: "card-id", value: styles.cardId },
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
