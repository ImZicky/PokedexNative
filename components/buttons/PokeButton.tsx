import React from "react";
import { Button } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconType } from "../icons/types/IconType";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { useCommonService } from "../../service/common/CommonService";

export type ButtonProps = {
  text: string;
  size: "fullwidth" | "medium" | "small";
  icon?: IconType;
  loading?: boolean;
  variant: "text" | "outlined" | "contained";
  isReadOnly?: boolean;
  styleType: string;
  onClick?: (event: any) => void;
};

export default function PokeButton(buttonProps: ButtonProps) {
  //Services
  const commonService = useCommonService();

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

  const styles = StyleSheet.create({
    button: {
      backgroundColor: commonService.getColorFromType(buttonProps.styleType),
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
      onPress={buttonProps.onClick}
    />
  ) : (
    <Button
      style={styles.button}
      title={buttonProps.text}
      variant={buttonProps.variant}
      loading={buttonProps.loading}
      disabled={buttonProps.isReadOnly}
      onPress={buttonProps.onClick}
    />
  );
}
