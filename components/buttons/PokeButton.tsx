import React from "react";
import { Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconType } from "../icons/types/IconType";
import { StyleSheet } from "react-native";

export type ButtonProps = {
  text: string;
  size: "fullwidth" | "medium" | "small";
  icon?: IconType;
  loading?: boolean;
  variant: "text" | "outlined" | "contained";
  isReadOnly?: boolean;
  type: string;
};

export default function PokeButton(buttonProps: ButtonProps) {
  //Consts

  //Miscelaneus methods
  const getWidthFromSize = (size: string) => {
    switch (size) {
      case "fullwidth":
        return "100%";
      case "medium":
        return 200;
      case "small":
        return 120;
      default:
        return 120;
    }
  };

  //Style methods
  const getColorFromType = (type: string) => {
    switch (type) {
      case "primary":
        return "#a30000";
      case "secondary":
        return "#000000";
      case "bug":
        return "#97c220";
      case "dark":
        return "#50495f";
      case "dragon":
        return "#0969c2";
      case "electric":
        return "#f4d543";
      case "fairy":
        return "#ed8fe5";
      case "fighting":
        return "#cf4068";
      case "fire":
        return "#ffa053";
      case "flying":
        return "#92acdf";
      case "ghost":
        return "#606dbb";
      case "grass":
        return "#5fba58";
      case "ground":
        return "#dc8658";
      case "ice":
        return "#6ccdbf";
      case "normal":
        return "#959ca1";
      case "poison":
        return "#a765c8";
      case "psychic":
        return "#f86e74";
      case "rock":
        return "#cbbd8d";
      case "steel":
        return "#548f9f";
      case "water":
        return "#5398d8";
      default:
        return "#a30000";
    }
  };

  const styles = StyleSheet.create({
    button: {
      backgroundColor: getColorFromType(buttonProps.type),
      width: getWidthFromSize(buttonProps.size),
    },
  });

  return buttonProps.icon ? (
    <Button
      style={styles.button}
      title={buttonProps.text}
      variant={buttonProps.variant}
      loading={buttonProps.loading}
      disabled={buttonProps.isReadOnly}
      trailing={(props) => <Icon name={buttonProps.icon} {...props} />}
    />
  ) : (
    <Button
      style={styles.button}
      title={buttonProps.text}
      variant={buttonProps.variant}
      loading={buttonProps.loading}
      disabled={buttonProps.isReadOnly}
    />
  );
}
