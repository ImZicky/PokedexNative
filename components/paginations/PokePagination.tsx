import { Flex, Wrap, Box } from "@react-native-material/core";
import React from "react";
import PokeIconButton from "../buttons/PokeIconButton";
import PokeText from "../texts/PokeText";
import { StyleSheet } from "react-native";

export type PokePaginationProps = {
  pageNumber: number;
  changePage: (pageNumber: number) => void;
};

export default function PokePagination(props: PokePaginationProps) {
  //Style
  const styles = StyleSheet.create({
    centeredDiv: {
      alignItems: "center",
      alignContent: "center",
    },
  });

  return (
    <Flex style={styles.centeredDiv}>
      <Wrap>
        <Box m={10}>
          <PokeIconButton
            onClick={() => props.changePage(props.pageNumber - 1)}
            variant="contained"
            styleType="primary"
            icon="arrow-left"
          />
        </Box>
        <Box m={10} pt={10}>
          <PokeText
            color="#FFF"
            type="h1"
            text={`${props.pageNumber + 1} de ${parseInt(`${1010 / 50 + 1}`)}`}
          />
        </Box>
        <Box m={10}>
          <PokeIconButton
            onClick={() => props.changePage(props.pageNumber + 1)}
            variant="contained"
            styleType="primary"
            icon="arrow-right"
          />
        </Box>
      </Wrap>
    </Flex>
  );
}
