import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { IconType } from "../icons/types/IconType";
import { StyleSheet } from "react-native";
import { useCommonService } from "../../service/common/CommonService";
import { Audio } from 'expo-av';

export type PokeIconButtonProps = {
  icon?: IconType;
  variant: "text" | "outlined" | "contained";
  styleType: string;
  color: string;
  isReadOnly?: boolean;
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
    },
  });

  const [soundSelectButton, setSoundSelectButton] = useState<any>();
  const playSoundSelectButton = async () => {
    const { sound } = await Audio.Sound.createAsync(require('../../assets/musics/selectButton.mp3'));
    setSoundSelectButton(sound);
    await sound.playAsync();
  }

  useEffect(() => {
    return soundSelectButton
    ? () => {
      soundSelectButton.unloadAsync();
    }
    : undefined;
  }, [soundSelectButton]);


  const handleClick = (e: any) => {
    playSoundSelectButton();
    buttonProps.onClick(e);
  }

  return (
    <IconButton
      disabled={buttonProps.isReadOnly}      
      style={buttonProps.isReadOnly ? [styles.button, {backgroundColor: "#fff"}] : styles.button}
      icon={(props) => (
        <Icon name={buttonProps.icon} {...props} color={buttonProps.color} />
      )}
      onPress={(e) => handleClick(e)}
    />
  );
}
