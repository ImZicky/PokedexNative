import React from "react";
import { Flex, HStack } from "@react-native-material/core";
import { ActivityIndicator, Image, StyleSheet } from "react-native";
import PokeText from "../texts/PokeText";

export type PokeLoadingProps = {
  loadType: "page" | "list";
};

function PokeLoading(props: PokeLoadingProps) {
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
    listView: {
      backgroundColor: "#FFF",
      width: "auto",
      height: "auto",
      padding: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
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
    <>
      {props.loadType === "page" && (
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
      )}
      {props.loadType === "list" && (
        <Flex fill style={styles.listView}>
          <Image
            style={styles.loader}
            source={require("../../assets/images/pokeball-loader.gif")}
          />
          <PokeText text="Carregando" color={"#000"} type={"h2"} />
        </Flex>
      )}
    </>
  );
}

export default PokeLoading;
