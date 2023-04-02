import React from "react";
import { Flex, HStack } from "@react-native-material/core";
import { Image, StyleSheet } from "react-native";
import PokeText from "../texts/PokeText";

export type PokeLoadingProps = {};

function PokeLoading(pros: PokeLoadingProps) {
  const styles = StyleSheet.create({
    view: {
      backgroundColor: "#FFF",
      width: "100%",
      height: "100%",
      position: "relative",
      alignItems: "center",
      flex: 1,
      justifyContent: "center",
    },
    pokeball: {
      width: 300,
      height: 300,
    },
    loader: {
      width: 100,
      height: 100,
      float: "left",
    },
  });

  return (
    <Flex fill style={styles.view}>
      <Image
        style={styles.pokeball}
        source={require("../../assets/images/pikachu-loader.gif")}
      />
      <PokeText text="Carregando" color={"#000"} type={"h2"} />
      <Image
        style={styles.loader}
        source={require("../../assets/images/loader.gif")}
      />
    </Flex>
  );
}

export default PokeLoading;
