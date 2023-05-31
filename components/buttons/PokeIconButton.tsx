import React from "react";
import { Button, IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconType } from "../icons/types/IconType";
import { StyleSheet } from "react-native";
import { useCommonService } from "../../service/common/CommonService";

export type PokeIconButtonProps = {
  icon?: IconType;
  variant: "text" | "outlined" | "contained";
  styleType: string;
  onClick?: (event: any) => void;
};

export default function PokeIconButton(buttonProps: PokeIconButtonProps) {
  //Services
  const commonService = useCommonService();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: commonService.getColorFromType(buttonProps.styleType),
      width: 40,
      height: 40,
      color: "#FFF",
    },
  });

  return (
    <IconButton
      style={styles.button}
      icon={(props) => (
        <Icon name={buttonProps.icon} {...props} color={"#FFF"} />
      )}
      onPress={buttonProps.onClick}
    />
  );
}
